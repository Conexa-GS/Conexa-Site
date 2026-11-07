begin;
-- Keep the already applied M3 migration immutable; harden quote publication too.
do $migration$
declare definition text;
begin
 definition:=pg_get_functiondef('conexa_private.m3(text,jsonb)'::regprocedure);
 definition:=replace(definition,
  'if v.id is null then raise exception ''Escolha seu veículo.''; end if;',
  'if v.id is null then raise exception ''Escolha seu veículo.''; end if;
   select sum(quantity) into weight from public.load_items where load_id=l.id;
   if weight is null or exists(select 1 from public.load_items where load_id=l.id and unit<>''kg'') or v.capacity_kg<weight or v.conservation_conditions is distinct from payload->>''conservation_required'' then raise exception ''Peso, capacidade ou conservação incompatível.''; end if;');
 definition:=replace(definition,'jsonb_agg(to_jsonb(i)||jsonb_build_object(''producer_name'',p.display_name))','jsonb_agg(to_jsonb(i)||jsonb_build_object(''producer_name'',p.display_name) order by i.id)');
 execute definition;
end $migration$;
commit;
