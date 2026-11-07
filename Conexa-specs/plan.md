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
- Critério inicial de inclusão: ordenar por menos vendas concluídas, desempatar por maior espera. É heurística explicável, não modelo de justiça validado.
- Exclusão física só sem vínculos; demais registros arquivados.

Essas escolhas não justificam reabrir o que já foi decidido. Registrar as decisões técnicas ao implementar; pedir ao usuário apenas dados/autorizações realmente faltantes ou mudanças de escopo.

## Prioridade e prazo

Concluir M1 antes de iniciar M2; não esperar mapas, pagamentos ou WhatsApp. Prazo oficial informado no briefing: 19/11/2026 às 23h55. Meta proposta: fluxo central pronto até 14/11, revisão e apresentação de 15 a 18/11. Ajustar ao esforço real e preservar critérios acadêmicos.

Para reduzir escopo, cortar chat, refinamentos de ranking e mapas avançados antes de cortar CRUD real, persistência, validações, clareza financeira ou documentação. Integração de rotas faz parte do produto planejado, mas não é pré-requisito do primeiro marco.
