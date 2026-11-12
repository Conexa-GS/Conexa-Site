# Passagem para continuidade do projeto

## Solicitação vigente para copiar

Continue o site **Conexa** existente. Leia [estado-atual.md](estado-atual.md), spec.md, business-rules.md e workflow.md; depois tasks.md, validation.md e os contratos do escopo escolhido. Inspecione branch, alterações e código antes de editar. Trabalhe em feature/* criada da dev, preservando o trabalho existente.

M1–M4 já têm aceite humano nos limites registrados. Não iniciar o projeto novamente. T35/T38 estão encerradas tecnicamente para texto/DM; bot guiado, atalho direto, retomada de sessão e pedidos incertos após F5 já estão integrados. A próxima verificação de T41 é a interrupção física de rede; falhas controladas com persistência real já foram exercitadas. Voz/T42 depende dos testes pagos do usuário; T43/aceite M6 e T28/aceite M5 continuam pendentes, com seus próprios critérios.

Complemento posterior D026 de 12/11, na `feature/t41-rede-recuperacao`: alerta de consulta recuperada corrigido, 109 testes/lint/build aprovados e offline da aba/F5/replay/reconciliação automática verificados no navegador integrado/demo, com cinco DMs e um pedido do bot únicos. Prova física adiada pelo usuário, sem queda de WebSocket observada na emulação. Não confundir esses níveis de falha. Feature deve ser avaliada e autorizada antes de publicação/integração; não consta integrada nas referências anteriores. Evidências/chaves em validation.md.

O demo Supabase já recebeu as migrations registradas em validation.md; nomes locais e versões remotas diferem. Não reaplicar SQL nem executar reset/repair por suposição. Identifique ambiente, histórico e escopo autorizado antes de nova operação remota. Não use segredos no navegador ou no registro de IA.

Preserve creme, verde, laranja, marca vetorial e ilustrações locais. Transporte, pagamento e repasses são fictícios; M5/M6 e páginas de exemplo continuam identificados como prévias/demonstração. T30 está pausada; não ativar WhatsApp ou voz por pressuposição.

Execute npm run lint, npm test e npm run build após mudanças; se houver interface, confira 360 px e desktop. Registre somente procedimentos reais com ambiente, responsável e limites. Diferencie implementação, verificação técnica, aceite humano e integração Git. IA.md recebe somente prompts de programação e uso real correspondente, conforme workflow.md. Apresente o resultado para avaliação e peça autorização antes de subir/integrar a nova feature na dev; não promova main automaticamente.

## Histórico da solicitação inicial

O texto abaixo preserva a instrução de origem e seu estado em 07/11. “Iniciar”, “comece por M0/M1” e “não há site” não são instruções para a continuidade atual.

## Solicitação pronta para copiar

Você será responsável por iniciar o site CAMPOCIDADE usando desenvolvimento guiado por especificação.

Leia os arquivos deste pacote na ordem do README. Trate spec.md e business-rules.md como base funcional; plan.md, data-model.md e contracts.md contêm propostas técnicas que devem ser resolvidas e registradas quando necessário. Respeite instruções do usuário e do checkout de destino.

Comece por M0 e M1 em tasks.md: aplicação React/Vite/Tailwind, Supabase, participantes fictícios e CRUD de ofertas, com consulta pelo comprador. Não implemente toda a plataforma de uma vez. Não altere decisões centrais para simplificar o código e não acrescente login de produção, pagamentos reais, rotas avançadas ou WhatsApp oficial.

Inspecione o workspace antes de criar estrutura; preserve trabalho existente. Prepare migrations, seeds e políticas de acesso. Não faça mudanças em um projeto Supabase remoto sem identificar o projeto e a autorização apropriada. Não publique ou gaste créditos por pressuposição.

Use dinheiro em centavos, quantidades validadas e serviços separados da interface. Seletor demo não é identidade confiável: defina sessões/permissões limitadas e teste RLS. Não coloque service_role no navegador. Não peça que o usuário cole segredos privados no chat.

Se faltarem URL/chave pública/configuração do Supabase ou projeto de destino, avance nos arquivos e verificações independentes, explique a pendência específica e não declare o CRUD remoto concluído. Mock e localStorage não substituem o aceite do banco.

Valide M1 pelos AC01–04 e AC23. Registre procedimentos e resultados reais, atualize tasks.md, decisions.md, README e AI.md. Não invente testes, commits ou prompts. Informe o que funciona, o que foi verificado e o que falta. Após concluir M1, proponha o próximo marco com base no pacote.

## O que acompanhar na transferência

- Enviar a pasta completa ou o ZIP, não apenas este arquivo.
- Informar checkout/repositório de destino, caso já exista.
- Informar se há projeto Supabase de demonstração configurado e como acessar a configuração de forma apropriada.
- Integrantes, cidade/bairro e pesquisa com pessoa real continuam pendentes; não inventar dados.

## Estado atual do pacote

Atualização em 07/11/2026: o texto abaixo descreve a origem do planejamento. M1/M2/M3 concluídos por aceite do usuário; T20 aprovado explicitamente e promoção dev → main autorizada. M3 e revisão de fluxo/listas implementados e integrados na dev; D009/D010 registram decisões. Próximo marco: M4/T21. M4+ segue como prévia. Não atribuir ao Codex testes visuais não executados; consulte tasks.md e validation.md. Não reaplicar migrations já registradas no projeto demo.

Planejamento e especificação somente. Não há site implementado, migrations executadas, API de rotas configurada, repo criado, deploy ou Supabase provisionado por este trabalho.
