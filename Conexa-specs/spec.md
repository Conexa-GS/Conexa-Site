# Especificação funcional

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

Um seletor de participantes fictícios permite demonstrar os perfis. Requisitos de autenticação de produção ficam fora do MVP.

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
| US11 Produtor gerencia ofertas por conversa | RF11 Bot Conexa no site | Criar/atualizar/arquivar ofertas próprias por texto, com prévia e confirmação; voz opcional em demonstração e mesmas regras do formulário. Implementado em T29/T34–T37, verificado no demo para texto com D025; voz real e aceite M6 pendentes |
| US12 Produtor e comprador conversam na plataforma | RF12 Mensagens entre participantes | Aba Conversas nos dois perfis, histórico persistido, mensagens individuais e não lidas; acordos por texto não executam operações. Implementado e tecnicamente verificado em T35/T38 e D025; aceite M6 pendente |

## Requisitos de qualidade

Bot Conexa oferece ações visíveis desde a abertura: consultar, criar, editar e arquivar ofertas para o produtor; consulta para o comprador. Seleção da oferta e do campo a corrigir usa botões; números/datas são informados em campos guiados, com catálogo/coleta e vencimento desconhecido selecionáveis. Palavras-chave ficam como alternativa opcional. As mesmas validações, prévia e confirmação explícita continuam obrigatórias (D022).

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
- M6: chat acessível; T29 é a base guiada existente. Nova prioridade: aba Conversas no site para produtor/comprador, bot para gerenciar ofertas e mensagens individuais. Texto simulado sem custo como padrão; OpenAI Realtime/voz opcional para testes manuais do usuário. T34–T40 implementadas nos escopos registrados, T35/T38 verificadas tecnicamente; T41 parcial, T42 e T43/aceite do marco pendentes.

T30 solicitada em 10/11/2026: evolução separada de WhatsApp por texto em preparação local, especificada em `t30-whatsapp.md`. Não ativa o canal nem amplia o fluxo principal para contatos/transportes/pagamentos reais.

Direção vigente de 11/11/2026 (D018): T30 fica pausada após os experimentos de integração, preservados também em `feature/t30-twilio-supabase`. Priorizar [conversas-site.md](conversas-site.md) e T34–T43. Este planejamento não desativa o endpoint demo existente nem autoriza novos gastos. “Atualizar automaticamente” significa preparar a alteração pela conversa e aplicar após confirmar a prévia, preservando RN45. O comprador não pode editar ofertas de produtores.

## Fora do escopo

Atualização local T39/T40 em 11/11/2026: adaptador Realtime opcional e entrada de voz/transcrição preparados, desabilitados por padrão, com respostas em texto; D021 substitui emissão efêmera pelo SDP intermediado no servidor. Continua sem voz/provedor reais verificados. Testes pagos T42 exclusivos do usuário e requisitos de configuração/implantação em [voz-manual.md](voz-manual.md); não encerra M6.

Dinheiro real, transporte físico, autenticação de produção, WhatsApp oficial como dependência da nova entrega (T30 pausada), otimização global de frota, múltiplos compradores por carga, certificação de segurança alimentar e integração obrigatória com os trabalhos das outras matérias. Transcrição/voz via OpenAI é exceção demo opcional planejada para teste manual pago pelo usuário; tem implementação local opcional desabilitada, ainda sem validação real ou implantação. Grupos, anexos, chamadas entre participantes e escrita de demandas/transporte/pagamentos/aceites pelo bot ficam fora desta fatia.
