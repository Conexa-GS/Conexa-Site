# Uso de inteligência artificial na Conexa

Esta síntese reúne dois exemplos do desenvolvimento da Conexa para a entrega acadêmica. O histórico completo está no [registro canônico de uso de IA](IA.md).

## 1. Ferramentas utilizadas

O **OpenAI Codex** auxiliou na implementação em React e SQL, na revisão das regras de negócio e na execução de testes. Na M2, o Codex usou a CLI e o MCP do Supabase para aplicar a migration e verificar a persistência no ambiente demo. Na correção do tutorial, usou o terminal e o navegador integrado para reproduzir o salto de etapas e conferir o ajuste. [Interação 007](IA.md#interação-007--implementação-da-m2-autorizada--07112026) · [Interação 105](IA.md#interação-105--correção-de-etapas-puladas-no-tutorial--15112026)

## 2. Interações realizadas

- **Reservas da M2.** O pedido, em resumo, foi implementar o fluxo de demandas e reservas com prazo configurável de 24 horas e validar no Supabase demo. Na resposta, o Codex se comprometeu a implementar a M2 “com reservas de 24 horas configuráveis e limitadas pela disponibilidade das ofertas”. [Interação 007](IA.md#interação-007--implementação-da-m2-autorizada--07112026)
- **Tutorial guiado.** O pedido, em resumo, foi corrigir os saltos na numeração das etapas do comprador e da transportadora, como avançar de 3 para 5. O Codex respondeu que investigaria “o avanço dos passos no comprador e na transportadora” para corrigir o salto. [Interação 105](IA.md#interação-105--correção-de-etapas-puladas-no-tutorial--15112026)

## 3. Aplicação no projeto

- **M2.** A implementação conectou o cadastro de demandas, a busca de ofertas e a composição de cargas às reservas no Supabase. O envio verifica o saldo e cria as reservas na mesma transação. Aceites e recusas são vinculados à versão da proposta. [Interação 007](IA.md#interação-007--implementação-da-m2-autorizada--07112026)
- **Tutorial guiado.** Em `Tutorial.jsx`, o avanço e o retorno passaram a usar o índice da etapa exibida. O componente passou a ignorar o segundo evento de um clique duplo e a repetição de Enter ou Espaço mantidos pressionados. [Interação 105](IA.md#interação-105--correção-de-etapas-puladas-no-tutorial--15112026)

## 4. Validação das respostas

- **M2.** O Codex corrigiu uma ambiguidade em PL/pgSQL e ajustou o tratamento do arquivamento antes de concluir as verificações. Executou lint, testes de domínio e banco local, build e testes no Supabase demo com autenticação real. Entre duas submissões concorrentes, uma foi rejeitada sem deixar reservas parciais. A revisão visual ficou pendente nessa rodada. [Interação 007](IA.md#interação-007--implementação-da-m2-autorizada--07112026)
- **Tutorial guiado.** O teste de regressão reproduziu o salto da etapa 1 para a 3 antes da correção e passou depois do ajuste. No navegador local, um clique duplo avançou somente até a etapa 2 para ambos os perfis, em desktop e em 360 px. A avaliação humana dessa correção ficou pendente. [Interação 105](IA.md#interação-105--correção-de-etapas-puladas-no-tutorial--15112026)

## 5. Análise crítica

- **M2.** A IA acelerou a implementação conjunta das telas e das transações, mas os testes revelaram erros que exigiram ajustes. A verificação no Supabase demo exercitou a concorrência entre duas sessões. O bloqueio global simplifica as reservas no protótipo e limita a escala. [Interação 007](IA.md#interação-007--implementação-da-m2-autorizada--07112026)
- **Tutorial guiado.** A regressão mostrou que eventos repetidos causavam o salto. A proteção também evita que o segundo clique acione outro controle após o reposicionamento do cartão. Cliques separados por menos de 350 ms contam como um só, o que exige uma breve pausa para avançar várias etapas de propósito. [Interação 105](IA.md#interação-105--correção-de-etapas-puladas-no-tutorial--15112026)
