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

Não criar páginas vazias para representar funcionalidade concluída. No M1, implementar apenas entrada, CRUD e consulta de ofertas.

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
