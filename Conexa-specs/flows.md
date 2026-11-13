# Telas, fluxos e estados

Atualização vigente em 12/11/2026: integração WhatsApp **descontinuada** por pedido explícito do usuário (D029) e retirada das tarefas. Menções anteriores a pausa/preparação são históricas; preservar experimentos e evidências. Esta revisão documental não executa desativação de recursos remotos.

Estado vigente em [estado-atual.md](estado-atual.md). Conversas usa o bot D022–D025; M4/M5/revisões e texto/DM têm migrations aplicadas ao demo. T30 pausada; o protocolo local abaixo é histórico, sem presumir desativação de experimentos demo existentes.

Evolução T30 por texto: OFERTA → perguntas → prévia versionada → corrigir/cancelar/confirmar → aguardar resultado. Resposta perdida mantém reconciliação bloqueante; não anuncia sucesso nem permite outra publicação até conferir o resultado. Estados completos em [t30-whatsapp.md](t30-whatsapp.md). Somente protocolo/demonstrador locais nesta fase; sem nova tela ou canal externo ativo.

## Rotas de interface implementadas

| Caminho | Conteúdo |
| --- | --- |
| / | Proposta, aviso de protótipo e entrada na demonstração |
| /demo | Seleção de participante fictício |
| /produtor/ofertas | Lista, saldo, cadastro, edição e exclusão/arquivo |
| /produtor/propostas | Valores individuais e aceite/recusa |
| /comprador/ofertas | Consulta de ofertas publicadas |
| /comprador/demandas | CRUD de necessidades |
| /comprador/demandas/:id/composicao | Candidatas, quantidades, insuficiência e alternativa inclusiva |
| /transportador/solicitacoes | Cargas para cotar |
| /transportador/veiculos | Veículos e condições |
| /produtor/conversas, /comprador/conversas | Bot Conexa e mensagens individuais |
| /operacoes | Lista de transporte, cotações, valores, aceites e controles M5 por carga/perfil |
| /operacoes/exemplo | Roteiro e resumo fictícios independentes |
| /operacoes/exemplo/pagamento | Prévia de mensagens, sem cobrar/agendar |

Não criar páginas vazias para representar funcionalidade concluída. M2 implementa demandas, composição e propostas. M3 usa `/operacoes` como lista de transporte/valores/aceites conforme perfil; solicitações e veículos são persistidos. `/operacoes/exemplo` e pagamento de exemplo continuam prévias independentes de M4/M5.

Fluxo M3: fornecimentos aceitos → produtor pode indicar transportador e preço → transportador cadastra veículo e confirma cotação completa própria ou vinculada à indicação → comprador seleciona cotação → banco cria snapshot de cotação e nova versão da proposta → cada produtor, comprador e transportador selecionado confirma novamente → `awaiting_payment`. Nada é pago/agendado no M3. Capacidade, peso, conservação e validade são verificados no banco. Mudanças relevantes exigem cancelamento/remontagem, preservando histórico e liberando reservas. O roteiro manual deriva da saída informada, itens em ordem de UUID, destino e retorno opcional; não há rota externa nem distância/tempo inventados.

Fluxo manual M4 (implementação inicial em 08/11, aceite em 09/11): na composição, **Comparar composições** consulta saldo/histórico e apresenta duas candidatas, com diferença apenas dos alimentos; **Usar esta candidata** preenche a seleção, sem enviar/reservar. Em transporte, comprador vê grupos de cotações equivalentes; comprador/transportador podem consultar roteiro manual por cotação/versão. Falha de análise mantém composição/cotação M2/M3 disponíveis. Migration M4 aplicada ao demo em 10/11; percurso conectado completo não comprovado por isso; detalhes e pendências em `m4-routes.md`.

Fluxo M2 atualizado após avaliação: comprador cadastra demanda → abre automaticamente a escolha dos produtores → seleciona quantidades exatas e prazo → clica **Enviar proposta aos produtores** na própria composição → serviço salva candidata e envia pela RPC existente → banco reserva atomicamente no envio → cada produtor responde no próprio perfil. A lista de propostas serve para acompanhar respostas, sem aprovação intermediária do comprador. Ambos aceitam: aguarda cotação no M3; recusa: cancela toda a proposta e libera reservas. Comprador pode cancelar com motivo e remontar. Demanda só permite uma proposta ativa. Listas atualizam a cada 30 segundos, ao recuperar foco ou pelo botão Atualizar; toda ação revalida no servidor.

Se salvar funcionar e enviar falhar, o rascunho é preservado e o reenvio usa o mesmo UUID. Resposta de rede perdida após envio confirmado é recuperada por consulta à mesma proposta. Gravação incerta de candidata exige revisão antes do reenvio. Rascunhos antigos são retomados pelo botão **Continuar envio**; não reservam estoque nem chegam ao produtor antes do envio.

Demandas, propostas e transporte possuem filtros **Ativas**, **Histórico** e **Ocultas**, com contagens; a visualização inicial mostra apenas ativas. Arquivadas/canceladas/expiradas ficam no histórico. Produtor vê **Novas para responder** separadas das propostas **Em andamento**. Ocultar/reexibir afeta apenas a visualização do participante naquele navegador e naquela lista, persistida em localStorage com UUIDs; não muda Supabase, reservas, prazos, estado ou acesso de outros participantes. Preferência indisponível no navegador mantém funcionamento em memória. Ocultar uma proposta ativa não suspende seu prazo.

## Cenário-base demonstrativo

Ana: 30 kg de alface a R$ 5/kg, mínimo R$ 4/kg. João: 25 kg a R$ 5/kg, mínimo R$ 4,50/kg. Restaurante demanda 50 kg; escolhe 30 de Ana e 20 de João. João mantém 5 kg livres.

Frete completo fictício: R$ 80 pago pelo restaurante. Ana recebe R$ 150; João R$ 100; transportador R$ 80; total R$ 330; taxa zero. Não informar economia sem cotação alternativa comparável. Locais, horários e nomes são fictícios.

## Máquina de estados da carga

| Estado | Ação de avanço e responsável | Próximo estado |
| --- | --- | --- |
| draft | Comprador envia composição; servidor valida e reserva | awaiting_producers |
| awaiting_producers | Todos os produtores aceitam versão atual | awaiting_quotes |
| awaiting_quotes | Cotação confirmada disponível | awaiting_final_approval |
| awaiting_final_approval | Comprador seleciona/aprova; transportador ratifica; servidor valida tudo | awaiting_payment |
| awaiting_payment | Pagamento simulado aprovado e estoque válido | scheduled |
| scheduled | Transportador inicia viagem | in_transit |
| in_transit | Comprador recebe sem divergência | delivered |
| in_transit | Comprador registra divergência | delivery_review |
| delivery_review | Resolução registrada e comprador confirma | delivered |

Cancelar antes de in_transit → cancelled; recusa de produtor → cancelled com liberação, para remontar proposta. Expiração antes de agendamento → expired, libera reservas; se houver necessidade de retomar, criar/revalidar proposta. Cancelamento de pagamento aprovado também registra refund simulado.

“Precisa de ajuste” é um indicador de impedimentos, não um estado que apaga a etapa atual. Exibir motivos e ação permitida. Ações fora de ordem são rejeitadas no servidor, mesmo que chamadas fora da interface.

## Aceites

Um aceite vale para uma versão da proposta. Mudanças relevantes incrementam versão e invalidam aceites afetados. Antes do pagamento, alterações são feitas retomando a etapa necessária e revalidando reservas. M1–M3 podem adotar cancelamento/remontagem para reduzir complexidade; não implementar edição silenciosa. Após pagamento seguir RN37.

## Pagamento e repasse

Pagamento: pendente, aprovado, recusado ou estornado. Pagamento recusado permite nova tentativa; aprovado só uma vez. Agendamento só após aprovado. Repasses: pendente até recebimento, em análise em divergência, simulado concluído uma única vez após resolução.

## Experiência comum

### Cadastro por conversa vigente — M6 em avaliação

Em Minhas ofertas, **Cadastrar por conversa** abre `/produtor/conversas?conversa=bot` na mesma aba, selecionando o Bot Conexa sem iniciar rascunho. Opções de consultar/criar/editar/arquivar orientam o produtor; comprador consulta. Prévia versionada e confirmação separada usam o gateway compartilhado; F5 retoma sessão, histórico e rascunho estruturado remotos. Pedido já iniciado mantém texto/payload e chave por participante/aba; após recarga, a pessoa abre a conversa e verifica explicitamente a mesma chave. Não reenviar automaticamente. Texto ainda não enviado é volátil. Storage indisponível impede novo envio sem chave durável. Contrato D020–D025 e evidências em conversas-site.md/validation.md.

### Histórico do modal T29 — 10/11/2026

O relato abaixo descreve o componente antigo, preservado nas bancadas/testes; D023 removeu sua entrada de Minhas ofertas. Não aplicar suas instruções de fechamento/reenvio ao bot vigente.

Em `/produtor/ofertas`, **Cadastrar por conversa** abre diálogo opcional; **Nova oferta** mantém o formulário. Oito perguntas explícitas: alimento em kg do catálogo, quantidade, preço, mínimo, início/fim da disponibilidade, vencimento opcional e coleta do perfil. Datas digitadas em DD/MM/AAAA ou ISO; nenhuma data, alimento, endereço ou vencimento é inferido. Não há áudio nem interpretação livre por IA.

Cada resposta é validada antes de avançar; respostas aceitas ficam consultáveis e corrigíveis. A última abre prévia completa com botão separado **Confirmar e publicar oferta**. Corrigir exige novo retorno à prévia; dependências e data corrente são revalidadas na confirmação. Responder, corrigir ou fechar não chama o serviço de escrita. Fechar descarta o rascunho em memória. Confirmar usa `useOffers.save`/`saveOffer`, atualiza a lista e mostra sucesso; publicação não confirma venda. Envio em andamento bloqueia correção, fechamento e repetição simultânea. Falha preserva dados, recebe foco e permite nova tentativa; queda durante o envio exige conferir a lista antes de repetir, pois o CRUD existente não garante idempotência após resposta perdida.

Catálogo sem alimento em kg/coleta informa impedimento, recebe foco e orienta atualizar. Durante envio, o botão Fechar fica desabilitado e Escape não descarta o rascunho. Labels, mensagens associadas, anúncio da pergunta e foco no campo/prévia/sucesso foram exercitados programaticamente em jsdom; o mesmo componente publicou pelo serviço real no demo e o comprador consultou o registro após nova autenticação. Diálogo/teclado nativos, visual em 360 px/desktop, F5 e avaliação humana continuam pendentes. Bancada sem Supabase em `/tests/ui/m6.html`; evidências em `validation.md`.

### Fechamento da operação e padrões comuns

M5 preparada localmente em 09/11/2026: controles reais de demonstração ficam em `/operacoes`, junto ao resumo e histórico da carga persistida; não foi criada página dinâmica de pagamento separada. Comprador escolhe resultado explícito (pendente/recusado/aprovado); aprovação agenda em simulação. Transportador selecionado inicia viagem fictícia. Comprador registra divergência ou confirma recebimento. Na divergência, cada ocorrência precisa de resolução escrita pelo comprador, seguida de confirmação de recebimento separada; só então os repasses são registrados. Produtor/transportador veem acompanhamento, ocorrências e seu próprio repasse. Pedido de cancelamento após saída vira ocorrência com aviso explícito de estoque preservado e ausência de estorno automático. Cancelamento/entrega ficam no Histórico das listas. As páginas `/operacoes/exemplo` e `/operacoes/exemplo/pagamento` continuam prévias independentes. Sem a migration M5, M3 continua disponível e a interface informa M5 em preparação, sem liberar pagamento. Migration aplicada ao demo em 10/11 e API parcial verificada; percurso conectado completo e aceite M5/T28 permanecem pendentes.

- Campos com labels e explicação da unidade; datas e dinheiro em padrão brasileiro.
- Botões de salvar não permitem duplicar envio enquanto pendente.
- Exclusão exige confirmação; explicar quando só é possível arquivar.
- Mostrar oferta publicada como “disponível”, nunca “vendida” só por cadastro.
- Erro remoto preserva formulário; botão de tentar novamente.
- Painel financeiro por participante; mapa não é a única forma de entender roteiro.


## Cotação confirmada e alterações — 09/11/2026

Após confirmar cotação, o cartão fica verde com ícone, revisão, frete protegido e resumo dos horários. O formulário de nova cotação é substituído por Modificar proposta. A edição oferece veículo, saída, entrega no dia desejado e validade, com motivo e confirmação dos avisos; o frete permanece exibido sem campo editável. Nova revisão selecionada exige todos os aceites finais. Edição e negociação são anteriores ao pagamento aprovado.

Negociação separada: após conversa direta, transportadora registra novo valor/motivo; comprador aprova ou recusa no site. Até resolver, o valor atual permanece e seleção/aceites/pagamento da cotação ficam pausados. Aprovação cria revisão e avisos. Recusa permite manter o frete original sem taxa ou consultar taxa simulada por urgência e confirmar desistência. A prévia mostra base, faixa, prazo, limite do vencimento ausente, divisão e reenvio; cálculo que mudar exige nova confirmação.

Desistência confirmada reabre a carga para cotação, preservando reservas/fornecimentos e exigindo novos aceites finais depois da escolha. A transportadora seguinte recebe aviso no site quando houver veículo compatível. Sem candidata, a pendência fica explícita. Taxa simulada aparece aos envolvidos, sem desconto no valor dos alimentos ou adição ao frete futuro.

Comprador/produtores veem avisos na área Atualizações de transporte de qualquer tela autenticada, com contagem de não lidos, motivo, antes/depois, acesso a Transporte e valores e opção Marcar como lida. Consulta a cada 30s e ao voltar à janela. Nenhuma mensagem externa é enviada. Troca de versão/encerramento fecha negociação pendente obsoleta, sem taxa automática.
