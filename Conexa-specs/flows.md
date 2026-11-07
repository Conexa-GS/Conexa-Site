# Telas, fluxos e estados

## Rotas de interface sugeridas

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
| /operacoes/:id | Roteiro, cotações, valores, confirmações e histórico conforme perfil |
| /operacoes/:id/pagamento | Resumo e controles de simulação para comprador |

Não criar páginas vazias para representar funcionalidade concluída. M2 implementa demandas, composição e propostas. M3 usa `/operacoes` como lista de transporte/valores/aceites conforme perfil; solicitações e veículos são persistidos. `/operacoes/exemplo` e pagamento de exemplo continuam prévias independentes de M4/M5.

Fluxo M3: fornecimentos aceitos → produtor pode indicar transportador e preço → transportador cadastra veículo e confirma cotação completa própria ou vinculada à indicação → comprador seleciona cotação → banco cria snapshot de cotação e nova versão da proposta → cada produtor, comprador e transportador selecionado confirma novamente → `awaiting_payment`. Nada é pago/agendado no M3. Capacidade, peso, conservação e validade são verificados no banco. Mudanças relevantes exigem cancelamento/remontagem, preservando histórico e liberando reservas. O roteiro manual deriva da saída informada, itens em ordem de UUID, destino e retorno opcional; não há rota externa nem distância/tempo inventados.

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

- Campos com labels e explicação da unidade; datas e dinheiro em padrão brasileiro.
- Botões de salvar não permitem duplicar envio enquanto pendente.
- Exclusão exige confirmação; explicar quando só é possível arquivar.
- Mostrar oferta publicada como “disponível”, nunca “vendida” só por cadastro.
- Erro remoto preserva formulário; botão de tentar novamente.
- Painel financeiro por participante; mapa não é a única forma de entender roteiro.
