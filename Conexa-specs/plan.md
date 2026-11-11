# Plano de implementação

## Arquitetura proposta

React + Vite + Tailwind → serviços de aplicação → Supabase (Auth demo, PostgreSQL/RLS, funções transacionais). Rotas externas por função no servidor. Não criar backend completo separado sem necessidade.

Estrutura sugerida:

```text
src/
  app/             # rotas, layout e sessão demo
  components/      # elementos reutilizáveis
  features/        # ofertas, demandas, cargas, transporte, pagamentos
  domain/          # dinheiro, compatibilidade, viabilidade e estados
  hooks/
  services/        # supabase e adaptadores externos
  types/
supabase/
  migrations/
  functions/
  seed.sql
docs/specs/        # este pacote
README.md
AI.md
.env.example
```

TypeScript é proposta de implementação para tipos e contratos, não exigência confirmada da disciplina. Usar JavaScript se a equipe não domina TypeScript; registrar em decisions.md. Não introduzir bibliotecas avançadas sem benefício claro.

Componentes candidatos ao longo do projeto: AppLayout, ProfileSwitcher, OfferForm, OfferList, OfferCard, DemandForm, LoadItemSelector, FinancialSummary, StatusBadge e QuoteCard. Hooks iniciais: useOffers e useDemoSession; depois useDemands/useLoad. Não criar abstrações vazias para atingir contagem.

## Pré-requisitos e configurações

- Checkout de destino e instruções AGENTS.md verificados.
- Node/Git e gerenciador disponíveis.
- Projeto Supabase de demonstração e autorização para alterações remotas.
- URL e chave pública Supabase; acesso para migrations e usuários fictícios via método apropriado, sem pedir segredos no chat.
- Definir sessão demo com RLS antes de concluir M1.
- Repo privado e destino do deploy definidos pelo grupo quando necessário.
- Credenciais, faturamento e permissões da API de rotas somente no M4; não bloqueiam M1.

Se faltarem credenciais, preparar configuração/migrations e executar o que puder localmente. Informar bloqueio específico; não declarar CRUD remoto concluído e não substituir silenciosamente Supabase por localStorage.

## Decisões de produto consolidadas

Frete pago pelo comprador; taxa zero; mínimo por produtor; pagamentos simulados; três perfis; indicação de autônomo; inclusão economicamente viável; site antes de WhatsApp.

## Propostas técnicas ainda a validar

- Usuários fictícios com Auth/RLS como mecanismo do seletor demo.
- TypeScript ou JavaScript conforme domínio do grupo.
- Reserva de 24h limitada pela disponibilidade; parametrizar, mostrar prazo e expirar antes de confirmar.
- API de rotas: Google Routes como candidata; testar cobertura, veículo, cobrança e termos.
- Critério inicial de inclusão: ordenar por menos vendas concluídas, desempatar por maior espera. Implementado na fatia local M4 de 08/11/2026 como contagem de cargas distintas entregues e idade da oferta; validação no demo e avaliação pendentes. É heurística explicável, não modelo de justiça validado.
- Exclusão física só sem vínculos; demais registros arquivados.

Essas escolhas não justificam reabrir o que já foi decidido. Registrar as decisões técnicas ao implementar; pedir ao usuário apenas dados/autorizações realmente faltantes ou mudanças de escopo.

M4 iniciada localmente em 08/11/2026: pesquisa de T21 e roteiro manual autenticado, candidatas por alimentos/histórico e comparação estrita de cotações da mesma carga. Sem adaptador externo habilitado; faltam território roteável, perfil/cobertura, termos/atribuição, credencial de servidor e teto de consumo autorizados. Migration preparada, ainda sem aplicação/testes no demo. T21–T24 permanecem abertos; não alterar a regra de uma proposta ativa por demanda para antecipar comparação final de composições. Detalhes em `m4-routes.md`/D011.

## Prioridade e prazo

Atualização de prioridade em 11/11/2026 — D018: após testes WhatsApp, o usuário pediu retomar conversas dentro do próprio site. T30 fica pausada; preservar a feature de experimentos sem integração implícita. Próxima entrega M6 planejada em T34–T43: aba Conversas produtor/comprador, persistência/RLS, bot para criar/editar/arquivar ofertas próprias, mensagens individuais e OpenAI Realtime/voz opcionais. [conversas-site.md](conversas-site.md) detalha arquitetura, modelo proposto, confirmação versionada, execução única e limites de consumo. Texto simulado e testes do agente não usam API paga; usuário executa a voz real. Esta prioridade substitui a recomendação genérica abaixo de cortar o chat para a entrega solicitada, preservando CRUD/persistência e pendências M5/T28. Nenhum novo código/migration ou ativação nesta rodada.

Concluir M1 antes de iniciar M2; não esperar mapas, pagamentos ou WhatsApp. Prazo oficial informado no briefing: 19/11/2026 às 23h55. Meta proposta: fluxo central pronto até 14/11, revisão e apresentação de 15 a 18/11. Ajustar ao esforço real e preservar critérios acadêmicos.

Para reduzir escopo, cortar chat, refinamentos de ranking e mapas avançados antes de cortar CRUD real, persistência, validações, clareza financeira ou documentação. Integração de rotas faz parte do produto planejado, mas não é pré-requisito do primeiro marco.
