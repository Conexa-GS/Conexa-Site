# Passagem para o chat implementador

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

Atualização em 07/11/2026: o texto abaixo descreve a origem do planejamento. M1/M2 concluídos. M3 implementado na branch `feature/m3-transporte-financeiro` e validado localmente e por API no demo autorizado. T20 permanece aberto pela revisão de interface em 360 px/desktop e teclado. D009 registra decisões M3. Próximo passo é avaliar M3 e autorizar eventual integração na dev; M4+ segue como prévia. Consulte tasks.md e validation.md antes de continuar. Não reaplicar migrations já registradas no projeto demo.

Planejamento e especificação somente. Não há site implementado, migrations executadas, API de rotas configurada, repo criado, deploy ou Supabase provisionado por este trabalho.
