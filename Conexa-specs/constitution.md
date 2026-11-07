# Princípios do projeto

## C01 — Uma experiência completa e simples

O site é o produto central do protótipo. Priorizar um fluxo funcional entre produtor, comprador e transportador. Construir por fatias; não implementar todo o escopo em uma única etapa.

## C02 — Inclusão com viabilidade

Não otimizar apenas distância ou resultado agregado. Cada produtor deve receber seu mínimo líquido, o transportador deve aceitar sua remuneração e o comprador deve aprovar o total. Inclusão não é garantia de venda.

## C03 — Transparência

Expor alimentos, frete, taxas, descontos e total. Distinguir oferta, reserva e venda; cotação e preço aprovado; estimativa e dado confirmado. Dados fictícios e operações simuladas precisam estar identificados.

## C04 — Acessibilidade

Português do Brasil, linguagem direta, contraste, rótulos de campos, operação por teclado, foco visível e layout para celular. Erros devem indicar como corrigir. WhatsApp é evolução de acessibilidade e não bloqueia o primeiro marco.

## C05 — Fonte de dados única

Persistir cadastros no Supabase. Interfaces dos perfis consultam os mesmos registros. Não substituir persistência remota por localStorage ou dados estáticos como entrega do CRUD.

## C06 — Consistência financeira e de estoque

Valores monetários em centavos; regras documentadas de arredondamento. Reserva e transição de estado precisam ser validadas no banco/servidor. Bloquear saldo negativo, dupla reserva, pagamento e repasse duplicados.

## C07 — Protótipo acadêmico responsável

Usar participantes e contatos fictícios. Pagamento e transporte físico são simulados. Não solicitar cartão, conta bancária, CPF ou contato real. Não representar seletor de perfil como autenticação segura de produção.

## C08 — Código compreensível

Separar interface, serviços e domínio. Evitar infraestrutura sem necessidade. Grupo deve conseguir explicar cada parte. Registrar uso real de IA, validações e limitações; nunca fabricar commits, entrevistas, prompts ou testes.

## C09 — Integrações isoladas

API de rotas e futuro WhatsApp não devem contaminar as regras de negócio. Segredos de servidor nunca vão para o navegador. Falhas externas devem ter mensagens e alternativas explícitas.
