# Roteiro de demonstração para avaliação

Preparado em **12/11/2026**. É um procedimento a executar; não é relato de execução ou aceite humano. Separe as etapas locais das conectadas. Em todas elas, cenários/contas são fictícios e transporte/pagamento são simulações.

## Preparação — 2 minutos

1. Extraia o ZIP e entre em `Conexa-Site`. Confira o SHA-256 externo, o manifesto e o [README](../../README.md). Use Node 24.21.0/npm 11.19.0 ou ambiente compatível; execute `npm ci`, as verificações e `npm run dev -- --host 127.0.0.1`. Abra o endereço informado pelo Vite.
2. Escolha **local sem credenciais** ou **demo conectado**. Sem `.env*` preenchido, o site usa ofertas em memória e avisa quando um fluxo exige Supabase. No demo, configure somente chave pública e contas fictícias pelos meios locais do grupo; não projete o arquivo de ambiente, DevTools com tokens ou dados pessoais.
3. Para duas identidades, abra abas novas pelo endereço e selecione um participante em cada; evite duplicar a aba autenticada. Defina quem opera cada perfil. Recarga da mesma aba retoma Auth/participante se sessionStorage estiver disponível.
4. Para revisar sem escrita remota, prefira as bancadas abaixo. Etapas conectadas com gravação deixam histórico compartilhado: usar somente fixtures próprias/contas demo e autorização correspondente. O presente roteiro não manda executar testes remotos automaticamente.

## Percurso local sem segredos — 6 a 8 minutos

| Passo | Ação do apresentador | O que o avaliador deve observar |
| --- | --- | --- |
| 1. Proposta | Abrir `/`, percorrer apresentação e `/demo` | Creme/verde/laranja, marca vetorial e ilustrações locais; cenário fictício; movimento reduzido disponível |
| 2. CRUD em memória | Entrar como Ana; criar oferta com produto/coleta do catálogo, quantidade positiva, preço ≥ mínimo e datas futuras; corrigir um valor inválido e depois editar a oferta | Erros orientam correção; sucesso atualiza lista. Trocar para comprador mostra a mesma fonte em memória na página atual. F5 reinicia esse modo; não alegar persistência remota |
| 3. Fluxos dependentes de banco | Abrir demandas, operações e Conversas sem Supabase | Indisponibilidade é explícita; não anunciar proposta, frete, pagamento ou DM persistidos |
| 4. Bot/DM em bancada | Abrir `/tests/ui/conversations.html`; usar opções do bot, preparar/corrigir/cancelar uma prévia e depois confirmar outra; abrir pessoa, enviar mensagem fictícia e exercitar falha/reenvio | Controles/componente reais com fixtures em memória; bot identificado, nenhuma gravação no demo. Mensagem humana não altera oferta nem formaliza acordo |
| 5. Estados e teclado | Abrir `/tests/ui/accessibility.html`; percorrer com Tab/Shift+Tab/Enter/Escape e revisar falhas/vazios; repetir 360×800 e desktop | Foco/labels/erros e alternativa por texto. Nova observação humana deve ser registrada; revisão dirigida anterior não é auditoria integral |
| 6. IA/voz | Mostrar documentação e, opcionalmente, painel simulado da bancada | API paga e voz reais pendentes; resposta da IA é texto. Não habilitar flag nem pedir microfone para esta etapa local |

Bancadas existem no servidor de desenvolvimento e ficam fora do build de produção; falhas controladas e F5 da bancada não provam rede física/persistência. Excluir oferta local sem vínculos pode completar a demonstração CRUD em memória; a prova de Delete remoto é a T31, com limites na matriz.

## Percurso conectado opcional — 10 a 15 minutos

Usar o demo já configurado, sem reaplicar migrations/seed ou alterar cadastros alheios. Verificar saldo, disponibilidade e datas atuais; números históricos 30+20 kg/R$330 ilustram a regra e não são garantia de saldo atual. Para preparar fixtures novas, usar o fluxo normal ou um roteiro manual já autorizado e registrar os IDs; não executar por engano `*:demo` enquanto faz demonstração local.

| Passo | Ação | Resultado esperado e cuidado |
| --- | --- | --- |
| 1. Persistência | Ana cria oferta própria sem vínculos, edita, recarrega; comprador em outra aba consulta | Mesmo ID e valores. Registrar data/evidência; não confundir nova autenticação por API com F5 no navegador |
| 2. Bot | Produtor abre Minhas ofertas → Cadastrar por conversa, cria/edita oferta própria guiada; mostra prévia antes de confirmar | Sem confirmação não muda catálogo. Confirmar revisão atual grava e comprador consulta; comprador não edita oferta alheia |
| 3. DM | Produtor e comprador abrem a conversa um do outro; enviar apenas texto fictício, conferir entrega, não lidas e F5 | Histórico persiste e cada mensagem é única. DM não executa reserva, preço, pagamento ou aceite; histórico enviado permanece no demo |
| 4. Composição e fornecimento | Comprador cria demanda própria e seleciona quantidades compatíveis; envia proposta; cada produtor aceita | Banco reserva atomicamente. Insuficiência pede ajuste explícito; seleção/envio são ações separadas. Saldo não pode ficar negativo |
| 5. Transporte e totais | Transportador usa veículo compatível e cota; comprador seleciona, revisa alimentos+frete/taxa zero; participantes confirmam | Indicação não é cotação confirmada. Roteiro manual, desconhecidos “a confirmar”, mínimo individual preservado. Revisão invalida aceites; não prometer API de mapas |
| 6. M5 em avaliação | Só em carga própria autorizada: pagamento simulado aprovado, agendamento, início/entrega fictícios, divergência e resolução pelo comprador, recebimento separado | Pendente/recusado não agenda; divergência bloqueia repasses; resolução não confirma recebimento automaticamente; parcelas e dinheiro continuam simulados |
| 7. Encerramento | Conferir fixtures/IDs e limpar apenas cadastros próprios sem vínculos; cancelar/arquivar os vinculados conforme estado | Não apagar histórico entregue nem registros alheios. Cargas concluídas, mensagens/comandos e repasses fictícios ficam auditáveis |

Para falha antes/depois do envio e reconciliação pela mesma chave, seguir [conversas-validacao-demo.md](../conversas-validacao-demo.md). Não interromper fisicamente a rede como parte implícita deste roteiro: T41 foi adiada pelo usuário e continua pendente. Voz/GPT-Live e T42 estão no planejamento futuro desde 13/11/2026 (D032), fora deste roteiro e do aceite atual de texto/DM. O roteiro de voz e os mocks são históricos; não validam microfone, custo ou encerramento no provedor.

## Encerrar a avaliação — 2 minutos

Mostrar a [matriz](matriz-verificacoes.md) e as [limitações](limitacoes.md). Registrar o que foi realmente observado, por quem, quando e em qual ambiente; deixar como pendente o que não foi executado. Solicitar decisão explícita sobre o pacote e, separadamente, aceite M5/M6 no escopo avaliado. Se houver aprovação para Git, registrar autorização de publicar a feature/integrar na `dev`; não estender para `main`, deploy ou voz real.
