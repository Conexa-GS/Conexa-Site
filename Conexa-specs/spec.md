# Especificação funcional

Escopo vigente em **13/11/2026 (D032)**: voz/GPT-Live está no planejamento futuro, adiada sem prazo e fora da entrega ativa. RF11/M6 mantém bot guiado por texto, prévia e confirmação; RF12 mantém mensagens. T42 adiada não bloqueia T43/aceite M6 de texto/DM. Referências anteriores a voz opcional planejada ficam como histórico; código e evidências preservados, sem ativação.

Estado de execução consolidado em [estado-atual.md](estado-atual.md), 12/11/2026. Requisitos não são evidência de teste ou aceite; procedimentos e limites em validation.md.

T28/M5 tecnicamente verificada no Supabase demo em 12/11, inclusive ciclo de entrega/divergência/resolução/repasses e percurso dos três perfis com F5; aceite humano M5 pendente. D027 preserva uma parcela simulada por beneficiário mesmo quando o valor do alimento arredonda a zero centavos, sem permitir negativos.

## Problema e proposta

Pequenos produtores têm ofertas fragmentadas, dificuldade de acesso a compradores e custos de distribuição. A Conexa reúne ofertas para atender demandas de restaurantes e mercados, conecta transporte local e compara viabilidade e inclusão.

Território real e evidência de escuta: pendentes de preenchimento pelo grupo. Não inventar cidade, entrevistas ou resultados. Até essa definição, os cenários são fictícios.

## Atores

- Produtor: publica ofertas, recebe propostas, confirma fornecimento e indica transporte.
- Comprador: registra demanda, seleciona composição, aprova total, simula pagamento e confirma recebimento.
- Transportador: autônomo ou empresa; cadastra veículo, apresenta cotação e executa mudanças de status da viagem.
- Organizador: responsabilidade exercida pelo comprador no MVP; não criar um quarto portal administrativo obrigatório.

Atualização de 13/11/2026, por pedido explícito do usuário (D030): entrada principal em `/login` com e-mail/senha individuais no Supabase Auth, cadastro nos três perfis, confirmação de e-mail e recuperação de senha. O seletor anterior fica em `/demo`, identificado como acesso de desenvolvedor às quatro contas fictícias, disponível em desenvolvimento ou build de demonstração explicitamente habilitada. Não concede acesso a credenciais/contas pessoais de terceiros. As operações de negócio continuam acadêmicas e simuladas; login individual não representa liberação comercial do produto.

Retomada demo D024: com Supabase, recarregar a mesma aba revalida Auth/participante e mantém o acesso ao perfil. Sessão é armazenada por aba e Trocar participante a encerra; outro documento não recebe os eventos Auth dessa aba. Sem configuração ou com storage bloqueado, não prometer retomada persistente. A sessão salva não substitui validação no servidor nem RLS.

Recuperação D025: antes de enviar DM/turno/confirmação do bot, guardar o pedido incerto e sua chave em sessionStorage por participante/aba. Após recarga, a pessoa abre a conversa e verifica explicitamente pela mesma chave; não reenviar automaticamente. Só limpar o journal ao confirmar o resultado correspondente, sem deixar resposta tardia apagar pedido novo. Texto ainda não enviado continua volátil; storage indisponível impede iniciar envio sem chave durável. Rascunho estruturado, oferta e histórico permanecem no Supabase. Rejeição definitiva de revisão exige consultar estado atual antes de oferecer nova confirmação.

Recuperação D026: consultar estado/histórico com sucesso limpa o erro da consulta anterior do bot, preservando erro, bloqueio e chave de um envio ainda incerto. Recuperar a consulta não confirma o pedido. Falha controlada, offline emulado da aba e interrupção física são evidências distintas; a última permanece pendente nesta rodada.

## Histórias e requisitos

| História | Requisito | Resultado observável |
| --- | --- | --- |
| US01 Produtor gerencia disponibilidade | RF01 CRUD de ofertas | Dados persistem após recarregar; comprador consulta os mesmos registros |
| US02 Comprador informa necessidade | RF02 CRUD de demandas | Produto, quantidade, unidade, destino e data definidos |
| US03 Comprador reúne pequenos fornecedores | RF03 Busca e composição | Quantidades selecionadas de várias ofertas atendem uma demanda |
| US04 Produtor responde ao fornecimento | RF04 Reserva e confirmação | Aceite ou recusa altera operação e saldo |
| US05 Produtor indica contato local | RF05 Indicação de transportador | Cotação fica pendente até aceite do transportador fictício |
| US06 Transportador apresenta proposta | RF06 Veículo e cotação | Cotação confirmada tem apresentação distinta; revisão de veículo/horários avisa os envolvidos e preserva frete; novo valor exige aprovação do comprador |
| US07 Comprador avalia logística e inclusão | RF07 Análise comparativa | Mostra custo, critérios individuais, percurso e razões da sugestão |
| US08 Participantes aprovam operação | RF08 Confirmações e histórico | Apenas transições permitidas; mudanças relevantes invalidam aceites; notificações persistidas e negociação com manutenção do valor original ou desistência/taxa simulada e reencaminhamento |
| US09 Comprador demonstra pagamento | RF09 Pagamento simulado | Aprovado, pendente ou recusado; sem cobrança real |
| US10 Participantes acompanham entrega | RF10 Entrega e repasses | Mesma operação nos três perfis e repasses simulados após recebimento |
| US11 Produtor gerencia ofertas por conversa | RF11 Bot Conexa no site | Criar/atualizar/arquivar ofertas próprias por texto, com prévia, confirmação e mesmas regras do formulário. Implementado em T29/T34–T37, verificado no demo para texto com D025; aceite M6 pendente. Voz guardada para uma etapa futura (D032), fora do escopo ativo |
| US12 Produtor e comprador conversam na plataforma | RF12 Mensagens entre participantes | Aba Conversas nos dois perfis, histórico persistido, mensagens individuais e não lidas; acordos por texto não executam operações. Implementado e tecnicamente verificado em T35/T38 e D025; aceite M6 pendente |

## Requisitos de qualidade

Revisão de 13/11/2026 (D031): Conversas apresenta sugestões próximas ao compositor sempre aberto. Bot responde com perguntas, cartões selecionáveis de ofertas/colheitas, correção e prévia dentro do histórico, com rolagem independente e confirmação explícita. A consulta do produtor permite escolher a oferta para editar. Propostas/demandas continuam nos fluxos próprios e comprador permanece somente consulta no bot. Esta disposição substitui o menu acima do histórico e a digitação recolhida de D022.

Bot Conexa oferece ações visíveis desde a abertura: consultar, criar, editar e arquivar ofertas para o produtor; consulta para o comprador. Seleção da oferta e do campo a corrigir usa botões. Por pedido de 13/11/2026 (complemento D031), quantidades, preços e datas são respondidos no compositor normal, conforme a pergunta atual, sem campo duplicado no balão. Catálogo/coleta e vencimento desconhecido continuam selecionáveis. Palavras-chave ficam como alternativa opcional. As mesmas validações, prévia e confirmação explícita continuam obrigatórias (D022).

“Cadastrar por conversa”, em Minhas ofertas, leva diretamente ao Bot Conexa dentro da aba Conversas, na mesma aba do navegador. Não abre diálogo separado nem inicia cadastro automaticamente; preserva o rascunho existente (D023).

- RNF01: layout utilizável em celular e desktop, sem rolagem horizontal na largura de 360 px nas telas principais.
- RNF02: formulários com labels, mensagens associadas e navegação por teclado; cor não é a única indicação de estado. Falhas de ações recebem foco e são trazidas à área visível; a cotação mostra erros junto da confirmação e orientações nos campos de datas inválidas.
- RNF03: carregamento, vazio, sucesso e erro em todas as consultas e mutações remotas.
- RNF04: configuração por ambiente; credenciais administrativas e de rotas no servidor; acessos ao banco com permissões explícitas.
- RNF05: validação de saldo, dinheiro e estados não depende exclusivamente da interface.
- RNF06: README permite executar a aplicação; histórico e AI.md refletem desenvolvimento real.
- RNF07: valores estimados ou simulados identificados em todos os resumos onde possam ser confundidos com confirmados.

## Entregas incrementais

- M1: estrutura, participantes fictícios, CRUD de ofertas no Supabase, consulta pelo comprador.
- M2: demandas, busca, composição, reserva e aceite dos produtores.
- M3: transporte, cotações, valores individuais e confirmações finais.
- M4: rotas, comparação de alternativas e critérios de inclusão.
- M5: pagamento, acompanhamento, recebimento, cancelamento e repasses simulados.
- M6: chat acessível; T29 é a base guiada existente. Aba Conversas no site para produtor/comprador, bot para gerenciar ofertas por texto e mensagens individuais. T34–T38 implementadas nos escopos registrados, T35/T38 verificadas tecnicamente; T41 parcial e T43/aceite do marco pendente. Base opcional T39/T40 preservada; voz/GPT-Live e T42 adiadas para uma etapa futura (D032), sem bloquear a avaliação de texto/DM.

T30/WhatsApp descontinuada por pedido explícito do usuário em 12/11/2026 (D029) e retirada das tarefas. A [especificação anterior](t30-whatsapp.md) conserva somente a origem histórica dos experimentos.

Direção vigente em 12/11/2026 (D029, substitui a pausa de D018): integração externa descontinuada; experimentos preservados também em `feature/t30-twilio-supabase` apenas como histórico. Priorizar [conversas-site.md](conversas-site.md) e T34–T43. Este planejamento não desativa o endpoint demo existente nem autoriza novos gastos. “Atualizar automaticamente” significa preparar a alteração pela conversa e aplicar após confirmar a prévia, preservando RN45. O comprador não pode editar ofertas de produtores.

## Fora do escopo

Atualização local T39/T40 em 11/11/2026: adaptador Realtime opcional e entrada de voz/transcrição preparados, desabilitados por padrão, com respostas em texto; D021 substitui emissão efêmera pelo SDP intermediado no servidor. Continua sem voz/provedor reais verificados. Testes pagos T42 exclusivos do usuário e requisitos de configuração/implantação em [voz-manual.md](voz-manual.md); não encerra M6.

Dinheiro real, transporte físico, autenticação de produção, integração WhatsApp (descontinuada, D029), otimização global de frota, múltiplos compradores por carga, certificação de segurança alimentar e integração obrigatória com os trabalhos das outras matérias. Transcrição/voz via OpenAI e integração GPT-Live estão adiadas para uma etapa futura (D032); base local opcional desabilitada preservada, sem validação real ou implantação. Grupos, anexos, chamadas entre participantes e escrita de demandas/transporte/pagamentos/aceites pelo bot ficam fora desta fatia.
