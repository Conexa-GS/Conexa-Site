# Conexa

Do campo pra cidade. Mais juntos.

Aplicação acadêmica React/Vite/Tailwind para reunir ofertas de pequenos produtores, demandas de compradores e transporte local. Cenários, participantes, pagamentos, estornos, viagens e repasses são **fictícios ou simulados**. A identidade do piloto usa creme, verde, laranja, marca vetorial e ilustrações locais.

Estado em **12/11/2026**: M1–M4 têm aceite humano no escopo registrado. T28/M5 e texto/DM foram tecnicamente verificados no Supabase demo; aceite M5 e T43/aceite M6 continuam pendentes. T41 mantém rede física pendente; T42 mantém voz real pendente. [Estado completo](Conexa-specs/estado-atual.md), [matriz de verificações](Conexa-specs/entrega/matriz-verificacoes.md) e [limitações](Conexa-specs/entrega/limitacoes.md).

## Executar a partir do ZIP ou checkout limpo

Atualização de acesso em **13/11/2026**: a entrada do site leva a `/login`, com três perfis compactos, cadastro, e-mail/senha e recuperação pelo Supabase Auth. `/demo` preserva as quatro contas fictícias como **Entrar como desenvolvedor**. No servidor Vite de desenvolvimento a opção está disponível; em build de produção exige `VITE_ENABLE_DEVELOPER_ACCESS=true`, apenas para demonstração isolada. Com o valor padrão `false`, contas compartilhadas são recusadas pela aplicação. Contas pessoais continuam usando operações e locais de teste; não cadastrar dados pessoais sensíveis nem interpretar pagamentos/entregas como serviços ativos. [Decisão e limites](Conexa-specs/decisions.md#d030--login-individual-e-acesso-de-desenvolvedor--13112026).

O cadastro precisa da migration `20261113155836_personal_account_auth.sql` (já aplicada ao demo como `20261113160056`). No Supabase Auth, configurar **Site URL**, as URLs autorizadas `<origem>/login` e `<origem>/redefinir-senha` e o envio de e-mail/SMTP para a origem que será usada. A confirmação está habilitada no demo. A entrega não verificou recebimento/clique dos e-mails nem mudou SMTP/URLs remotos. O callback reconhece a sessão de confirmação/recuperação; ao confirmar a conta, escolha **Ir para meu espaço**. [Documentação de senhas do Supabase](https://supabase.com/docs/guides/auth/passwords).

Requisitos: **Node 24+**, npm e terminal. Ambiente desta entrega: Node **24.21.0**, npm **11.19.0**, Windows/PowerShell. Node 24 é a referência única para executar também os testes e o broker opcional com SQLite nativo. Git e PowerShell 7.2+ são necessários apenas para regenerar o ZIP a partir de uma cópia Git. A instalação inicial precisa acessar o registro npm; dependências e `.env` não vêm no ZIP.

1. Extraia o ZIP e abra um terminal dentro de `Conexa-Site`, onde está `package.json`; ou use o checkout da feature em avaliação.
2. Para a demonstração local, mantenha URL e chave Supabase vazias e voz desligada. O ZIP já vem assim; não copie credenciais para avaliar em memória.
3. Instale exatamente o lockfile e inicie o site:

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Abra o endereço informado pelo Vite, normalmente `http://127.0.0.1:5173`. Se a porta estiver ocupada, use a porta efetivamente indicada. Encerre com Ctrl+C.

Sem URL **e** chave Supabase configuradas, ofertas usam memória, compartilhada entre perfis na mesma página, e reiniciam ao recarregar. Não há persistência local de ofertas. M2–M5 e Conversas informam a necessidade do banco; não anunciam gravação persistida nesse modo. Não confundir as bancadas de teste com dados remotos.

## Verificações reproduzíveis

Em outro terminal, na mesma pasta:

```powershell
npm run lint
npm test
npm run test:db
npm run build
npm run preview -- --host 127.0.0.1
```

| Comando | O que verifica | Limite |
| --- | --- | --- |
| `npm run lint` | ESLint do código configurado | Não prova execução ou layout; PowerShell é verificado pela execução do empacotador |
| `npm test` | Domínio, componentes jsdom, mocks de rede/provedor/voz | Não acessa o demo nem API paga; não é navegador nativo |
| `npm run test:db` | Dez scripts PostgreSQL local/PGlite, migrations e seed de teste | Identidade simulada/conexão serial; não é Auth/RLS ou concorrência reais do Supabase |
| `npm run build` | Build estático em `dist` | Aviso preexistente de chunk principal >500 kB; não testa deploy |
| `npm run preview` | Serve somente o build gerado; abrir endereço informado, normalmente porta 4173 | Prévia local; não publica na internet |

Os roteiros `tests/remote-*.mjs`, `test:conversations:demo` e `test:m5:demo` são **manuais**, separados da suíte automática. Autenticam e podem criar mensagens, ofertas, reservas, cargas e pagamentos simulados persistentes; consultar seus roteiros/efeitos e usar apenas o demo autorizado. Muitos leem especificamente `.env` com `process.loadEnvFile`, mesmo se o Vite usar `.env.local`; um ZIP sem credenciais não os executa. Modos `--check`/`*:check` validam configuração offline e também exigem um `.env` preenchido, sem provar conexão.

## Configurar Supabase demo — opcional

O pacote não distribui credenciais nem dados/Auth do banco. Para usar o demo existente, obter a configuração do grupo por meio local seguro:

```powershell
Copy-Item .env.example .env.local
```

Editar localmente o arquivo e reiniciar Vite. Vite lê `.env`, `.env.local` e variantes por modo; valores do processo também podem sobrescrever arquivos. Para avaliar sem rede, usar uma pasta extraída limpa e confirmar ausência de variáveis de processo Supabase preenchidas.

| Variável | Valor esperado / uso |
| --- | --- |
| `VITE_SUPABASE_URL` | URL do projeto demo autorizado; vazia para memória |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública/publishable do mesmo projeto; nunca `service_role` ou secret key |
| `VITE_DEMO_ANA_EMAIL`, `VITE_DEMO_JOAO_EMAIL`, `VITE_DEMO_BUYER_EMAIL`, `VITE_DEMO_CARRIER_EMAIL` | Quatro contas fictícias confirmadas, correspondentes a `supabase/seed.sql`; defaults `@conexa.invalid` |
| `VITE_DEMO_PASSWORD` | Senha descartável exclusiva dessas contas compartilhadas; visível no navegador |
| `VITE_CONEXA_VOICE_ENABLED` | `false` por padrão; não habilitar para avaliar texto/DM |

Todas as variáveis `VITE_` entram no frontend. Não usar segredos administrativos ou chave OpenAI. Com URL/chave configuradas, uma falha remota gera erro e não retorna silenciosamente ao modo em memória. Não inserir dados pessoais reais nas contas compartilhadas; não é autenticação de produção.

No **demo existente**, as migrations já foram aplicadas: M1–M3 em 07/11, M4/M5/revisões em 10/11, Conversas/bot em 11/11 e correção de zero centavos M5 em 12/11. Versões remotas diferem de alguns nomes locais e M1 foi manual; conferir [mapeamento](Conexa-specs/estado-atual.md#supabase-demo-o-que-já-foi-aplicado). Não reaplicar migrations, seed, `db push`, reset ou repair por pressuposição.

Para **outro projeto novo e vazio**, provisionado pelo responsável: aplicar `supabase/migrations/*.sql` em ordem de nome, criar/confirmar as quatro contas fictícias do exemplo no Supabase Auth, depois executar `supabase/seed.sql` para mapear seus UUIDs. Se mudar emails, atualizar o mapeamento do seed. Conferir RLS/CRUD no projeto novo antes de alegar funcionamento. Os roteiros remotos são restritos ao hostname do demo Conexa e rejeitam outro projeto. Esta entrega não provisionou novo banco nem repetiu testes remotos.

Com Supabase, F5 na mesma aba revalida Auth/participante; Trocar participante encerra sua sessão. Abra abas novas pelo endereço para identidades independentes: duplicar uma aba pode copiar sua sessão inicial. Auth/journal usam sessionStorage por participante/aba; se bloqueado, a retomada não é garantida e novo envio de Conversas sem chave durável é impedido.

## Fluxos e demonstração

O [roteiro para avaliação](Conexa-specs/entrega/roteiro-demonstracao.md) descreve percurso local sem segredos e percurso conectado opcional, com seus efeitos persistentes.

| Área | Endereço / acesso | Estado |
| --- | --- | --- |
| Apresentação e perfis | `/`, `/demo` | Piloto local; quatro participantes fictícios |
| Ofertas | `/produtor/ofertas`, `/comprador/ofertas` | CRUD em memória ou Supabase; exclusão sem vínculos, arquivo para histórico vinculado |
| Bot Conexa | Minhas ofertas → Cadastrar por conversa; `/produtor/conversas` | Perguntas guiadas/opções para consultar, criar, editar e arquivar oferta própria; prévia/confirmar obrigatórios; texto sem API paga |
| Conversas comprador | `/comprador/conversas` | Consulta pelo bot e DM; comprador não edita ofertas de terceiros |
| Demandas/composição | `/comprador/demandas`, `/comprador/demandas/:id/composicao` | Supabase: selecionar quantidades compatíveis e enviar cria reserva atômica; insuficiência não reduz demanda automaticamente |
| Propostas do produtor | `/produtor/propostas` | Supabase: aceitar/recusar, saldo e prazo persistidos |
| Transporte | `/transportador/veiculos`, `/transportador/solicitacoes` | Veículo/cotação por transportador; indicação de produtor não confirma frete |
| Operações | `/operacoes` | Cotações, mínimos/totais, roteiro manual, aceites e M5 simulada persistida; M5 em avaliação |
| Exemplos | `/operacoes/exemplo`, `/operacoes/exemplo/pagamento` | Prévias independentes; não são operações ativas |

Bot prepara rascunho auditável; só **Confirmar revisão N** grava pelo gateway compartilhado com o formulário. **Cancelar rascunho** não modifica catálogo. Mudança de versão/saldo exige nova prévia; `sim` ou fala incidental não confirmam. Texto livre é delimitado, sem entendimento de linguagem arbitrária. Use opções visíveis; datas exigem dia/mês/ano ou ISO e vencimento aceita desconhecido.

DM não altera estoque/preço nem formaliza reserva, frete, pagamento ou aceite. Antes de enviar, pedido/chave ficam em sessionStorage. Depois de falha/F5, abrir a conversa e usar **Verificar envio** ou **Verificar pedido pendente** com a mesma chave; não há reenvio automático. Texto ainda não enviado é volátil; rascunho estruturado/histórico ficam no Supabase.

M2/M3 persistem demandas, composição, reservas, cotações, totais e confirmações. Revisões invalidam aceites; negociação exige aprovação explícita do comprador. M4 mostra candidatas inclusivas e roteiro manual, sem API externa de mapas ativa nem promessa de menor frete. Pedágio/distância desconhecidos ficam a confirmar. Demo tem uma transportadora: encaminhamento a segunda conta continua sem prova.

M5 não cobra dinheiro: aprovado libera agendamento uma vez; recusado/pendente não libera. Após viagem fictícia, divergência bloqueia repasses; comprador registra resolução e depois confirma recebimento em ação separada. Cancelamento antes do transporte libera estoque/estorna uma vez; após início vira ocorrência. Aceite humano M5 continua pendente.

## Bancadas de desenvolvimento, sem escrita remota

Com `npm run dev`, abrir `/tests/ui/conversations.html`, `/tests/ui/accessibility.html`, `/tests/ui/m4.html`, `/tests/ui/m5.html` ou `/tests/ui/quote-revisions.html`. São componentes reais com fixtures/falhas em memória, identificados e fora do build de produção. `/tests/ui/m6.html` conserva o modal T29 histórico; a entrada atual leva ao Bot Conexa. Recarregar bancada reinicia fixtures e não comprova persistência remota.

**Exceção conectada:** `/tests/ui/conversations-connected.html` usa serviços reais e deixa histórico no demo; consultar [roteiro/efeitos](Conexa-specs/conversas-validacao-demo.md) antes de executar. Falha injetada não equivale a desconexão física. D025/D026 já registram texto/DM, F5 e offline emulado; prova física de T41 foi adiada pelo usuário.

## Voz opcional e WhatsApp

T39/T40 têm broker local Node 24 de instância única, WebRTC/sideband, SQLite e cotas; ambos os switches ficam desligados. Chave permanente só no servidor, nunca `VITE_`. Respostas da IA são texto; sugestão/transcrição corrigida precisa passar pelo bot, prévia e confirmação. Sem implantação, Auth/provedor/microfone reais verificados. **T42 é teste pago somente do usuário**, pelo [roteiro de voz](Conexa-specs/voz-manual.md); custo real e encerramento no provedor não são comprovados por mocks. Texto simulado independe de voz.

`npm run demo:whatsapp` é um demonstrador histórico de terminal em memória, sem envio externo ou gravação no site. T30/WhatsApp foi descontinuada por pedido do usuário (D029) e retirada das tarefas; experimentos preservados são históricos. [Escopo](Conexa-specs/t30-whatsapp.md).

## Empacotar para avaliação

Em uma cópia Git com PowerShell 7.2+:

```powershell
pwsh -NoProfile -File ./scripts/package-delivery.ps1
```

Gera `artifacts/entrega/conexa-t32-t33-t43.zip`, `.zip.sha256` e `auditoria.json`, ignorados pelo Git. Inclui fontes, lockfile, assets, exemplos vazios, testes, migrations, documentação e manifesto SHA-256. Exclui `.git`, `.env` preenchido, dependências, build, banco de cotas e relatórios/capturas locais. Faz inspeção delimitada de tokens e comparação com credenciais locais, e relê cada entrada do ZIP. Detalhes, limites e avaliação em [entrega T32/T33/T43](Conexa-specs/entrega/README.md). Pacote extraído não tem Git; para regenerá-lo, usar o checkout Git. Não enviar arquivos de ambiente junto ao pacote.

## Organização, rastreabilidade e publicação

`src/components` reúne layout/elementos comuns; `features` contém ofertas, demandas, transporte e Conversas; `hooks` coordena sessão/consultas; `services` isola acesso ao banco e adaptação local; `domain` concentra validação/centavos/estados; `pilot` e `public/assets` preservam o piloto. GIFs locais originais e quadros estáticos mantêm movimento reduzido; origem/hashes em `public/assets/animations/sources.json`. Tailwind integrado pelo plugin Vite e CSS do piloto, sem dependência de fontes/imagens/mapas externos para avaliação local.

[Especificações](Conexa-specs/README.md), [regras](Conexa-specs/business-rules.md), [decisões](Conexa-specs/decisions.md), [evidências datadas](Conexa-specs/validation.md), [auditoria acadêmica T31](Conexa-specs/t31-auditoria.md), [uso real de IA](IA.md). `AI.md` aponta para `IA.md`; [saneamento T04/T31](Conexa-specs/saneamento-ia.md) concluído documentalmente, com [histórico integral segregado](Conexa-specs/historico/ia-antes-saneamento-2026-11-12.md). Completude dos registros dos integrantes e avaliação desta revisão continuam pendentes. Não há território/escuta/impacto real comprovados.

Fluxo obrigatório `feature/*` criada da `dev` → avaliação → publicação/integração autorizada na `dev`. Conventional Commits; nunca desenvolver na `main`. [Regra de autorização](Conexa-specs/workflow.md#branches-e-avaliação).

Origin configurado no checkout: [Conexa-GS/Conexa-Site](https://github.com/Conexa-GS/Conexa-Site). Visibilidade e permissões no servidor não foram conferidas nesta preparação; acesso ao link não está garantido pelo ZIP.

**Deploy não comprovado nesta entrega.** `npm run build` produz SPA estática; hospedagem precisa de fallback dos caminhos para `index.html`, variáveis do frontend no build e smoke test com recarga de links diretos. O broker de voz é separado e não fica funcional só por hospedar `dist`. Repositório privado, escrita dos professores, URL pública e envios separados de Web/Front-end precisam de conferência humana; T32 continua parcial. Nenhum push, merge, deploy, mudança de permissões ou aceite M5/M6 é presumido por este pacote.
