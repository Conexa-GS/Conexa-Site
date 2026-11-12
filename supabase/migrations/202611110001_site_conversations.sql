-- T34/T35: base de mensagens internas. Aplicação no demo depende de autorização.
begin;
create table public.site_conversations (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('bot','direct')),
  created_by uuid not null references public.participants(id),
  peer_low uuid references public.participants(id),
  peer_high uuid references public.participants(id),
  created_at timestamptz not null default now(),
  check ((kind='bot' and peer_low is null and peer_high is null) or
    (kind='direct' and peer_low is not null and peer_high is not null and peer_low < peer_high and created_by in (peer_low,peer_high)))
);
create unique index site_bot_owner on public.site_conversations(created_by) where kind='bot';
create unique index site_direct_pair on public.site_conversations(peer_low,peer_high) where kind='direct';
create table public.site_conversation_members (
  conversation_id uuid not null references public.site_conversations(id),
  participant_id uuid not null references public.participants(id),
  last_read_seq bigint not null default 0 check (last_read_seq>=0),
  primary key (conversation_id,participant_id)
);
create index on public.site_conversation_members(participant_id);
create table public.site_messages (
  id uuid primary key default gen_random_uuid(),
  seq bigint generated always as identity unique,
  conversation_id uuid not null references public.site_conversations(id),
  sender_id uuid not null references public.participants(id),
  client_send_id uuid not null,
  body text not null check (length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  unique(sender_id,client_send_id),
  foreign key(conversation_id,sender_id) references public.site_conversation_members(conversation_id,participant_id)
);
create index on public.site_messages(conversation_id,seq desc);

-- Só responde se a identidade atual é membro; não aceita identidade fornecida pelo cliente.
create function public.site_is_member(p_conversation uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.site_conversation_members
    where conversation_id=p_conversation and participant_id=(select auth.uid()));
$$;
revoke all on function public.site_is_member(uuid) from public,anon;
grant execute on function public.site_is_member(uuid) to authenticated;
alter table public.site_conversations enable row level security;
alter table public.site_conversation_members enable row level security;
alter table public.site_messages enable row level security;
revoke all on public.site_conversations,public.site_conversation_members,public.site_messages from anon,authenticated;
grant select on public.site_conversations,public.site_conversation_members,public.site_messages to authenticated;
create policy site_conversations_read on public.site_conversations for select to authenticated using(public.site_is_member(id));
create policy site_members_read on public.site_conversation_members for select to authenticated using(public.site_is_member(conversation_id));
create policy site_messages_read on public.site_messages for select to authenticated using(public.site_is_member(conversation_id));

create function public.site_chat(p_action text,p_payload jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
declare
  actor uuid := auth.uid(); actor_role text; peer uuid; peer_role text;
  conversation uuid; conversation_kind text; send_key uuid; text_body text; result public.site_messages;
  before_seq bigint; after_seq bigint; page_size integer := 40; read_seq bigint;
begin
  select role into actor_role from public.participants where id=actor and is_demo;
  if actor_role is null or actor_role not in ('producer','buyer') then raise exception 'Participante não autorizado para Conversas.'; end if;
  if p_action='inbox' then
    insert into public.site_conversations(kind,created_by) values('bot',actor)
      on conflict(created_by) where kind='bot' do nothing;
    select id into conversation from public.site_conversations where kind='bot' and created_by=actor;
    insert into public.site_conversation_members values(conversation,actor,0) on conflict do nothing;
    return jsonb_build_object(
      'conversations',coalesce((select jsonb_agg(row_data order by is_bot desc, latest_seq desc, id) from (
        select c.id,c.kind,c.kind='bot' is_bot,
          case when c.kind='bot' then 'Bot Conexa' else p.display_name end title,
          p.id peer_id,p.role peer_role,
          coalesce((select max(seq) from public.site_messages where conversation_id=c.id),0) latest_seq,
          (select body from public.site_messages where conversation_id=c.id order by seq desc limit 1) last_body,
          (select created_at from public.site_messages where conversation_id=c.id order by seq desc limit 1) last_at,
          (select count(*) from public.site_messages where conversation_id=c.id and seq>m.last_read_seq and sender_id<>actor) unread,
          m.last_read_seq::text last_read_seq
        from public.site_conversations c join public.site_conversation_members m on m.conversation_id=c.id and m.participant_id=actor
        left join public.participants p on p.id=case when c.peer_low=actor then c.peer_high else c.peer_low end
      ) row_data),'[]'::jsonb),
      'contacts',coalesce((select jsonb_agg(jsonb_build_object('id',id,'display_name',display_name,'role',role) order by display_name,id)
        from public.participants where is_demo and id<>actor and role in ('producer','buyer') and (actor_role='producer' or role='producer')),'[]'::jsonb));
  elsif p_action='open_direct' then
    peer := (p_payload->>'peer_id')::uuid;
    select role into peer_role from public.participants where id=peer and is_demo;
    if peer=actor or peer_role is null or peer_role not in ('producer','buyer') or (actor_role='buyer' and peer_role='buyer') then
      raise exception 'Escolha um contato produtor ou comprador permitido.';
    end if;
    insert into public.site_conversations(kind,created_by,peer_low,peer_high)
      values('direct',actor,least(actor,peer),greatest(actor,peer))
      on conflict(peer_low,peer_high) where kind='direct' do nothing;
    select id into conversation from public.site_conversations where kind='direct' and peer_low=least(actor,peer) and peer_high=greatest(actor,peer);
    insert into public.site_conversation_members values(conversation,actor,0),(conversation,peer,0) on conflict do nothing;
    return jsonb_build_object('id',conversation);
  end if;
  conversation := (p_payload->>'conversation_id')::uuid;
  if conversation is null or not public.site_is_member(conversation) then raise exception 'Conversa indisponível para este participante.'; end if;
  if p_action='messages' then
    after_seq := (p_payload->>'after_seq')::bigint;
    if after_seq is not null then
      if after_seq<0 or p_payload->>'before_seq' is not null then raise exception 'Cursor de histórico inválido.'; end if;
      return jsonb_build_object('messages',coalesce((select jsonb_agg(jsonb_build_object(
        'id',id,'seq',seq::text,'conversation_id',conversation_id,'sender_id',sender_id,'body',body,'created_at',created_at,'client_send_id',client_send_id) order by seq)
        from (select * from public.site_messages where conversation_id=conversation and seq>after_seq order by seq limit page_size) page),'[]'::jsonb),
        'has_more',(select count(*)>page_size from (select 1 from public.site_messages where conversation_id=conversation and seq>after_seq limit page_size+1) page));
    end if;
    before_seq := coalesce((p_payload->>'before_seq')::bigint,9223372036854775807);
    return jsonb_build_object('messages',coalesce((select jsonb_agg(jsonb_build_object(
      'id',id,'seq',seq::text,'conversation_id',conversation_id,'sender_id',sender_id,'body',body,'created_at',created_at,'client_send_id',client_send_id) order by seq)
      from (select * from public.site_messages where conversation_id=conversation and seq<before_seq order by seq desc limit page_size) page),'[]'::jsonb),
      'has_more',(select count(*)>page_size from (select 1 from public.site_messages where conversation_id=conversation and seq<before_seq limit page_size+1) page));
  elsif p_action='send' then
    select c.kind into conversation_kind from public.site_conversations c where id=conversation;
    if conversation_kind<>'direct' then raise exception 'Bot por texto livre em preparação. Use o cadastro guiado.'; end if;
    send_key := (p_payload->>'client_send_id')::uuid;
    text_body := btrim(p_payload->>'body');
    if send_key is null or text_body is null or length(text_body) not between 1 and 2000 then raise exception 'Escreva de 1 a 2000 caracteres.'; end if;
    -- Serializa também reenvios concorrentes da mesma chave, antes de verificar conteúdo.
    perform pg_advisory_xact_lock(hashtextextended(actor::text||send_key::text,0));
    select * into result from public.site_messages where sender_id=actor and client_send_id=send_key;
    if found then
      if result.conversation_id<>conversation or result.body<>text_body then raise exception 'Identificador de envio já usado com outro conteúdo.'; end if;
    else
      -- Ordem de commit por conversa: cursor de leitura não salta uma mensagem ainda não confirmada.
      perform 1 from public.site_conversations where id=conversation for update;
      insert into public.site_messages(conversation_id,sender_id,client_send_id,body) values(conversation,actor,send_key,text_body) returning * into result;
    end if;
    return jsonb_build_object('id',result.id,'seq',result.seq::text,'conversation_id',result.conversation_id,'sender_id',result.sender_id,'body',result.body,'created_at',result.created_at,'client_send_id',result.client_send_id);
  elsif p_action='read' then
    read_seq := (p_payload->>'seq')::bigint;
    if read_seq is null or not exists(select 1 from public.site_messages where conversation_id=conversation and seq=read_seq) then raise exception 'Cursor de leitura inválido.'; end if;
    update public.site_conversation_members set last_read_seq=greatest(last_read_seq,read_seq) where conversation_id=conversation and participant_id=actor;
    return jsonb_build_object('last_read_seq', (select last_read_seq::text from public.site_conversation_members where conversation_id=conversation and participant_id=actor));
  end if;
  raise exception 'Ação de conversa não suportada.';
end;
$$;
revoke all on function public.site_chat(text,jsonb) from public,anon;
grant execute on function public.site_chat(text,jsonb) to authenticated;
-- Só mensagens são publicadas. SELECT/RLS continua filtrando cada assinante.
do $$ begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime') then
    alter publication supabase_realtime add table public.site_messages;
  end if;
end $$;
commit;
