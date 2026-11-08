# Registro de decisões

## D001 — Direção do produto — consolidada em 06/11/2026

Site como produto central, React/Vite/Tailwind, Supabase, três perfis, WhatsApp posterior. Origem: decisões da conversa; Vite escolhido no planejamento técnico.

## D002 — Financeiro — consolidada em 06/11/2026

Frete do comprador, taxa zero e mínimo líquido individual obrigatório. Pagamentos e repasses simulados. Substitui a proposta antiga de dividir frete entre produtores.

## D003 — Transporte e inclusão — consolidada em 06/11/2026

Empresas e autônomos, indicação pelo produtor, cotação confirmada pelo transportador. Proximidade orienta logística sem exclusão automática dos mais distantes. Preferência inclusiva condicionada a viabilidade de todos.

## D004 — Propostas para tornar a implementação verificável — 06/11/2026

RLS com sessões demo, reserva inicial configurável de 24h, heurística de inclusão, precisão monetária e exclusão/arquivamento detalhados neste pacote são propostas técnicas explícitas. Implementador deve registrar resolução antes do marco correspondente. Não são funcionalidades já construídas nem decisões validadas em campo.

## D005 — Nome e escopo desta versão — aceita em 07/11/2026

O nome atual é **Conexa**, substituindo CAMPOCIDADE na aplicação. Origem: pedido explícito do usuário. O piloto em `F:\GS 2\conexa-design\conexa` é a referência visual. Além da fatia de ofertas M1, o usuário solicitou uma primeira versão das demais páginas; elas são prévias navegáveis identificadas, sem antecipar reservas, transações ou conclusão dos marcos M2–M5. Esta solicitação prevalece sobre a orientação anterior do handoff de não criar telas posteriores no M1.

## D006 — Linguagem, estilo e sessão demo — aceita em 07/11/2026

JavaScript/JSX sobre o checkout React/Vite existente. Tailwind via plugin Vite e utilitários; CSS e vetores do piloto preservados para fidelidade visual. Domínio/serviços separados da apresentação. Supabase Auth com quatro contas fictícias pré-criadas e RLS; senha pública descartável limitada ao ambiente acadêmico. Sem configuração, demonstração em memória explicitamente identificada, reiniciada no reload, sem alegar persistência. Migration/seed preparados; aplicação remota depende de projeto escolhido pelo grupo.

## D007 — Git e registro de IA — aceita em 07/11/2026

Fluxo obrigatório `feature/*` → `dev` → `main`, Conventional Commits, nunca desenvolver diretamente na main. Após a alteração, apresentar para avaliação e pedir aprovação antes de subir/integrar na dev. Registrar prompts e análise em `IA.md`. Regras completas em `workflow.md` e `AGENTS.md`. Origem: pedido explícito do usuário nesta interação.

## D008 — Implementação da M2 e prazo de reserva — aceita em 07/11/2026

Origem: respostas explícitas do usuário nesta conversa: “M2 completa (T13–T16)”, “Sim, usar 24 horas” e “Autorizar migration e testes no projeto demo”. Autorização restrita ao projeto demo configurado; não autoriza push, merge ou deploy.

M2 deixa de ser prévia; demandas, composição e reservas passam a usar Supabase. M3+ continua ilustrativo. Substitui essa parte de D005 para as telas da M2. Modo sem configuração mantém ofertas em memória, mas M2 exibe erro explicando a necessidade de Supabase, sem persistência simulada silenciosa.

Reserva padrão 24h, configurável de 1 a 168 horas por composição; prazo efetivo é o menor entre esse intervalo, fim da disponibilidade de todas as ofertas e fim da data desejada (America/Sao_Paulo). A faixa de configuração é escolha técnica do protótipo. O prazo começa ao enviar, não ao salvar candidata. Expiração é processada sob demanda nas chamadas M2; cálculo de saldo ignora reservas vencidas imediatamente, mesmo sem cron. Respostas tardias são rejeitadas no banco.

Uma proposta ativa por demanda. Rascunhos já vinculam histórico e guardam snapshots; alterações posteriores exigem cancelamento/remontagem. Demanda vinculada não é editada; deve ser arquivada e substituída, após cancelar proposta ativa. Oferta vinculada pode mudar preço e quantidade livre sem mudar valores acordados; alimento/produtor/coleta ficam protegidos. Exclusão física só sem vínculo; arquivo preserva snapshots.

Funções privilegiadas no schema privado, gateway público `security invoker`, permissões explícitas e identidade derivada de `auth.uid()`. Sem escrita REST direta em cargas/reservas/aceites. Operações M2 serializadas com advisory lock transacional para simplificar concorrência no pequeno ambiente demo; ofertas bloqueadas em ordem de UUID para proteger saldo contra edição simultânea. Essa serialização global não é proposta de arquitetura para escala de produção.

Arquivos: migrations M2, `features/demands`, `services/m2.js`, `domain/demands.js`, hooks, integração de ofertas e testes. Verificação remota real executada pelo Codex, incluindo concorrência; revisão visual bloqueada e aceite humano pendente, conforme `validation.md`.

## D009 — Transporte manual e confirmações M3 — implementada, avaliação humana pendente — 07/11/2026

Origem: “vamos seguir para o m3, siga o padrão de branch e commits, pergunte o que não ficou claro”. Autorização complementar explícita: “Sim, autorizar migration e testes do M3 no demo”. Restrita ao mesmo projeto demo; não autoriza push/merge/deploy. Substitui D005/D008 quanto à condição de prévia do M3. M4+ continua ilustrativo.

Cotação manual completa, sem API de rotas (M4). Saída + coletas em ordem estável de UUID dos itens + destino + retorno opcional compõem roteiro próprio; sem distância, tempo de direção, paradas ou pedágio individuais inventados. Frete final fechado deve incluir combustível, pedágios, coletas, descarga e retorno acordado. Essa restrição resolve serviços obrigatórios extras consolidando-os no valor antes da aprovação, sem dupla soma. O pedágio individual continua “a confirmar”, com cobertura pelo preço fechado.

Produtor indica somente o transportador fictício cadastrado; preço sugerido não confirma cotação. O transportador indicado vincula a indicação ao publicar uma cotação completa; somente ele pode fazê-lo. Veículos/cotações são imutáveis nesta fatia; cadastro de outro veículo para novas condições e cancelamento/remontagem para mudar roteiro/preço/datas. Não há edição silenciosa de coletas; AC14 coberto por rejeição de alterações fora do estado e cancelamento/remontagem com histórico preservado.

Conservação declarada explicitamente pelo transportador (`ambient`/`refrigerated`) e ratificada pelos demais participantes na versão final; não é parecer sanitário. Todos os itens precisam estar em kg, capacidade suficiente e condição coincidente. A validade não ultrapassa a reserva. Cotação selecionada gera snapshot e incrementa versão: comprador, todos os produtores e transportador precisam de novos aceites. Só então `awaiting_payment`, sem agendamento ou pagamento M5. Banco calcula e persiste subtotal/frete/taxa zero/total; mínimos são validados por item, sem descontos no MVP. Expiração/cancelamento mantêm o mecanismo de liberação M2.

Arquivos: migrations M3, `features/transport`, domínio/serviço/hook, integração de rotas internas e testes. Testes locais e remotos executados; revisão visual bloqueada pelo suporte de navegador da ferramenta. T20 e autorização de integração pendentes.

## D010 — Envio direto e organização das listas — implementada, avaliação pendente — 07/11/2026

Origem: avaliação do usuário sobre o caminho demanda → proposta → envio e a poluição de registros cancelados/arquivados. Ajuste da feature M3 ainda não integrada, sem criar outra feature a partir de trabalho pendente. Cadastro de demanda abre automaticamente a composição; envio passa a ocorrer nessa tela, usando as ações `draft` e `submit` existentes. Minhas propostas acompanha respostas; não exige aprovação intermediária. Duas ações continuam separadas no banco, mas falha preserva a candidata para reenvio com mesmo UUID; perda de resposta após envio é conferida por consulta. Não foi criada migration nem alterada regra de estoque/aceite.

Listas de demandas, propostas e transporte mostram Ativas por padrão, com Histórico e Ocultas acessíveis por filtros e contagens. Produtor separa novas propostas sem resposta das em andamento. Ocultar é preferência reversível de visualização no navegador, isolada por participante e lista; não é arquivamento/cancelamento no banco. Ocultas mantém aviso de prazos/reservas ativos. Só UUIDs de preferências ficam em localStorage; cadastros continuam no Supabase. Indisponibilidade de storage limita preferência à sessão. Avaliação visual em 360 px/desktop e teclado ainda pendente pelo bloqueio de navegador já registrado.

## D011 — Início local da M4 com roteiro manual e inclusão explicável — 08/11/2026

Origem: “comece a implementar a M4 seguindo as regras do projeto”. Implementada uma primeira fatia na feature criada da dev, preservando M1–M3. M4 continua em avaliação, com rótulo de prévia. Sem autorização nova de envio/integração, migration remota ou cobrança.

Google Routes segue candidato; pesquisa oficial e pendências em `m4-routes.md`. Não habilitar estimativa externa com endereços fictícios sem coordenadas, perfil/cobertura validado, termos, credencial de servidor e orçamento/quota autorizados. Roteiro manual é consultado no PostgreSQL com dono, papel e versão validados; dados geográficos desconhecidos permanecem nulos. Não criar infraestrutura externa vazia nem presumir rota real para nomes fictícios.

Inclusão usa somente cargas distintas entregues por produtor na plataforma e idade da oferta. Duas heurísticas locais com saldo real e centavos; sem índice arbitrário nem promessa de ótimo global. Antes de M5, zero vendas concluídas é histórico vazio legítimo. Custo dos alimentos pode ser comparado, mas frete/viabilidade de cada composição continuam pendentes. Cotações da mesma carga só entram no mesmo grupo quando roteiro/horários/conservação/serviços coincidem. Não ampliar para duas propostas ativas por demanda nem reaproveitar cotação de outra composição. Comparação final entre composições cotadas permanece pendente.

Arquivos: migration M4, serviço, domínio, componentes em demandas/transporte, testes e bancada visual isolada. PGlite e fixtures de UI não substituem Supabase demo nem aceite humano; resultados em `validation.md`. Nenhum pagamento, transporte físico ou avanço de M5.

## Modelo de novo registro

ID / data / status (proposta, aceita, substituída) / contexto / decisão / justificativa / arquivos e critérios afetados / limitações / origem da autorização quando necessária.

Nunca apagar decisões anteriores para esconder mudança; marcar substituição e atualizar a especificação atual.
