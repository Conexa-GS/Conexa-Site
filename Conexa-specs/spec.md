# Especificação funcional

## Problema e proposta

Pequenos produtores têm ofertas fragmentadas, dificuldade de acesso a compradores e custos de distribuição. A Conexa reúne ofertas para atender demandas de restaurantes e mercados, conecta transporte local e compara viabilidade e inclusão.

Território real e evidência de escuta: pendentes de preenchimento pelo grupo. Não inventar cidade, entrevistas ou resultados. Até essa definição, os cenários são fictícios.

## Atores

- Produtor: publica ofertas, recebe propostas, confirma fornecimento e indica transporte.
- Comprador: registra demanda, seleciona composição, aprova total, simula pagamento e confirma recebimento.
- Transportador: autônomo ou empresa; cadastra veículo, apresenta cotação e executa mudanças de status da viagem.
- Organizador: responsabilidade exercida pelo comprador no MVP; não criar um quarto portal administrativo obrigatório.

Um seletor de participantes fictícios permite demonstrar os perfis. Requisitos de autenticação de produção ficam fora do MVP.

## Histórias e requisitos

| História | Requisito | Resultado observável |
| --- | --- | --- |
| US01 Produtor gerencia disponibilidade | RF01 CRUD de ofertas | Dados persistem após recarregar; comprador consulta os mesmos registros |
| US02 Comprador informa necessidade | RF02 CRUD de demandas | Produto, quantidade, unidade, destino e data definidos |
| US03 Comprador reúne pequenos fornecedores | RF03 Busca e composição | Quantidades selecionadas de várias ofertas atendem uma demanda |
| US04 Produtor responde ao fornecimento | RF04 Reserva e confirmação | Aceite ou recusa altera operação e saldo |
| US05 Produtor indica contato local | RF05 Indicação de transportador | Cotação fica pendente até aceite do transportador fictício |
| US06 Transportador apresenta proposta | RF06 Veículo e cotação | Condições e valor do roteiro completo registrados |
| US07 Comprador avalia logística e inclusão | RF07 Análise comparativa | Mostra custo, critérios individuais, percurso e razões da sugestão |
| US08 Participantes aprovam operação | RF08 Confirmações e histórico | Apenas transições permitidas; mudanças relevantes invalidam aceites |
| US09 Comprador demonstra pagamento | RF09 Pagamento simulado | Aprovado, pendente ou recusado; sem cobrança real |
| US10 Participantes acompanham entrega | RF10 Entrega e repasses | Mesma operação nos três perfis e repasses simulados após recebimento |
| US11 Produtor cadastra por conversa | RF11 Chat demonstrativo posterior | Prévia e confirmação antes de salvar pela mesma regra do formulário |

## Requisitos de qualidade

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
- M6: chat acessível, após o fluxo principal; WhatsApp oficial é evolução separada.

## Fora do escopo

Dinheiro real, transporte físico, autenticação de produção, transcrição real, WhatsApp oficial, otimização global de frota, múltiplos compradores por carga, certificação de segurança alimentar e integração obrigatória com os trabalhos das outras matérias.
