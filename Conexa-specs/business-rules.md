# Regras de negócio

Estes IDs são a referência canônica deste pacote e substituem a numeração das versões anteriores da conversa. Requisitos técnicos e etapas estão nos outros arquivos.

## Cadastros

- RN01: cada oferta pertence a um produtor; demanda a um comprador; cotação a um transportador.
- RN02: oferta exige produto, quantidade positiva, unidade, preço unitário de venda, mínimo líquido unitário, coleta e período de disponibilidade. Venda unitária não pode ficar abaixo do mínimo. Vencimento do produto é opcional e separado da disponibilidade; quando informado, não pode anteceder seu fim e é preservado no snapshot da composição.
- RN03: demanda exige produto, quantidade positiva, unidade, destino e data desejada.
- RN04: oferta publicada ou demanda registrada não é venda confirmada.
- RN05: só comparar unidades iguais ou com conversão explícita. Peso para logística precisa ser conhecido; não presumir peso de caixa, maço ou unidade.
- RN06: ofertas e demandas relacionadas a histórico não podem ser apagadas fisicamente; arquivar. Exclusão real é permitida em cadastro sem vínculos, para demonstrar o CRUD.

## Busca, seleção e estoque

- RN07: ofertas candidatas precisam atender produto, unidade, prazo e disponibilidade. Região ajuda a selecionar, mas não exclui automaticamente os mais distantes.
- RN08: demanda pode reunir vários produtores. Oferta pode atender diversas operações respeitando o saldo.
- RN09: se a oferta total for insuficiente, informar quantidade encontrada; só reduzir demanda com aceite do comprador.
- RN10: comprador escolhe a composição sugerida; MVP não precisa otimização automática complexa.
- RN11: cada carga tem um comprador, um destino, diversos itens de ofertas e um transportador selecionado ao final. RF03 começa com um produto por demanda; diferentes demandas do mesmo comprador podem ser agrupadas posteriormente se datas e conservação forem compatíveis.
- RN12: envio aos produtores cria reservas temporárias com prazo visível e configurável. O prazo inicial proposto é 24 horas, limitado pela disponibilidade; não é regra já validada em operação real.
- RN13: reserva exige verificação atômica de saldo no servidor/banco. Recusa, cancelamento e expiração liberam reservas. O MVP cancela a proposta recusada e permite remontá-la, sem substituições silenciosas.
- RN14: saldo livre = quantidade total ofertada − reservas ativas − quantidades comprometidas em operações pagas/concluídas. Converter reserva em compromisso sem descontar duas vezes; cancelar antes do transporte libera o compromisso.

## Inclusão

- RN15: considerar menos vendas concluídas e maior tempo de espera da oferta como indicadores de menor atendimento, com base apenas no histórico da plataforma.
- RN16: entre composições viáveis, favorecer produtores menos atendidos. Informar o motivo da sugestão e não prometer participação ou venda para todos.
- RN17: permitir comparar menor custo entre as composições avaliadas e opção inclusiva, mostrando diferenças. Não alegar ótimo global.
- RN18: antes de existir cotação comparável, identificar composição como candidata, com custo/viabilidade pendentes. Distância menor não prova frete menor.
- RN19: se a inclusão inviabilizar a operação, manter a oferta disponível para novas demandas/transportes, respeitando validade. Nunca reduzir o mínimo do produtor automaticamente.

## Transporte e rota

- RN20: aceitar empresas e autônomos. Produtor pode indicar transportador e preço; só transportador confirma a proposta.
- RN21: cotação exige veículo, capacidade, percurso, datas, validade, valor e serviços incluídos. Informar cobertura de combustível, pedágio, coletas, descarga e eventual retorno.
- RN22: impedir confirmação quando faltarem peso/capacidade ou condições de conservação compatíveis. Os limites apresentados são dados do cenário, não certificado sanitário.
- RN23: incluir coleta altera roteiro e exige nova cotação e aceites dos afetados. Não presumir custo adicional zero.
- RN24: comparar transporte para mesmo roteiro e serviços. Cotação final do transportador é a fonte do preço aprovado.
- RN25: rota inclui saída do transportador, coletas e destino; retorno apenas quando acordado. Mostrar distância, direção, tempo de paradas separado e pedágio, distinguindo estimativa de confirmação.
- RN26: pedágio indisponível fica nulo e “a confirmar”, nunca zero implícito. Estimativa inadequada ao tipo de veículo não vira custo confirmado.
- RN27: custos já incluídos na cotação não são somados novamente. Custos obrigatórios não incluídos precisam ser explicitados e consolidados no valor final antes da aprovação.
- RN28: falha da API de rotas permite análise com cotação manual completa, sem inventar distância/tempo/pedágios. Simulação opcional precisa ser identificada.

## Dinheiro e viabilidade

- RN29: produtor define mínimo líquido unitário. Não representar esse mínimo como lucro comprovado.
- RN30: comprador paga frete separado; não fazer rateio nem descontar frete dos produtores no MVP. Taxa da plataforma é zero.
- RN31: bruto de cada produtor = soma dos valores dos seus itens. Líquido = bruto − descontos explicitamente acordados. MVP começa sem descontos; não implementar desconto oculto.
- RN32: total comprador = soma alimentos + frete final + taxa zero. Mínimo exigido de cada produtor = quantidade × mínimo unitário acordado.
- RN33: permitir confirmação final apenas com mínimos individuais preservados, fornecimentos aceitos, transportador e condições confirmados e comprador aprovando o total.
- RN34: resultado agregado positivo nunca compensa produtor abaixo do mínimo. Dinheiro em centavos; comparar mínimos com a mesma regra de arredondamento dos valores apresentados.
- RN35: IVT apresenta critérios atendidos, pendentes ou violados. Sem fórmula de pontuação acordada, não criar índice numérico arbitrário.

## Confirmação e execução

- RN36: mudanças de produtos, quantidades, preço, roteiro, veículo, frete ou datas invalidam os aceites afetados; registrar nova versão antes de pedir confirmação. Antes do pagamento, transportadora pode revisar seu veículo/horários/validade, com frete preservado e aviso persistido no site ao comprador e produtores. Cotação selecionada revisada volta a exigir todos os aceites finais; candidata revisada ainda depende da seleção e de todos os aceites finais.
- RN37: no MVP não editar valores de operação paga; cancelar com estorno simulado antes do transporte e criar nova proposta.
- RN38: só pagamento simulado aprovado libera agendamento. Pagamento pendente ou recusado não libera transporte.
- RN39: operação e pagamento têm estados separados. Todos acompanham os mesmos dados persistidos.
- RN40: cancelamento antes do transporte registra motivo, libera estoque e estorna pagamento aprovado uma única vez. Depois do início registrar ocorrência; não liberar estoque já em trânsito automaticamente.
- RN41: comprador confirma recebimento ou divergência. Com divergência, repasses ficam em análise; não concluir recebimento sem resolução registrada.

## Simulações e acessibilidade

- RN42: não cobrar dinheiro nem solicitar cartão/conta real. Resultado de simulação é controlado em interface de demonstração claramente identificada.
- RN43: uma operação não pode ter dois pagamentos aprovados; reenvio/repetição não duplica cobrança, estorno ou repasse. Tentativas recusadas podem ser preservadas no histórico.
- RN44: recebimento confirmado sem divergência registra repasses simulados aos produtores e transportador, uma única vez. Conforme o arredondamento em centavos da RN34, parcela de produtor que totaliza zero mantém registro simulado de zero, sem cobrança mínima inventada ou bloqueio da entrega; valores negativos continuam proibidos (D027).
- RN45: chat usa os mesmos dados e validações; texto/áudio interpretado exige prévia e confirmação antes de salvar. Na implementação de Conversas de 11/11/2026, o bot do site prepara criação/edição/arquivamento apenas de ofertas próprias do produtor. Alterar rascunho ou encontrar versão/saldo diferente invalida confirmação anterior. Comprador consulta e conversa, sem editar ofertas de terceiros. Mensagens entre pessoas não são comandos ao bot nem formalizam reserva, venda, frete, pagamento ou aceite; usar os fluxos existentes. OpenAI/voz é opcional, iniciada explicitamente, com testes pagos pelo usuário; texto simulado permanece disponível. T30/WhatsApp externo fica pausada (D018).
- RN46: dados fictícios, estimativas, ausência de dados e impactos não validados devem estar explicitamente identificados. Nunca fabricar economia sem uma base comparável.
- RN47: após confirmar cotação, frete fica bloqueado na edição. Novo valor exige registro de conversa direta e aprovação explícita do comprador. Negociação pendente/recusada não muda o preço e bloqueia seleção, aceites e pagamento dessa cotação até aprovação, manutenção do valor original ou desistência. Aprovação cria revisão, avisa os envolvidos e, se selecionada, exige novos aceites. Não editar após pagamento aprovado.
- RN48: se comprador recusa novo frete e transportadora também não aceita o original, a desistência registra taxa exclusivamente simulada sobre o frete original: 5% acima de 72h, 15% com mais de 24h até 72h, 30% com até 24h. Usar o menor prazo entre entrega cotada e fim do dia de vencimento informado dos itens (São Paulo). Vencimento ausente usa entrega naquele item, com aviso. Registrar snapshot de prazo/percentual/base/valor no momento da desistência e exigir nova confirmação se o cálculo mudar. Não há cobrança real. Metade para comprador; metade para produtores, proporcional ao valor dos alimentos. Centavo ímpar vai ao comprador; resíduos dos produtores ficam com o último por UUID. Se alimentos totalizarem zero, dividir a metade dos produtores igualmente, preservando resíduos.
- RN49: desistência após recusa reabre a proposta com reservas e fornecimentos preservados, invalida aceites finais e encaminha aviso à próxima transportadora demo com veículo de capacidade/conservação compatível, ordenada por nome/UUID, excluindo quem já desistiu da carga. Não presume cotação, aceite ou preço da substituta. Sem candidata compatível, informar pendência e manter aberta para transporte. A desistente não recota a mesma carga; demais operações permanecem disponíveis. Taxa não altera frete futuro nem os valores dos alimentos.
