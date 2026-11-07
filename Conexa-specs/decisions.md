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

## Modelo de novo registro

ID / data / status (proposta, aceita, substituída) / contexto / decisão / justificativa / arquivos e critérios afetados / limitações / origem da autorização quando necessária.

Nunca apagar decisões anteriores para esconder mudança; marcar substituição e atualizar a especificação atual.
