# Conexa

Leia `Conexa-specs/README.md`, `spec.md`, `business-rules.md` e `workflow.md` antes de alterar o projeto. O pedido explícito do usuário prevalece sobre propostas dos documentos.

- Trabalhe em `feature/*`, criada a partir de `dev`. Nunca edite ou faça commits diretamente na `main`.
- Use Conventional Commits. Preserve o trabalho existente.
- Após a mudança, apresente o resultado para avaliação e peça autorização antes de subir/integrar na `dev`. Não promova para `main` por pressuposição.
- Registre somente prompts de programação e o uso real de IA correspondente em `IA.md`, seguindo as cinco seções de `Conexa-specs/workflow.md`. Perguntas, consultas e esclarecimentos não entram no registro. Não invente testes, prompts ou aprovação humana.
- Preserve a identidade visual do piloto: creme, verde, laranja, marca vetorial e ilustrações locais.
- M2 e M3 usam demandas, composição, reservas, transporte e confirmações persistidas no Supabase demo. T20/M3 receberam aceite explícito do usuário; limites da verificação visual pelo agente estão em validation.md. M4+ continua como prévias identificadas. Não apresentar transporte/pagamento de exemplo como operações ativas.
- Não declare M1 concluído sem verificar CRUD e RLS no Supabase real de demonstração.
- Verificações locais: `npm run lint`, `npm test`, `npm run build`; confira telas em 360 px e desktop quando houver alteração de interface.
