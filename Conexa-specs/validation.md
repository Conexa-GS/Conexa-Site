# Verificação da primeira versão — 07/11/2026

## Voz para uma etapa futura — D032 — 13/11/2026

Responsável: Codex. Branch `feature/voz-bau-ideias`, criada da `dev` limpa `f68da9d`. Pedido do usuário: guardar a parte de voz para uma etapa futura. Alteração exclusivamente documental: decisão D032, escopo/continuidade/tarefas/aceites e referências da entrega alinhados. T42 adiada, não concluída; voz/GPT-Live fora do escopo ativo e sem bloquear avaliação T43/M6 de texto/DM. Código opcional e evidências anteriores preservados; sem alteração de aplicação, schema ou configuração.

Verificações locais executadas no checkout, Windows/PowerShell: `npm run lint` aprovado, `npm test` aprovado (**120 testes**, zero falhas), `npm run build` aprovado com aviso de chunk principal acima de 500 kB; `git diff --check` sem erros. Testes de voz existentes usam mocks, sem microfone ou API paga. Sem alteração de interface, não houve nova revisão visual em 360 px/desktop. Não foram feitos testes remotos, ativação de voz, regeneração do ZIP, push, merge ou deploy nesta revisão. A decisão de adiar é explícita; aceite M5/M6 e autorização de publicação/integração desta feature não são presumidos. IA.md não alterado: decisão de escopo, sem prompt de programação.

## Tipografia e limpeza visual — 13/11/2026

Responsável: Codex. Branch `feature/tipografia-interface-limpa`, criada da `dev` limpa `db3290d2fc8e4a1184430a7a2636e2f1893054e0`. Pedido do usuário: trocar a fonte principal usando o import do Google Fonts fornecido e retirar subtextos, contornos laranja e numerações desnecessários. Poppins adotada como principal dentre as três famílias do link, com fallback Arial/sans-serif. Marca vetorial, ilustrações locais e paleta preservadas; nenhuma animação nova.

Implementação: import global e preconnects, fonte compartilhada por títulos/controles/área dos participantes, peso e tamanho dos títulos ajustados para Poppins. Removidos textos promocionais repetidos no login/início, legendas decorativas das ilustrações, introduções redundantes nas páginas de tarefas e números decorativos das seções/etapas. Mantidos estados, dados, valores, revisões, instruções de confirmação, erros e identificação de simulações/prévias. Contorno do conteúdo principal ao navegar removido; foco dos controles preservado em verde. Bordas decorativas de destaque/negociação em verde/neutro. Código de movimento deixou de atualizar as legendas removidas.

Verificação local final: `npm run lint` aprovado, `npm test` com **119 testes aprovados**, zero falhas, e `npm run build` aprovado. Build conserva aviso de chunk acima de 500 kB. `git diff --check` aprovado. Sem novos testes que apenas reproduzam a edição de textos/CSS.

Navegador integrado: início e login em desktop e **360×800**, com Poppins carregada e sem rolagem horizontal nos estados inspecionados; início também capturado em **1366×900**. Seção de produtores percorrida pelo link da página; numeração/legendas redundantes ausentes e console do início sem erros capturados. Área de ofertas e modal Nova oferta conferidos na bancada `tests/ui/participant.html`, usando servidor Vite separado em `127.0.0.1:5176`, `envDir:false`, dados locais e nenhuma gravação. Área de ofertas conferida em desktop/360 px; modal conferido em 360 px. Inspeção dirigida, sem revisão visual integral de todos os estados de transporte/composição/conversas. Não foram repetidos testes remotos de CRUD/RLS nem executadas migrations, pagamentos, transportes, envios de mensagens ou autenticações novas. Capturas locais do início desktop/mobile e login desktop preparadas para avaliação.

Após a apresentação da mudança, o usuário autorizou explicitamente em 13/11/2026: “pode mandar para a dev”. Autorização restrita à publicação/integração desta alteração na `dev`; não representa relato de testes humanos individuais. Nenhuma promoção para `main` ou implantação autorizada nesta interação.

## Saneamento documental T04/T31 e retirada de T30 — 12/11/2026

Responsável: Codex. Branch `feature/saneamento-ia-tarefas`, criada da `dev` local `48ec847465d8320501a4c36044894786c4d0777d`; criação bloqueada no sandbox e repetida com escalonamento aprovado antes das edições. Sem fetch. Pedido explícito: sanear consultas/esclarecimentos antigos de IA.md com rastreabilidade e retirar a integração WhatsApp descontinuada das tarefas.

[Mapa, critérios e origem](saneamento-ia.md): 54 registros originais preservados integralmente em histórico não canônico, com commit/hash; 22 entradas exclusivamente de consulta/preparação/aceite/publicação segregadas e 32 registros de programação mantidos com cinco seções e IDs originais. Trechos mistos segregados com links para a origem; programação e resultados remotos da continuação 047 preservados. Nenhum novo prompt de programação criado para esta revisão documental. T04 encerrada quanto aos artefatos versionados; ressalva de conteúdo da T31 tratada, sem certificar completude dos integrantes ou aceite acadêmico.

T30 e suas subtarefas/dependências foram retiradas de tasks.md, sem renumerar as seguintes. D029 e documentos de continuidade indicam descontinuação por pedido do usuário, substituindo a pausa de D018. Código e evidências anteriores preservados como histórico; nenhuma chamada ou desativação de recurso remoto executada.

Verificações locais executadas: `npm.cmd run lint` aprovado; `npm.cmd test` com **113 testes aprovados**, zero falhas; `npm.cmd run build` aprovado, com aviso preexistente de chunk acima de 500 kB. Sem mudança de interface, nova inspeção em 360 px/desktop não se aplica. Não foram repetidos testes de banco/demo, rede física ou voz; não houve migration, escrita remota, API paga, push, merge, deploy ou novo aceite humano.

Conferência documental executada por script Node temporário via terminal: corpo do arquivo histórico idêntico ao blob Git original (SHA-256 conferido); 54 IDs de origem, 22 entradas segregadas e 32 canônicas com cinco seções; 13 entradas de programação sem segregação de trechos idênticas ao original. Todos os IDs mantidos na ordem original; 184 links locais/âncoras dos documentos alterados conferidos, zero destinos ausentes. tasks.md sem T30/WhatsApp/Meta/Twilio; consultas/transcrições de esclarecimento identificadas ausentes do canônico. README, AI.md, IA.md e .env.example presentes. git diff --check aprovado. O ZIP anterior não foi regenerado; T32 externa, T41 física, T42 real, T43/aceite M6 e aceite M5 conservam seus limites. Avaliação desta revisão e autorização para publicar/integrar na dev pendentes conforme workflow; sem promoção para main. Relatos abaixo são históricos, inclusive as antigas indicações de saneamento pendente.

## T32/T33/T43 — Artefatos para avaliação — 12/11/2026

Responsável: Codex. `feature/t32-t33-t43-entrega`, criada da dev limpa `17d2684`; primeira criação de branch bloqueada pela escrita nos metadados Git, repetida com escalonamento aprovado antes de editar. Preparados [índice da entrega](entrega/README.md), README reproduzível, [matriz](entrega/matriz-verificacoes.md), [limitações](entrega/limitacoes.md), [roteiro](entrega/roteiro-demonstracao.md) e `scripts/package-delivery.ps1`. Evidências anteriores consolidadas com data/responsável/ambiente; nenhum teste remoto ou aceite humano reconstituído por inferência. README reorganizado para remover instruções vigentes contraditórias; relatos datados preservados nos documentos de origem/histórico Git.

Ambiente: Windows, Node 24.21.0, npm 11.19.0 e PowerShell 7.6.9. Empacotador exige Git/PowerShell 7.2+, sem npm. Seleciona fontes rastreados/novos não ignorados em caminhos/extensões permitidos, rejeita links/reparse points e exclui ambiente preenchido, Git, dependências, builds, relatórios/capturas locais, caches e cotas SQLite. Confere exemplos vazios, padrões e correspondência com credenciais locais >=8 caracteres sem imprimir valores; apenas a URL sintética do teste negativo de configuração tem exceção literal restrita ao próprio arquivo. Cria manifesto/metadados e relê todas as entradas/hash/contagem antes de substituir o ZIP. Credenciais desconhecidas e conteúdo semântico de imagens continuam fora da garantia do detector.

| Procedimento executado | Resultado e limite |
| --- | --- |
| `npm.cmd run lint` no checkout | Aprovado; repetido após ignorar somente `artifacts/entrega/**` no ESLint para evitar analisar cópias geradas. PowerShell verificado pela execução do empacotador, não pelo ESLint |
| `npm.cmd test` no checkout | 113 testes aprovados, zero falhas; Node/jsdom/mocks, sem Supabase/API paga |
| `npm.cmd run build` no checkout configurado | Aprovado; principal 686,19 kB/gzip 196,26 kB, aviso preexistente >500 kB. `dist` não entra no ZIP |
| `pwsh -NoProfile -File ./scripts/package-delivery.ps1` | Aprovado após correções; 274 entradas incluindo `ENTREGA.json` e `MANIFEST.sha256`. Saídas em `artifacts/entrega/`, ignoradas; SHA-256 do ZIP/auditoria externos para evitar autorreferência |
| Prova negativa com marcador sintético de chave em `.md` permitido | Recusada sem imprimir o valor; ZIP anterior manteve hash. Fixture removida |
| Prova negativa com senha sintética preenchendo `.env.example` | Recusada como exemplo com credencial; ZIP anterior preservado e bytes originais restaurados em finally |
| Prova negativa com credencial sintética em `.env.package-probe` e `.md` | Comparação por valor bloqueou sem imprimir a credencial; ambos os arquivos removidos |
| Inventário independente com ZipArchive | 274 entradas; somente três arquivos `.env*.example` permitidos, sem ambiente preenchido, Git, dependências, build ou relatórios locais |
| Extração em diretório novo e `npm.cmd ci --offline --no-audit --no-fund` | 218 pacotes instalados do cache local, sem copiar `node_modules` ou `.env`; instalação pelo lockfile comprovada. Não foi testado download do registro npm pela rede |
| Lint/testes/build na cópia extraída sem credenciais | Aprovados: 113 testes, zero falhas. Build sem Supabase: principal 470,62 kB/gzip 141,54 kB; não é o mesmo bundle configurado do checkout |
| `npm.cmd run test:db` na cópia extraída | Nove scripts PGlite aprovados, incluindo zero centavos, Conversas/bot e cenário T41. Identidade simulada/conexão serial, sem Auth/Realtime ou concorrência remota |
| Preview extraído em `127.0.0.1:4187` e HTTP | Home, `/demo`, `/produtor/ofertas`, `/comprador/conversas`, `/operacoes` e assets retornaram 200; caminhos diretos devolveram HTML da SPA. Processo próprio encerrado. Não é execução visual/JS no navegador ou deploy |
| Repetição do empacotador, links e comparação da cópia testada | Duas gerações consecutivas produziram SHA-256 idêntico; 45 links locais/âncoras dos cinco artefatos conferidos; 232 fontes/assets/testes e package/lockfile/Vite/HTML comparados byte a byte com a extração testada, sem diferença |

A instalação/suítes usaram extração preliminar com os mesmos arquivos de aplicação/lockfile da entrega; revisões documentais, exigência mínima PowerShell e exclusão de cópias geradas no ESLint foram consolidadas depois. O ZIP final é regenerado após a documentação/commit e tem cada entrada relida/hash conferido. Mesmos arquivos, HEAD e branch produzem bytes iguais no ambiente verificado; o HEAD sozinho não identifica alterações locais.

Primeira tentativa do script falhou no terminador de comentário PowerShell antes de empacotar; corrigido. Primeira varredura válida bloqueou URL sintética `user:pass` do teste negativo de configuração. Criada exceção literal restrita àquele caminho/padrão, preservando o teste e os demais bloqueios. Provas negativas posteriores confirmaram recusas esperadas. Sem mudança de aplicação, UI, domínio, schema, migrations ou permissões remotas. Sem nova revisão visual em 360 px/desktop; evidência anterior dirigida preservada, smoke HTTP não apresentado como revisão visual.

T33 concluída como registro documental. T32 parcial: README/pacote preparados, repo privado/acesso de escrita dos professores, deploy/links e envios não comprovados. T43 tem documentação/roteiro prontos para avaliação; aceite M6, aceite M5, rede física/T41, voz real/T42 e saneamento histórico de IA.md pendentes. Sem API paga, microfone, escrita remota, mensagem externa, alteração de conta, push, merge ou deploy. Publicação/integração na dev depende da avaliação/autorização do usuário conforme workflow; main fora desta entrega.

## T31 — Conferência acadêmica — 12/11/2026

Responsável: Codex. Branch `feature/t31-auditoria-academica`, criada da dev limpa `5ac6fce`; primeira tentativa de criar a branch bloqueada por escrita nos metadados Git, repetida com escalonamento aprovado antes das edições. [Relatório completo](t31-auditoria.md): critérios, dez componentes com consumidores reais, seis hooks em uso, useState/useEffect, serviços/domínio separados, quinze commits significativos e ressalvas dos registros de IA. Sem fetch; histórico local não certifica o estado atual do GitHub.

| Procedimento | Resultado e ambiente |
| --- | --- |
| `npm.cmd run lint` | Aprovado; ESLint, incluindo o novo roteiro remoto no ambiente Node |
| `npm.cmd test` | 113 testes aprovados; Node/jsdom/domínio/mocks, sem executar o roteiro remoto automaticamente |
| `npm.cmd run build` | Aprovado; aviso preexistente de chunk principal acima de 500 kB, sem erro |
| `node tests/remote-t31.mjs --check` | Configuração offline aprovada; nenhum acesso/escrita remota |
| `node tests/remote-t31.mjs --run-demo` | Sete grupos aprovados no Supabase demo real, Auth/REST/RPC com chave pública e contas fictícias existentes; três rodadas completas, última versão com saída 0 |
| Inspeção de código/Git/IA | Definições/imports/renderização, seis consumidores de hooks, 70 commits sem merge na base (69 títulos convencionais), amostra de quinze mudanças reais, AI.md e 52 registros anteriores de IA.md com cinco seções |

Roteiro manual novo em `tests/remote-t31.mjs`, usando os serviços reais de ofertas via Vite SSR/helper jsdom existente; nenhum componente foi renderizado como prova visual. Criação/leitura pelo produtor, atualização de 531 para 532 centavos, incremento de versão e recusa de versão antiga, nova autenticação do comprador lendo o mesmo ID/valores, negativas REST de UPDATE/DELETE e RPC de edição para comprador/João/anônimo, retorno ao dono e exclusão física da oferta sem vínculos. Ausência confirmada por SELECT direto e listas do produtor/comprador após nova autenticação. Estado da oferta conferido após cada negativa; não se usou consulta administrativa para provar RLS. Validação de versão foi sequencial, sem alegar concorrência simultânea.

Rodada final: `e9d6512a-7da6-44cd-a5d2-bb92f64b46a0`, iniciada em `2026-11-13T01:44:20.952Z` (**12/11/2026, 22h44 em São Paulo**), status `passed`. Oferta própria `281df3e2-c804-4001-ad0f-0983f9286e55`: `deleted_and_absence_verified`. Primeira rodada `9dbc14d4-bdf7-4b42-8fc3-e26f3c46cae8`, oferta `01c5b812-2838-4d5a-a388-9744564a3c5b`; segunda `d08a76e4-24e1-40ef-92d2-5882c8f3cf49`, oferta `571a4616-8bf0-44da-bf51-67e6287a3214`: ambas também excluídas e ausência verificada. Relatório bruto final em `artifacts/t31-remote.local.json`, ignorado pelo Git e sem credenciais; os resultados/IDs essenciais estão preservados neste registro versionado.

A primeira execução passou todos os grupos e a limpeza, mas manteve o processo vivo pelo cliente Auth do ambiente SSR e emitiu avisos de instâncias com a mesma storageKey. Após o PASS/relatório salvo, processo encerrado por Ctrl+C. Acrescentados storageKey exclusivos e `auth.dispose()` (método confirmado no SDK instalado) para liberar canais/timers; segunda rodada passou com saída natural, código 0, sem esses avisos. ESLint então apontou `throw` dentro de finally (`no-unsafe-finally`): corrigida a sinalização de falha de limpeza sem mascarar a exceção original, e impedido PASS em caso de limpeza malsucedida. Lint/configuração offline/diff conferidos e terceira execução remota completa passou, com saída 0. Nenhuma correção na aplicação ou no schema foi necessária.

IA: todos os 52 registros anteriores têm cinco subseções, com nomes equivalentes. Ressalvas concretas: interação 003 registra consulta sem alteração de funcionalidade/configuração; interação 001 inclui esclarecimento sobre onde executar comandos. Não satisfazem o recorte vigente de somente programação. Histórico preservado, saneamento documentado como pendência; interação 057 registra a criação/verificação do roteiro desta entrega. Não se certificou completude de interações de todos os integrantes ou aprovação humana.

Limites: sem nova UI e, portanto, sem nova verificação visual em 360 px/desktop; sem F5/navegador nesta rodada, auditoria integral de acessibilidade/segurança, suite PGlite repetida, corrida simultânea, rede física, voz/API paga, migrations, contas novas ou operações reais. Não foram reexercitados arquivamento de oferta vinculada ou estoque; respectivas evidências anteriores preservadas. T31 encerra a conferência com ressalva; não encerra T32/T33, saneamento de IA.md, aceite M5/M6 ou T41/T42/T43. Sem push, merge, deploy ou nova autorização presumida.

## Revisão de fluxos, responsividade e teclado — 12/11/2026

Responsável: Codex. Branch `feature/revisao-fluxos-acessibilidade`, criada da dev limpa `dd9311f`. Pedido: “Revise os fluxos principais em 360 px e desktop, incluindo navegação por teclado, foco, formulários, erros e estados vazios. Corrija os problemas observados preservando a identidade visual.” Implementação local para avaliação; sem push, merge, deploy ou novo aceite de marco.

Ambiente: Vite em `http://127.0.0.1:5173`, navegador integrado, viewports CSS **360×800** e **1366×900**. Consultadas as sessões demo existentes de Ana, Restaurante Raiz e Transporte Caminho pela interface normal. Não foram criadas/excluídas ofertas, demandas, veículos ou reservas, nem enviadas DMs ao demo ou executadas transições de pagamento/viagem. Ocultação local de uma proposta existente foi revertida. Falhas de gravação/envio e sucesso de recuperação foram exercitados em bancadas com serviços em memória, separadamente do site conectado.

### Problemas reproduzidos e correções

- Navegação móvel cortava o último link e podia recortar seu indicador de foco. Links passam a ocupar duas colunas, com todos os destinos visíveis e altura mínima de 44 px. Foco de controles usa laranja escuro da identidade existente.
- O link “Ver transporte, pagamento e acompanhamento” ultrapassava a lista de propostas: documento com **391 px** para **345 px** de conteúdo disponível. Botões agora respeitam a largura do contêiner e quebram entre palavras; após ajuste, scrollWidth/clientWidth **345/345** em 360 px e **1351/1351** no desktop nos percursos medidos.
- “Arquivar” quebrava no meio da palavra no diálogo de exclusão. Ações passam a ocupar linhas inteiras até 400 px; fechamento possui alvo mínimo de 44 px e fica desabilitado durante ações pendentes.
- `/demo` não recebia foco após navegar; telas de acesso/página inexistente não tinham região principal focável. Acrescentados atalho de conteúdo e destino de foco; foco também é aplicado depois da retomada assíncrona da sessão e do carregamento da landing. Diálogo usa título único e recorre ao conteúdo se o acionador for removido.
- Ocultar/reexibir removia o botão focado e deixava o foco no body. Agora o filtro atual recebe foco, inclusive quando sua lista fica vazia.
- Oferta e demanda mantinham campos editáveis durante gravação. Fieldset desabilitado e aria-busy refletem o envio, com fechamento/Cancelamento bloqueados; falha libera controles, preserva dados e recebe foco. `DemandForm` aceita request injetável para verificação isolada, mantendo `m2` como padrão.
- Composição mostrava somente mensagem geral ao exceder saldo e não indicava o erro do prazo. Campos agora associam orientações com aria-invalid/aria-describedby, reutilizando selectionSummary. Ofertas do mesmo produtor têm labels distintos por posição. Quantidade 999 para saldo 30 e prazo 0 mostraram os erros locais; 30+20 para demanda 50/prazo 24 removeu erros e habilitou envio, sem enviá-lo.
- Busca sem resultados ganhou “Limpar filtros”, que restaura a lista e o foco da pesquisa; contagem é anunciada como status. No comprador, seis ofertas voltaram após limpar.
- Na bancada de DM, após sucesso, o foco era solicitado enquanto o textarea ainda estava disabled, ficando no body. Retorno ao compositor agora aguarda o render que libera o campo. Reenvio após falha e segundo envio local confirmaram foco em `conversation-message`, texto limpo, campo habilitado e mensagens únicas.

### Percurso efetivamente conferido

| Área | Verificação no navegador |
| --- | --- |
| Início, perfis e acesso | 360 px/desktop; entrada por Enter, atalho de conteúdo, troca de participante, retorno da página inexistente, foco após carregar a landing. |
| Produtor/ofertas | 360 px/desktop; busca/vazio, validação de nova oferta, primeiro campo inválido, erros associados, Tab, Escape e retorno ao acionador; diálogo de exclusão aberto e fechado sem excluir. Recarga autenticada retomou Ana e focou o conteúdo. |
| Propostas/listas | Ocultar/reexibir, Histórico/Ocultas e vazio; correção de foco verificada em bancada, sem perder registro. Lista conectada expunha botão longo que foi corrigido. |
| Comprador/demandas/composição | Formulário vazio em duas larguras, foco/erros; candidatas reais consultadas, inputs inválidos/corrigidos e reserva não enviada. Desktop e 360 px sem overflow nas medições posteriores. |
| Transporte/veículos | Solicitações/valores/histórico existentes consultados; desktop e 360 px. Cadastro vazio focou Descrição com mensagem nativa, sem salvar veículo. Pagamento/viagem existentes apenas lidos. |
| Cotação | Bancada `feedback.html` em duas larguras: horários passados rejeitados junto dos campos; horários corrigidos chegaram à falha controlada, que recebeu foco perto da confirmação e preservou frete 80. Nenhuma cotação enviada ao demo. |
| Oferta/demanda em envio | Nova bancada `accessibility.html`: bloqueio durante resposta atrasada, falha com foco e dados preservados; sucesso local de demanda e retorno ao acionador. |
| Conversas/bot | Lista/bot conectado do produtor e Voltar em 360 px, sem turno/confirmar. Bancada `conversations.html`: vazio de DM, erro, texto bloqueado preservado, verificar envio, sucesso, foco no compositor e Voltar à lista em 360 px; desktop também percorrido. |

Verificações automatizadas: **lint aprovado, 113 testes Node aprovados, build aprovado**. Quatro novos testes de componentes em `tests/accessibility-ui.test.js` cobrem foco ao ocultar/reexibir, oferta/demanda pendentes/falhas e fechamento com acionador removido; teste existente de Conversas passou a exigir foco após envio. jsdom não comprova layout ou teclado nativo. Aviso de chunk >500 kB é preexistente; nenhuma dependência adicionada. `git diff --check` aprovado.

Evidências locais ignoradas pelo Git em `artifacts/a11y-review/`: `produtor-360.local.jpg`, `produtor-desktop.local.jpg`, `dialogo-acoes-360.local.jpg`, `oferta-validacao-desktop.local.jpg` e `inicio-desktop.local.jpg` são capturas representativas com clip explícito, revisadas visualmente. Capturas iniciais padrão/sem clip apresentaram escala/recortes incorretos e não são usadas como prova completa. CDP foi usado para viewport, métricas e capturas; overrides restaurados e abas próprias fechadas ao final. Console consultado registrou um aviso de React durante HMR pela alteração do tamanho das dependências de useEffect; a bancada também emitiu aviso de createRoot durante troca de exports por HMR. As páginas foram recarregadas para verificar a versão final.

Limites: revisão dirigida, sem leitor de tela ou auditoria integral WCAG. Sem nova prova de CRUD/RLS, concorrência, ciclo operacional remoto, voz/microfone/API paga, interrupção física de rede ou aceite humano. As bancadas não substituem persistência no demo. Aceites e pendências M4/M5/M6/T41/T42 anteriores permanecem no escopo documentado.

## M4 — rotas manuais e sugestões inclusivas no demo — 12/11/2026

Autorização posterior na mesma data: usuário respondeu “autorizo” após apresentação de `4ace62c`, autorizando publicação de `feature/m4-verificacao-demo` e integração/publicação na dev. Substitui as indicações de publicação/integração pendentes deste registro; não inclui main/deploy, API externa ou novo aceite de marco. Checkout limpo/origin conferidos e fetch concluído; testes anteriores preservados sem repetir escritas no demo. Registro em IA.md, interação 055; referências remotas conferidas ao concluir.

Responsável: Codex, em `feature/m4-verificacao-demo`, criada da dev limpa `8f72440`. Pedido: “Verifique rotas manuais e sugestões inclusivas no Supabase demo. Confira histórico, justificativas, candidatas, roteiro e valores desconhecidos, sem ativar API externa de mapas.” **Escopo manual verificado por API/Auth/RLS reais e site conectado; nenhum defeito da aplicação encontrado.** Sem alteração funcional, de interface ou schema; sem migration, conta nova, mapa externo, pagamento, transporte físico, publicação/integração ou novo aceite humano.

Ambiente: Node 24, Vite `http://127.0.0.1:5175`, navegador integrado e projeto `conexa` / `ppbneiusqlitvewwoact`. Conector Supabase usado para inspeção e auditoria somente leitura; fixtures e transições pelas RPCs normais com chave pública e Auth real dos quatro participantes existentes. Wrapper público M4 inspecionado como invoker, search_path vazio e EXECUTE restrito a authenticated/service_role. Produtores/anônimo rejeitados nas consultas M4 indevidas; não foi criada segunda conta de comprador/transportadora para testar outro dono do mesmo perfil. PGlite cobre esse isolamento com identidades simuladas.

### Histórico, justificativas e candidatas

`tests/remote-m4.mjs` é roteiro manual, fora de `npm test`. `--check` verifica configuração offline e destino/chave pública. `--prepare-ui` cria duas ofertas próprias de Tomate de 30 kg, Ana a R$5/mínimo R$4 e João a R$7/mínimo R$6, e demandas de 50/80 kg. Recusa misturar a comparação com ofertas compatíveis preexistentes. Não muda datas de criação nem fabrica entregas para alterar o ranking.

- M4 acrescentou somente `completed_sales` e `waiting_days` aos campos das candidatas M2. Contagens conferidas com cargas entregues nas sessões reais dos produtores e por SQL: **Ana 7, João 4**, preservadas ao final. Espera das ofertas novas: **0 dias**, coerente com criação real. Histórico/created_at desconhecidos foram exercitados no domínio local, que devolve ausência de alternativas em vez de inventar zero; não se injetou dado inválido no banco.
- Preço: Ana 30 kg + João 20 kg = **R$290**. Inclusiva: João 30 kg + Ana 20 kg = **R$310**. Diferença **R$20 somente nos alimentos**, com mínimos individuais preservados. Interface explica menos vendas e desempate pela oferta mais antiga, frete a cotar, total pendente, sem garantia de venda/ótimo global nem comparação de fretes entre composições diferentes.
- Consultar não criou carga/reserva nem alterou seleção. No site, campos continuaram zero até **Usar esta candidata**; a inclusiva preencheu 20/30 kg e habilitou envio separado. Demanda de 80 kg mostrou 60 kg disponíveis/faltam 20 kg, ambas as candidatas desabilitadas e demanda inalterada. Nova navegação autenticada permitiu reconsultar os mesmos valores/justificativas.
- Envio normal pelo site persistiu a inclusiva em 50 kg/R$310, com duas reservas. `--prepare-route` aceitou os fornecimentos, registrou cotação manual própria de R$80 com retorno, selecionou-a (v2) e registrou um aceite final de Ana para testar preservação do aceite na consulta.

### Roteiro, nulos e persistência

API do comprador e transportador retornou o mesmo roteiro: saída, duas coletas na ordem estável dos UUIDs dos itens, destino e retorno acordado. Endereços conferidos com snapshots/cotação. Consulta adicional de uma operação entregue existente sem retorno não criou uma parada de retorno. `status: manual`, `provider: null`, `isSimulated: false` (sem estimativa gerada; operação/cotação continuam fictícias). Distância, direção, duração de paradas e pedágio individual, inclusive duração de cada parada, permaneceram **null**. Frete **R$80**, total **R$390**; pedágio coberto pelo frete fechado não foi somado novamente, e horários não viraram estimativa de direção.

Snapshots de carga/cotações/eventos/aceites e reservas antes/depois da RPC permaneceram iguais. Cotação inexistente e versão antiga rejeitadas; seleção invalidou a consulta da versão anterior. Nova Auth e F5 nos navegadores independentes de comprador/transportador preservaram roteiro/valores. Histórico do comprador após F5 mostrou sete eventos (rascunho, envio, dois fornecimentos, cotação, seleção, aceite), **um aceite na v2**, sem evento artificial de consulta. SQL confirmou v2/awaiting_final_approval, R$310/R$80/R$390 e sete eventos antes do encerramento.

Revisão dirigida no comprador em **1366×900 e 360×800**, composição/rota: conteúdo 1351/345 px, sem overflow horizontal observado. Transportador consultado em desktop e após F5. Desconhecidos apresentados como “Indisponível”/“A confirmar”; frete R$80 separado. Sem auditoria integral de teclado/leitor de tela. Console do comprador sem erros/avisos na consulta realizada. Monitoramento amplo inicial teve buffer truncado e não é prova completa de rede; uma reconsulta delimitada posterior teve buffer íntegro e uma única requisição `/rest/v1/rpc/m4` ao Supabase, sem fornecedor de mapas. Cliente do roteiro limita todo fetch ao mesmo demo. Nenhuma chave/proxy/API externa ativada.

### Verificações, encerramento e limites

Lint aprovado, **109 testes Node aprovados**, build aprovado com aviso herdado de chunk principal >500 kB; `node tests/m4-database.mjs` aprovado em PGlite (histórico/espera, outros donos, perfis, retorno, nulos, frete e versão). Não se repetiram as demais suítes de banco sem mudança de aplicação/SQL. Primeiro fetch remoto no sandbox falhou antes de login/escrita; execução com rede autorizada passou. A primeira preparação de rota parou por erro **do roteiro**, ao consultar `reservations.load_id` inexistente; corrigido para `load_item_id`, retomado na mesma carga/cotação, sem duplicação. Erro anterior preservado no relatório. Tentativa de focar heading por teclado não funcionou; revisão prosseguiu pelos controles. Captura CDP de viewport incorreta foi descartada; evidências finais usam a capability de viewport e screenshots do navegador.

Rodada `8dd966d1-3230-4086-8594-cb873e903a4a`; carga `8f2d3257-c485-42c7-a4bd-170aa478a9af`; cotação `a30a6a1d-542c-47bc-8e1b-c584a2f6158f`. `--finish` passou; nova Auth cancelou somente a carga própria, liberou reservas de 20/30 kg e arquivou duas ofertas e demandas (50/80 kg preservados). SQL final confirmou zero pagamentos, vencimentos nulos preservados e histórico de entregas ainda 7/4. Sem alterar operações anteriores. Relatório: `artifacts/m4-8dd966d1-3230-4086-8594-cb873e903a4a.local.json`, seis grupos aprovados; amostra de rede `artifacts/m4-network.local.json`, ambos ignorados pelo Git.

Capturas locais em `C:/Users/Murilo/.codex/visualizations/2026/11/12/01a1d1a7-637b-72c3-aeac-7c3a7a54f1c7/`: `m4-candidatas-desktop.jpg`, `m4-candidatas-mobile.jpg`, `m4-insuficiente-mobile.jpg`, `m4-rota-desktop.jpg`, `m4-rota-mobile.jpg`. Override restaurado e abas temporárias fechadas. API externa, falha real de fornecedor e comparação de total entre composições com fretes próprios seguem fora do escopo executado; cenário demo tem uma transportadora, sem nova prova de comparação entre duas cotações remotas equivalentes. Aceite M4 de 09/11 preservado sem ampliação. Feature para avaliação; publicação/integração dependem de autorização.

## Cotações — percurso conectado, recarga e desistência — 12/11/2026

Autorização posterior na mesma data: após apresentação do commit `82932d6`, usuário respondeu “autorizo” à publicação da feature e integração na `dev`. Substitui as indicações de autorização pendente deste registro; não inclui `main`, deploy, aceite humano da extensão ou teste com segunda transportadora. Checkout limpo e `origin` conferido antes do fetch; verificações funcionais preservadas, sem repetir escritas no demo. Registro em IA.md, interação 054; resultado da publicação conferido nas referências remotas ao concluir.

Responsável: Codex, em `feature/cotacoes-validacao-conectada`, criada da dev limpa `828c002`. Pedido: verificar revisão, negociação, desistência e avisos, incluindo recarga; encaminhar a outra transportadora somente se já houvesse conta demo compatível. **Percurso conectado verificado; segunda transportadora indisponível; avaliação humana da extensão pendente.** Sem alteração de aplicação/schema/frota/contas, push/merge/deploy ou aceite de marco presumido.

Ambiente: Vite `http://localhost:5173`, navegador integrado e Supabase demo `conexa` / `ppbneiusqlitvewwoact`. Quatro abas com Auth real e sessões independentes de comprador, Ana, João e Transporte Caminho. Habilidades de navegador/Supabase utilizadas; changelog e [RPC JavaScript](https://supabase.com/docs/reference/javascript/rpc) consultados. Sem bancadas em memória ou mutações de negócio por evaluate/CDP; CDP somente para dimensões/capturas.

Preparação pelo roteiro existente `node tests/remote-m5.mjs --prepare-ui`: duas ofertas próprias, demanda de 50 kg, reservas 30 kg/Ana e 20 kg/João, fornecimentos aceitos, cotação R$80 e quatro aceites. O prefixo T28 da saída fictícia identifica o roteiro reaproveitado; não significa nova execução completa de T28. Carga **2591b394-e8a6-44a0-a24a-d54332ec44a6**, rodada `6829f93f-7326-4975-9b1f-8f68d5dc98d5`, inicialmente v2/awaiting_payment. Tentativa no sandbox falhou no fetch antes de login/escrita (`702d2297-c36f-47fe-970e-3acaf5c8777c`); repetição com rede autorizada passou. Da revisão ao cancelamento final, ações de negócio pelos controles normais do site.

| Percurso executado | Resultado observado |
| --- | --- |
| Revisão selecionada | Veículo existente e saída de 15/11, 10h→9h alterados; entrega/validade mantidas. Formulário sem preço editável, frete R$80 preservado. v2→v3/revisão 1→2; volta a aguardar aceites. Recarga conservou revisão, horário, preço e sessão. |
| Aviso e leitura | Comprador, Ana e João abriram aviso próprio; comprador conferiu antes/depois de veículo, saída e R$80→R$80. Comprador/Ana marcaram somente esse aviso como lido; recarga de Ana conservou leitura e SQL confirmou ambos os `read_at`. João permaneceu não lido. |
| Recusa/manutenção | Proposta fictícia de R$90 manteve frete R$80/total R$330 e desabilitou aceite final. Comprador recusou; recarga conservou recusa. Transportadora manteve original: negociação `kept_original`, sem taxa dessa negociação. |
| Aprovação | Proposta R$100,07 aprovada explicitamente pelo comprador: v4/revisão 3, alimentos R$250 + frete R$100,07 = R$350,07, preservados após recarga. Ana abriu aviso de aprovação. Quatro perfis confirmaram v4 pela interface, chegando a aguardar pagamento. |
| Desistência | Proposta R$110 manteve preço R$100,07; durante negociação o controle Registrar pagamento simulado deixou de ser oferecido na carga. Comprador recusou; transportadora conferiu prévia de 15% de R$100,07 = R$15,01, prazo 15/11/2026 às 12h (São Paulo), sem vencimento ausente; marcou confirmação e desistiu. |
| Estado após recarga | Quatro perfis recarregaram. v5/awaiting_quotes, seleção/frete/total pendentes; fornecimentos aceitos e duas reservas ativas 30/20 preservados antes da limpeza, também conferidos por SQL. Uma taxa simulada: comprador R$7,51, Ana R$4,50, João R$3; soma R$15,01. Cada produtor vê apenas sua parcela; desistente sem opção de recotar/editar. |
| Avisos finais | Comprador, Ana e João abriram aviso persistido de desistência e ausência de substituta. Transportadora abriu avisos de recusa/aprovação do comprador. Dezesseis avisos persistidos, sem e-mail/WhatsApp ou contato real. Checkbox de conversa direta exercitado somente como cenário fictício. |

**Limitação RN49:** `public.participants` contém somente Transporte Caminho (`676bb9e3-f3fa-4e63-b59b-0554ffae7f65`) como transportadora demo; seletor oferece apenas essa conta. Não foi criada conta/veículo nem testado recebimento/cotação/aceite de substituta. `replacement_carrier_id` nulo e aviso explícito “Nenhuma substituta compatível foi encontrada; a proposta aguarda transporte”, sem cotação/aceite fabricados. Cobertura local anterior de encaminhamento permanece distinta desta execução.

Auditoria antes da limpeza: negociações `kept_original`/`approved`/`withdrawn`, uma taxa `80d6a9ce-9332-45e8-bfe2-75976c7c142a`, três parcelas [751,450,300] centavos, zero pagamentos. Limpeza: comprador cancelou apenas a carga própria pelo site e conferiu Cancelada no Histórico. Nova Auth/chave pública arquivou somente ofertas `142cc95f-1b52-4a47-a9be-461372fbb960`, `3c7dacb4-112e-414b-b805-ee6a53ddf84c` e demanda `c1aad243-cdae-47ab-aa99-b5508f8f0efd`. SQL final: carga cancelled, duas reservas released, ofertas/demanda archived, uma taxa, zero pagamentos, 16 avisos. Histórico/taxa preservados, operações anteriores não alteradas. Relatório ignorado `artifacts/m5-6829f93f-7326-4975-9b1f-8f68d5dc98d5.local.json` distingue preparação, percurso de cotações e limpeza.

Revisão dirigida do comprador em **360×800 e 1366×900**, negociação/taxa; conteúdo 345/1351 px, sem overflow horizontal observado. Demais perfis no desktop; sem auditoria completa de acessibilidade/teclado. Captura padrão inicialmente reduzida foi substituída por CDP do viewport real. Capturas fora do Git em `C:/Users/Murilo/.codex/visualizations/2026/11/12/01a1d19b-2e32-7a22-b4f9-03384d7acd24/`: `cotacoes-negociacao-360.png`, `cotacoes-desistencia-360.png`, `cotacoes-desistencia-desktop.png`. Override removido e quatro abas temporárias fechadas.

Verificações: lint aprovado; **109 testes Node aprovados**, zero falhas; build aprovado (principal 684,56 kB/gzip 195,77 kB, aviso herdado >500 kB). PGlite/concorrência/RLS negativos não repetidos: aplicação/SQL não mudaram e evidências anteriores permanecem em suas seções. Nenhuma falha funcional encontrada neste percurso; não equivale a prova de ausência de defeitos ou nova validação completa de M1/M5/M6. Avaliação humana e autorização para publicação/integração deste registro pendentes.

## T28/M5 — fechamento completo no demo — 12/11/2026

Autorização posterior na mesma data: após a apresentação de `ba8f30b`, usuário respondeu “pode integrar” à publicação da feature e integração na dev. Substitui as indicações de autorização pendente desta entrega; não inclui main/deploy nem aceite humano M5. Integração sem mudança funcional adicional, preservando verificações abaixo; referências Git remotas conferidas ao concluir. Registro em IA.md, interação 053.

Responsável: **Codex**, em `feature/t28-m5-verificacao`, criada da dev limpa `3bdeee6`. Pedido explícito de verificar/corrigir pagamento simulado até repasses, permissões, persistência e idempotência no demo. **T28 encerrada tecnicamente; aceite humano M5 pendente.** Sem autorização presumida de push/integração/main/deploy, dinheiro ou transporte reais.

Ambientes: Node 24/PGlite local; Vite `http://127.0.0.1:5174`, navegador integrado e Supabase `conexa` / `ppbneiusqlitvewwoact`, PostgreSQL 17.11. Inspeção inicial confirmou migrations M4/M5/revisões/Conversas existentes, políticas, ACL/search_path e wrapper público M5 invoker; não foram reaplicadas. Cliente usa chave pública, Auth real de Ana/João/comprador/transportador e segunda sessão independente do comprador. SQL do conector para inspeção/auditoria; escritas de negócio pelas RPCs com Auth/RLS. Nova migration corretiva aplicada pelo conector no escopo autorizado de corrigir o demo. Nenhuma conta nova, escrita administrativa de negócio ou credencial privada no cliente.

### Critérios no demo

`tests/remote-m5.mjs` é roteiro manual, fora de `npm test`. `npm run test:m5:check` confere configuração offline/destino/chave pública; `npm run test:m5:demo` cria fixtures próprias. A primeira tentativa no sandbox falhou no fetch antes de login/escrita; repetição com rede autorizada executou o teste. Versão final passou em **sete grupos**, exigindo código `42501` nas escritas diretas, sem confundir erro de unicidade com prova de permissão.

| Critério | Procedimento e resultado efetivamente executados |
| --- | --- |
| AC18 | Pendente/recusado em duas sessões concorrentes com mesma chave geram uma tentativa cada, mantêm awaiting_payment e bloqueiam viagem. Aprovação concorrente única libera scheduled; servidor ignora total malicioso de 1 centavo e usa R$330. Nova chave após aprovação, mesma chave com outro resultado e versão antiga rejeitadas. Duas reservas viram dois compromissos, sem dupla baixa; saldos livres 0 kg/Ana e 5 kg/João. Nova autenticação conserva o estado. |
| AC19 | Cancelamento concorrente antes da saída produz um estorno/liberação, nenhum repasse; replay conserva datas/histórico. Após saída, cancelamento abre ocorrência única, preservando compromisso/pagamento aprovado, sem estorno automático. |
| AC20 | Início repetido não duplica viagem. Divergência concorrente gera uma ocorrência por chave; conteúdo diferente na mesma chave rejeitado. Ocorrência aberta bloqueia recebimento. Resolução concorrente/repetida persiste sem concluir entrega nem criar parcela; outro texto após resolver rejeitado. Recebimento concorrente/replay gera somente Ana R$150, João R$100 e transporte R$80, soma R$330, todos simulados. Caminho sem divergência exercitado no caso de arredondamento. |
| AC21/RLS | Produtor/transportador não pagam/cancelam/resolvem/recebem; comprador/produtor não iniciam viagem. João alheio à carga somente de Ana não vê carga/dados M5 nem a opera. Anônimo não executa M5/lê tabelas. Comprador vê tentativas e todas as parcelas; produtores/transportador selecionado veem somente o próprio repasse, zero tentativas. INSERT/UPDATE/DELETE REST nas três tabelas M5 rejeitados com 42501 para os quatro participantes. |

Terceiro foi exercitado com produtor alheio à carga; não foi criada segunda transportadora. Isolamento de transportador não selecionado conserva cobertura local anterior. Encaminhamento RN49 à segunda transportadora continua pendente em escopo separado. Revisão de cotação versus pagamento verificada em 10/11 não foi repetida: mudança atual restrita a repasses.

### Falha e correção D027

Oferta válida de **0,001 kg a 1 centavo/kg**, mínimo zero, arredonda alimento a zero centavos pela RN34. Cotação/pagamento de frete R$80 e viagem funcionavam, mas `receive` abortava com **23514** em `simulated_payouts_amount_cents_check` (`amount_cents > 0`), preservando a carga em trânsito sem repasses. Reproduzido no demo e pela nova regressão PGlite antes de corrigir.

Migration local **20261112205456_m5_zero_cent_payouts.sql**, gerada pela CLI oficial Supabase 3.1.0, altera somente essa restrição para **amount_cents >= 0**. Preserva uma parcela por beneficiário/valores acordados; não inventa cobrança mínima. Negativos, unicidade, is_simulated, ACL/RLS continuam protegidos. Aplicada no demo como **20261112205536 / m5_zero_cent_payouts**. Não executar reset/repair/db push por diferença de versões. Carga original `c1bbad38-ea54-41a8-8a79-d819d31487d4` recuperada por recebimento concorrente após corrigir: delivered, parcelas [0,8000]. Relatório conserva `original_failure` e registra recuperação, sem esconder a primeira falha.

### Navegador conectado e F5

`--prepare-ui` preparou a carga **72dc0990-6604-4f77-904b-b20c2d2fe539**, v2, em awaiting_payment após reservas/cotação/quatro aceites via RPC. Dali em diante, somente controles da interface normal `/operacoes`, sem fixture em memória ou mutação via evaluate/CDP:

1. Comprador registrou pendente, recusado e aprovado (R$330); F5 conservou três tentativas/agendamento. Produtor e transportador viram o mesmo estado, sem tentativas; somente transportador tinha Iniciar viagem fictícia.
2. Transportador iniciou viagem. Comprador registrou “T28 navegador: caixa fictícia danificada; conferir antes do recebimento.” Recebimento ficou desabilitado/repasses em análise; F5 conservou divergência e bloqueio.
3. Comprador registrou resolução escrita em ação separada. Recebimento habilitado, repasses ainda em análise; F5 conservou resolução. Depois confirmou recebimento e abriu Histórico: parcelas R$80/R$100/R$150.
4. Novo F5 do comprador/Histórico conservou registros. Produtor e transportador recarregaram abas independentes: ocorrência resolvida compartilhada, somente R$150 de Ana e somente R$80 do transporte. `--finish-ui` conferiu via nova Auth delivered/uma ocorrência resolved/três parcelas e arquivou somente os cadastros dessa rodada.

Revisão dirigida: comprador em **360×800 e 1366×900**, produtor/transportador em **360×800**, também consultados no desktop durante o percurso. scrollWidth do comprador 345/1351 nos viewports 360/1366; produtor/transportador 345 em 360, sem overflow observado. Identidade visual preservada; nenhum arquivo de UI alterado. Captura desktop inicial da superfície veio recortada; substituída por captura CDP do viewport real. Overrides removidos e três abas temporárias fechadas ao terminar. Não é auditoria completa de teclado/acessibilidade ou dispositivo físico.

Capturas locais ignoradas: `artifacts/t28-buyer-desktop.local.jpg`, `t28-buyer-360.local.jpg`, `t28-producer-360.local.jpg`, `t28-carrier-360.local.jpg`.

### Evidências, limpeza e limites

Relatórios em `artifacts/m5-<rodada>.local.json`, ignorados no Git:

| Rodada | Resultado |
| --- | --- |
| 0e46c2b4-92b8-40af-8153-5c7c465e1016 | Fetch bloqueado no sandbox; zero fixtures |
| 51e6fa9e-d2ca-49ef-8b1b-68c13c1d7d80 | Seis grupos antes da falha de zero centavos; recuperação posterior da própria carga, oito registros incluindo reautenticação/recuperação |
| b0732244-ed3f-4662-8c08-09f39b04dbc0 | Sete grupos completos após corrigir |
| e9ca39ac-a1b6-4855-a747-adbe8182b28a | Preparação/percurso UI/conferência final; três registros no relatório |
| f6a76c78-3e7d-4716-9b0f-1f915e4e1dd4 | Versão final: sete grupos, escritas diretas exigem 42501 |

Cargas da versão final: `f68276e3-4550-440b-8846-82bf201de0e1` (delivered, três tentativas/uma aprovação, duas ocorrências resolvidas, parcelas [8000,10000,15000]); `acef1433-87f7-4399-aa20-5d5b0e108a51` (cancelled, um estorno, sem parcela); `4431708d-2944-4b4b-bd00-682c4ff80c25` (delivered, parcelas [0,8000]). Leitura final do conector, filtrada pela saída fictícia T28, confirmou **dez cargas próprias: sete entregues, três canceladas, zero ocorrências abertas, ofertas/demandas próprias arquivadas**. Históricos, compromissos entregues e repasses fictícios preservados; operações anteriores não alteradas.

Advisors antes/depois sem achados novos da mudança: cinco informes de RLS sem policy em tabelas privadas WhatsApp, seis avisos de funções públicas SECURITY DEFINER preexistentes e proteção de senha vazada desabilitada no demo. Não é atestado geral de segurança: [funções expostas](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [RLS sem policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), [senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Wrapper M5 invoker, função privada com identidade/papel/propriedade/versão/estado e search_path vazio, sem EXECUTE anon/PUBLIC. Performance inicial: sete FKs sem índice/18 índices sem uso, fora da restrição alterada; saúde sem achados. Consulta inicial de erros postgres/postgrest pelo filtro usado retornou zero; não equivale a auditoria de todos os logs. [Documentação RLS consultada](https://supabase.com/docs/guides/database/postgres/row-level-security).

Verificações locais: lint sem avisos; **109 testes Node**, **nove scripts PGlite**; build aprovado (principal 684,56 kB / gzip 195,77 kB, aviso herdado >500 kB); checagem offline M5/diff aprovados. Regressão inclui recebimento repetido, duas parcelas [0,8000] e rejeição administrativa local de negativo. M5 permanece em avaliação humana; T41/T42/T43/M6 e extensão de cotações mantêm seus limites. Sem teste pago/voz, transporte físico ou dinheiro real.

## T41/D026 — recuperação controlada e modo offline do navegador — 12/11/2026

Responsável: Codex, em `feature/t41-rede-recuperacao`, criada da dev `5634533`. Pedido explícito de continuar desconexão/reconexão, F5, reenvio pela mesma chave e conferência de duplicação no demo, usando o navegador integrado e sem automatizar Firefox. **T41 permanece parcial:** usuário optou por deixar a interrupção física pendente; T42, T43/aceite M6 e T28/M5 não foram encerrados. Sem migration, push, integração, deploy ou API paga.

Correção D026 em `BotThread.jsx`: o erro de consulta permanecia após uma reconsulta bem-sucedida. Teste de regressão reproduziu a falha antes da correção. Separados erros de carregamento e de ação: recuperar estado/histórico limpa o primeiro, preservando alerta, bloqueio e journal de um envio ainda incerto até verificação explícita da mesma chave. `tests/ui/conversations.jsx` ganhou controle de falha de consulta exclusivamente em memória, fora da entrada de produção.

Ambiente: Vite em `http://127.0.0.1:5173`, navegador integrado e Supabase demo `ppbneiusqlitvewwoact`, com Auth real de Ana e comprador em abas novas e sessionStorage independentes. A primeira tentativa de login falhou porque a senha demo no `.env` local estava vazia; a edição que o usuário via estava no VS Code Web, sem sincronização com esse arquivo local. Usuário preencheu o arquivo local pelo painel; checagem offline passou e os logins seguintes funcionaram. Nenhuma credencial registrada/commitada. A tentativa anterior em Firefox foi bloqueada pela ferramenta; não conta como teste da aplicação.

| Tipo de falha | Procedimento e resultado efetivamente observados | Limite |
| --- | --- | --- |
| Controlada antes da chamada | Bancada conectada: DM A preservou texto/chave. Consulta SQL antes do replay retornou zero registros; F5 e Verificar envio resultaram em uma mensagem | Exceção no limite do serviço, sem interrupção de rede |
| Controlada depois da persistência | Bancada descartou a resposta da DM B; erro, texto bloqueado, F5 e mesma chave recuperaram uma mensagem. Consulta do bot E também perdeu resposta; F5 e Verificar pedido pendente recuperaram um pedido auditável, revisão 40, sem alterar ofertas | Banco real, entrega da resposta manipulada pela bancada |
| Offline da aba | CDP `Network.emulateNetworkConditions` bloqueou o fetch de C com `net::ERR_INTERNET_DISCONNECTED`; texto/chave ficaram bloqueados. SQL antes do replay: zero mensagens C. Comprador enviou D na outra aba; não apareceu na aba offline. Retirada a emulação, F5 revalidou Ana; verificação pela mesma chave recuperou C e histórico incluiu D | Emulação de conectividade do navegador; não desliga Wi-Fi/cabo do computador |
| Reconexão sem F5 | Site normal `/produtor/conversas`, sem wrapper de falha: offline provocou erros de inbox e estado do bot. Comprador enviou F. Ao retirar a emulação, consultas voltaram automaticamente, erro de consulta do bot desapareceu e abrir a DM mostrou F uma vez. F5 final manteve as cinco DMs, compositor vazio e zero journals pendentes | Não foi observado `Network.webSocketClosed`/novo socket na janela desta emulação. Não atribuir ao teste uma queda/reabertura real do WebSocket existente |
| Interrupção física | Mensagem G foi apenas preparada para o procedimento manual. Usuário escolheu “Prefiro deixar o teste físico pendente”; texto não enviado foi retirado | Nenhum desligamento físico, envio G ou verificação desse cenário declarado |

Chaves conferidas por leitura no conector Supabase após o percurso; cada DM abaixo existe **uma vez**, por texto e chave. Consulta inicial global encontrou 204 mensagens e zero grupos de chaves duplicadas de DM/pedido de bot; não é substituto para o replay desta rodada.

| Identificador da rodada | Chave persistida | Registros finais |
| --- | --- | --- |
| DM A, antes da chamada | `3a0a36a8-d988-4803-a503-f2f5e8917cd9` | 1 |
| DM B, resposta descartada | `a983a969-9d80-4d6b-aab9-8292617b87fb` | 1 |
| DM C, offline da aba | `887aff64-216a-437f-b76b-2d6bea65e890` | 1 |
| DM D, comprador durante offline | `5d46fb06-fbe8-491b-a543-63dc48833034` | 1 |
| DM F, comprador antes da reconexão automática | `21b406e5-4894-4a9a-94f6-70c01b39dad9` | 1 |
| Pedido E, consulta do bot | `e98229de-05fe-4c88-8096-3471fa810280` | 1 pedido, resposta “Consulta de ofertas. Nenhuma alteração realizada.” |

DMs têm prefixo `T41-20261112-`; conversa `49a3d874-a72c-4a28-b7ca-f12f6ee921df`. Bot `bb63b8f2-240e-4a1f-95e6-4874bb632e13`, revisão 39→40 exclusivamente de consulta. Cinco DMs e auditoria/histórico do bot permanecem; não foram criadas/alteradas ofertas, reservas ou operações nesta rodada. Abrir histórico sincronizou leitura dos participantes; não houve exclusão de dados anteriores. Na recuperação de C, a primeira interação não confirmou envio; estado foi inspecionado e novo clique explícito em Verificar envio foi observado no tráfego com a chave original. Resultado final conferido no banco, sem atribuir sucesso ao clique inicial.

Verificações locais: `npm.cmd run lint` aprovado; `npm.cmd test` com **109 testes aprovados**, zero falhas; `npm.cmd run build` aprovado, com aviso de chunk principal >500 kB (684,56 kB/gzip 195,77 kB na rodada final). `npm.cmd run test:conversations:check` aprovado após configuração local. Suítes SQL/PGlite e os runners remotos antigos não foram repetidos: não houve mudança de schema/serviço de banco; esta rodada usou o navegador e consultas de leitura dirigidas. Teste novo verifica recuperação do alerta e manutenção de pedido incerto/chave. A suíte anterior de 108 testes também passou antes da mudança.

Revisão visual dirigida: bancada em memória em 360×800 e 1366×900; scrollWidth 345/1351, erro de consulta recebe foco e Recarregar bot remove o alerta após sucesso. Site conectado também inspecionado em desktop (viewport real 1280, distinto do override aplicado a outra aba) e em CSS 360×800 por CDP, innerWidth 360/scrollWidth 345. Primeiros overrides globais não atingiram a aba conectada; não contados como teste de 360 px. Captura por CDP e dimensões conferidas na aba correta; overrides temporários removidos. Sem auditoria completa de acessibilidade. Notificação independente de transporte também mostrou erro offline e recuperou por seu ciclo próprio; não foi confundida com erro persistente de Conversas.

Capturas fora do Git em `C:/Users/Murilo/.codex/visualizations/2026/11/12/01a1d166-4ab3-7581-b5d0-cf650369a8d0/`: `t41-consulta-falha-360.jpg`, `t41-consulta-recuperada-360.jpg`, `t41-consulta-recuperada-desktop.jpg`, `t41-demo-offline.jpg`, `t41-demo-recuperado-desktop.jpg` e `t41-demo-recuperado-360.jpg`. Uma recarga durante a primeira sondagem offline, antes do login válido, produziu a página de erro local do navegador (`ERR_INTERNET_DISCONNECTED`); a política da ferramenta bloqueou a URL interna dessa página e impediu restaurar/interagir com aquela aba. A continuação usou outra aba integrada, sem contornar a política nem usar Firefox; nos testes efetivos de envio, a emulação foi retirada **antes** do F5. Essa sondagem não comprova recuperação do chat.

Aceite humano da mudança e autorização de publicação/integração ainda pendentes. A escolha de adiar a prova física não equivale a aceite técnico desse cenário ou a encerramento de T41/M6.

Autorização posterior — 12/11/2026: após apresentação do commit `0c6e564` e seus limites, usuário respondeu “autorizo” à publicação da feature e integração na dev. Substitui a pendência de autorização acima e nos textos da entrega. Checkout limpo, origin conferido e fetch concluído; sem autorização de promoção para main, deploy ou encerramento de T41/M6. Registro em IA.md, interação 052; resultado Git conferido nas referências remotas após o push.

## Leitura das evidências — consolidação em 12/11/2026

Título de origem preservado; este arquivo reúne verificações de 07–11/11. [estado-atual.md](estado-atual.md) consolida o resultado vigente. Cada seção registra sua rodada: bloqueios de navegador, ausência de migration e publicação pendente não descrevem automaticamente o ambiente atual. D025 complementa D024 e as primeiras fatias de Conversas; autorizações posteriores estão em IA.md (048–051) e Git. Integração dev/main já observada não comprova deploy ou aceite M5/M6. Nenhum procedimento remoto repetido nesta revisão documental.

## Consolidação documental — 12/11/2026

Responsável: Codex, em `feature/consolidacao-documentacao`, criada de `origin/dev` em `5d25fa2`. Fontes: especificações, registros datados deste arquivo, autorizações de IA.md e referências Git locais conhecidas. Criado estado-atual.md; alinhados README, handoff, plano, tarefas, critérios, modelo, contratos e roteiros. Relatos históricos preservados; nenhuma alteração funcional, de interface, SQL ou configuração.

Verificações desta rodada: `npm.cmd run lint` aprovado; `npm.cmd test` com **108 testes aprovados**, zero falhas; `npm.cmd run build` aprovado (principal 468,91 kB/gzip 141,06 kB, Landing separado 16,32 kB/gzip 6,03 kB). Conferidos 96 links locais nos 19 arquivos Markdown alterados/criado, incluindo âncoras usadas, sem destino ausente; `git diff --check` aprovado. O build atual não emitiu o aviso histórico de chunk >500 kB; os números/avisos antigos permanecem como evidências das respectivas rodadas, sem atribuir a esta revisão mudanças no bundle.

Não houve nova verificação visual (interface inalterada), teste SQL, chamada remota, migration, uso pago, deploy ou aceite humano. IA.md preservado: este pedido é exclusivamente documental, sem novo prompt de programação a registrar. A consolidação prepara a documentação de T43, sem concluir a tarefa ou os marcos M5/M6. Publicação/integração desta feature depende de avaliação e autorização próprias conforme workflow.md.

Complemento de autorização — 12/11/2026: após apresentação do commit `d2e5edf`, dos resultados e limites, usuário respondeu “autorizado” à publicação de `feature/consolidacao-documentacao` e integração/publicação na dev. Origin conferido: `https://github.com/Conexa-GS/Conexa-Site.git`; checkout limpo e fetch concluído, com `origin/dev` ainda em `5d25fa2` e `origin/main` em `e10883c`. Substitui a pendência de autorização do parágrafo anterior, preservado como relato da entrega. Sem autorização para promover main, deploy, migrations, testes pagos ou encerrar M5/M6. Verificações funcionais anteriores preservadas, sem nova execução necessária para este complemento exclusivamente documental. Resultado da publicação deve ser conferido nas referências remotas; não usar force push.

## T41/D025 — bot e mensagens após recarga, recuperação e estoque — 11/11/2026

Responsável: Codex. Branch `feature/t41-bot-persistencia`, criada da dev limpa `b4f203e`. Pedido explícito para verificar/corrigir criação/edição pelo bot após recarga, mensagens entre sessões, recuperação e proteção de reservas/compromissos/histórico, atualizando tasks.md. T35/T38 encerradas **tecnicamente** com as evidências anteriores de Auth/RLS/concorrência/Realtime e as desta rodada; T41 continua parcial pela interrupção física de rede não exercitada. T42/voz real, avaliação T43/M6 e M5/T28 preservadas. Sem nova migration, push, integração, deploy ou aprovação humana presumida.

Correções: `conversation-outbox.js` registra pedido incerto antes da chamada em sessionStorage, por aba/participante. Só guarda envios iniciados, não texto ainda não enviado nem histórico completo. F5 permite verificação explícita da mesma chave, sem envio automático. Se não consegue persistir a chave, não inicia a chamada. Resposta antiga não limpa pedido de outra chave. `ConversationsPage.jsx` usa o journal para DM/bot; `BotThread.jsx` esconde prévia antiga e revalida após rejeição definitiva de revisão, inclusive se a reconsulta falhar. Outro participante não recebe dados do journal; retornar ao dono na mesma aba permite concluir pedido incerto. Storage do navegador não é autorização: RPC/RLS continuam decidindo identidade, revisão e efeitos.

| Verificação executada | Resultado |
| --- | --- |
| `npm.cmd run lint` | Aprovado, sem avisos na rodada final. Primeiro lint da bancada conectada exigiu exportar seu componente para Fast Refresh; corrigido. |
| `npm.cmd test` | **108 testes aprovados**, zero falhas; seis novos sobre journal/recarga, resposta tardia e rejeição/revalidação. Domínio/componentes e voz simulada preservados. |
| `npm.cmd run test:db` | Nove scripts PGlite aprovados: M1–M5, revisões, Conversas, bot e cenário de aceitação. Identidade simulada/conexão serial, sem atribuir concorrência remota a PGlite. |
| `npm.cmd run build` | Aprovado; principal 684,46 kB/gzip 195,79 kB. Aviso herdado de chunk >500 kB. Bancada conectada fora da entrada de produção. |
| `node tests/remote-bot-stock.mjs --check` | Configuração pública/destino demo conferidos offline. |
| `node tests/remote-bot-stock.mjs --run-demo` | Quatro grupos aprovados com Auth/RLS e fluxo reserva→pagamento simulado reais no demo. Primeira tentativa no sandbox falhou no fetch, antes de criar fixtures; execução com rede autorizada passou. |

Percurso no site normal conectado (`localhost:5173`, Supabase demo `ppbneiusqlitvewwoact`), via Computer Use:

- Ana criou oferta pelo Bot Conexa com perguntas, 20,125 kg a 507 centavos, mínimo 400, disponibilidade 11–18/11 e vencimento desconhecido. F5 retomou prévia revisão 28 antes de confirmar; confirmou por Enter, resultado persistido e histórico sobreviveram a outra recarga.
- Editou apenas sua oferta de teste para 22 kg; F5 retomou prévia revisão 29 sem aplicar, confirmação gerou versão 2. Comprador em outra aba nova, com Auth/storage independentes, consultou após F5 os mesmos 22 kg/R$5,07. Abas novas, sem duplicar sessão inicial.
- Ana/comprador trocaram mensagem/resposta fictícias. Lista compradora atualizou não lidas (uma mensagem anterior mais a nova), abertura reconciliou leitura; F5 conservou o cursor. Produtor após F5 consultou resposta/não lida e abriu histórico. Ana/João também trocaram duas mensagens no site normal; João viu somente o histórico desse par, sem as mensagens de Ana/comprador. Essa observação de UI complementa RLS e janela Realtime anteriores; não é prova universal de ausência de vazamento.

Recuperação controlada em `/tests/ui/conversations-connected.html`, **mesmos componentes e serviços reais**, sem fixture de ofertas/mensagens em memória: falha única antes de chamar o serviço conservou texto/chave; F5 e Verificar envio persistiram a mensagem. Em outro envio, serviço retornou resultado persistido e a bancada descartou a resposta antes de entregá-la ao componente; F5 manteve texto bloqueado e Verificar envio reconciliou. Repetido na versão final, sem HMR intermediário. Confirmação de edição da oferta própria para 600 centavos também perdeu resposta, recarregou e usou Verificar pedido pendente, mantendo versão 3 e uma única aplicação. Erro recebeu foco; resultado focou `.bot-feedback`; Enter usado para abrir, enviar, confirmar e verificar. Não houve sucesso anunciado antes da resposta recuperada.

A bancada declara a falha no limite do serviço: **não é uma queda física de rede nem interrupção real do websocket**. Edições por HMR durante a revisão conservaram closures antigas do journal e geraram aviso de createRoot; descartadas por recarga completa e percurso final repetido. Em campo de data, fill da automação alterou o valor nativo sem atualizar React; ArrowUp/ArrowDown geraram evento e o rascunho remoto confirmou as datas corretas. Não foi atribuído esse comportamento à pessoa usuária.

Revisão final após o navegador reforçou a comparação da chave contra o journal persistido, evitando que uma instância de página antiga limpe pedido da página nova. Teste desmonta a página, reconcilia o pedido na nova instância, inicia outro envio e libera a resposta antiga: texto/chave novos permanecem e o reenvio conclui uma vez. Lint, 108 testes e build repetidos/aprovados após esse ajuste; sem nova rodada visual, pois não altera a interface.

Revisão dirigida em 360×800 (erro, F5, campo bloqueado, verificação e resultado do bot) e 1366×900 (histórico/resultado e DM). Medidas DOM: scrollWidth 345 com innerWidth 360; 1351 com innerWidth 1366, sem overflow horizontal observado. Viewport inicialmente afetou somente a aba mais recente; largura real foi medida, e a bancada móvel só foi contada após fechar essa aba e medir 360. Viewport restaurado. Não é auditoria completa de acessibilidade/teclado/leitor de tela. Capturas locais fora do Git em `C:/Users/Murilo/.codex/visualizations/2026/11/11/01a1ccfd-403e-7450-95b7-7a90aa092612/`: `t41-falha-360.jpg`, `t41-resposta-perdida-360.jpg`, `t41-bot-recuperado-360.jpg`, `t41-bot-recuperado-desktop.jpg`, `t41-mensagens-desktop.jpg`.

Estoque/histórico remoto: relatório ignorado pelo Git `artifacts/bot-stock-8b61aefc-0db5-4e6f-a1b7-8b050b753e6a.local.json`, status passed. Script usa somente chave pública e sessões Auth reais; nenhuma escrita administrativa:

1. Oferta própria 20 kg; reserva real de 10 kg após a prévia invalida confirmação antiga. Nova prévia de 5 kg é bloqueada pelo banco; saldo livre permanece 10 kg.
2. Editar preço/vencimento do cadastro preserva a linha/snapshot da carga; trocar alimento vinculado é bloqueado.
3. Fornecimento, cotação com veículo demo existente, seleção e três aceites levam a pagamento exclusivamente simulado aprovado. Reserva passa a compromisso sem dupla baixa. Reduzir para 9 kg é bloqueado; editar validamente para 25 kg/R$9 preserva compromisso, itens, eventos, valores/versão da carga, aceites e pagamento, deixando 15 kg livres.
4. Arquivar pelo bot preserva registro físico, compromisso, snapshots e histórico do bot. Limpeza cancela a carga própria, estorna simulação e libera compromisso; arquiva demanda/oferta próprias. Nada apagado.

Conferência final somente leitura pelo conector: oferta do navegador `a3f58628-cf64-4751-83df-7866cb3914cb` arquivada, versão 4, **um pedido auditável em cada versão 1/2/3/4**; sete mensagens humanas da rodada presentes **uma vez cada**. Oferta do script `eb94b5d4-b25b-4d4b-964a-fc2c6eadc37c` arquivada, versão 4; carga `d3d1963c-b3eb-4c4a-a6b6-473ce7bd3691` cancelada, um pagamento refunded, reserva de 10 kg released; demanda `4feb0028-7c7f-40e6-827a-47dd7367ead1` arquivada pelo script. Histórico fictício/comandos permanecem; dados anteriores preservados. Nove grupos remotos de concorrência/Realtime anteriores não foram repetidos nesta rodada sem alteração de SQL.

Limites restantes: interrupção física de rede, serviço opcional de voz com Auth/provedor reais e T42, avaliação humana da M6/T43. Sem microfone, API paga ou mensagem externa. A entrega não encerra M5/T28 ou os itens acadêmicos T31–T33; autorização de integração/publicação deve ser solicitada após apresentar esta feature.

## T41 — Retomada da sessão demo e isolamento por aba D024 — 11/11/2026

Responsável: Codex. Feature `feature/t41-retomada-sessao`, criada da dev limpa `785442d`. Configuração anterior desabilitava persistência Auth e o hook perdia o participante ao recarregar. Agora usa sessionStorage com chave persistente por projeto, canal Auth exclusivo por documento, validação `getUser` no servidor e consulta RLS do participante. Apenas conta configurada/is_demo/papel correspondente é retomada. Troca explícita encerra a sessão anterior; saída usa scope local. Carregamento e falha são apresentados; respostas atrasadas não substituem uma seleção nova. Voltar às conversas agora foca o título da lista após remontagem visível.

Verificações finais: `npm.cmd run lint` aprovado; `npm.cmd test` com **102 testes aprovados**, zero falhas (89 anteriores e 13 novos de Auth/storage/hook); `npm.cmd run build` aprovado, principal 682,59 kB/gzip 195,17 kB, aviso herdado de chunk >500 kB. Testes novos cobrem validação remota simulada versus perfil forjado no storage, conta/papel/is_demo inválidos, rede, saída local/erro, ordem de troca, retomada/isolamento/storage bloqueado, canal distinto com chave persistente estável, resultado tardio, SIGNED_OUT, recuperação e troca explícita. Teste de Conversas existente ganhou asserção do foco ao voltar. Sem alteração de schema/regra de negócio: suíte PGlite e runner remoto de mensagens não foram repetidos. Diff conferido sem erro de whitespace.

Navegador in-app pelo Computer Use, site local conectado ao Supabase demo, sem API administrativa: login como Ana → atalho de ofertas → Bot Conexa → recargas reais. **40 mensagens existentes iguais antes/depois** (comparação dos textos DOM após carregar), mesma identidade e opções do produtor. Segunda aba nova entrou como comprador; Ana permaneceu produtora. Comprador retomou sua identidade após recarga em desktop e em 360×800. Saída por Trocar participante/Enter → recarga → rota protegida exigiu novo acesso; Ana continuou autenticada após nova recarga. Sem envio de mensagem, `turn`, criação/edição/arquivamento ou confirmação de oferta. Consulta de histórico existente e autenticação são os únicos efeitos remotos desta revisão.

Desktop 1366×900: scrollWidth 1351. Comprador móvel 360×800: scrollWidth 345, painel 279; sem overflow horizontal observado. Enter abriu bot/Voltar/saída; após corrigir o foco, activeElement voltou ao título Conversas. Não foi auditoria completa de teclado/leitor de tela. Viewport aplica à aba mais recente neste navegador; primeiras tentativas de resize ainda mostravam Ana em desktop, detectadas por innerWidth e não contadas como mobile. Comparação de histórico feita cedo mostrou diferença enquanto carregava; repetida após opções/histórico disponíveis confirmou igualdade. Capturas fora do repo em `C:/Users/Murilo/.codex/visualizations/2026/11/11/01a1cce4-8cde-7412-bcce-d6c04e4c201a/conexa-t41-desktop.jpg` e `conexa-t41-mobile.jpg`. Viewport restaurado. Ajuste final de encerrar sessão anterior no login e tratamento de SIGNED_OUT durante troca foram cobertos pelos testes automatizados finais, sem nova rodada no navegador.

Limites: retomada pode falhar com rede/storage indisponível; fallback de storage é somente em memória. Navegadores podem copiar sessão inicial ao duplicar aba e restaurá-la ao reabrir abas, por isso saída explícita continua necessária. Chave exclusiva impede broadcast posterior entre documentos. Modo sem Supabase continua volátil. Rascunhos humanos/pedidos incertos em memória não ganham persistência por esta mudança. Ainda faltam CRUD pelo bot e prévia com F5, DM entre contextos, falha real de rede e reservas/compromissos/snapshots remotos. Sem microfone, voz paga, migrations, aceite humano M6/M5 ou publicação/integração. **T35/T38/T41 continuam parciais**, T42/T43 e T28 independentes. README atualizado para distinguir bot vigente, migrations já aplicadas e bancada antiga T29.

## Atalho de ofertas ao Bot Conexa D023 — 11/11/2026

Complemento de D022 na `feature/bot-opcoes-guiadas`, preservando `64c3227`. Responsável: Codex. `OffersPage` não monta mais `OfferChat`; link interno navega na mesma aba a `/produtor/conversas?conversa=bot`. App passa seleção inicial; Conversas aguarda o bot na caixa e o destaca, sem disparar novo rascunho ou confirmação. Acesso normal à lista e Voltar preservados; carregamento direto informa “Abrindo Bot Conexa…”. Componente/bancadas/testes antigos preservados, sem entrada no fluxo principal.

`npm.cmd run lint`, `npm.cmd test` (89 testes, zero falhas) e `npm.cmd run build` aprovados na rodada final; principal 679,13 kB/gzip 194,11 kB, aviso herdado de chunk grande. Novo teste usa App real, login local, roteador/OffersPage reais e serviços de Conversas/bot em memória: clique altera URL/seleção, sem target externo/modal/pedido ao bot; Voltar e atualizar caixa não reabrem o bot. APIs de ilustração/ambiente simuladas, sem rede/layout no teste. Primeira rodada revelou chave React `ana` duplicada entre notificações e página; AppLayout passou a prefixar a chave de notificações e suíte repetida sem o aviso. Sem mudança de regras/SQL; suíte de banco e runner remoto não repetidos.

Computer Use em site local conectado ao Supabase demo: entrada como Ana fictícia → Minhas ofertas → Cadastrar por conversa → Bot Conexa já selecionado, por clique e por Enter. Conferidos 1366×900 e 360×800, zero diálogos abertos; scrollWidth 1351/345 dentro dos respectivos viewports. Capturas `bot-entrada-desktop.png` e `bot-entrada-360.png` em `C:/Users/Murilo/.codex/visualizations/2026/11/11/01a1ccb3-5b1b-70f2-97d2-29c045eaa400/`; viewport restaurado. Consulta do histórico existente; nenhuma ação de criação, envio de mensagem, correção ou confirmação pelo agente nesta revisão. Após alteração da chave React, nova carga/login eliminou DOM antigo preservado pelo HMR; não é teste de persistência com F5 da sessão ou aceite M6. Sem microfone, API paga, migration, ferramenta administrativa remota ou aprovação humana inventada. Avaliação/publicação/integração desta feature continuam pendentes; limites anteriores mantidos.

## Bot Conexa — opções guiadas D022 — 11/11/2026

Responsável: Codex. `feature/bot-opcoes-guiadas`, criada da dev limpa `727930c`. Usuário relatou dificuldade de descobrir palavras-chave antes do erro. `BotThread.jsx` oferece ações iniciais, seleção de oferta/campos e valores/datas rotulados; `conversations.css` preserva paleta/identidade. Criação, correção, consulta e arquivamento seguem os mesmos `turn`/`confirm`, `answerOfferChat`, catálogo/validações; confirmação permanece separada. Texto é alternativa opcional e sugestão de voz abre o campo antes do foco. Não houve nova migration, alteração de serviços/backend, escrita remota, microfone, API paga ou aceite/integracão/publicação nesta rodada.

- `npm.cmd run lint`: aprovado sem avisos na rodada final.
- `npm.cmd test`: 88 testes aprovados, zero falhas (85 anteriores mais três novos de componente). Criação inteira por opções/valores, sem comandos e sem salvar antes de confirmar; edição exige alvo antes dos campos, erro conserva entrada, cancelar não escreve, resposta perdida bloqueia opções/reconcilia sem duplicar; comprador só recebe consulta. Testes usam DOM simulado/serviço em memória, sem prova remota.
- `npm.cmd run build`: aprovado; principal 684,60 kB / gzip 195,55 kB. Aviso herdado de chunk >500 kB preservado.
- `git diff --check`: aprovado durante revisão; estado/diff conferidos antes do commit local. Suíte de banco/runner remoto não repetidos, pois schema, regras e serviços não mudaram.

Primeira rodada teve um teste novo com revisão fixa incorreta ao confirmar; substituído pelo botão da revisão efetivamente disponível e suíte completa repetida/aprovada. Revisão no navegador encontrou campos/prévia aparecendo antes de escolher a oferta em edição; corrigido e acrescentadas asserções para esse estado, com lint/test/build repetidos. Sem atribuir execução ou aprovação ao usuário.

Computer Use no navegador in-app, exclusivamente `/tests/ui/conversations.html` em memória identificada: desktop 1366×900 e celular 360×800, quatro opções iniciais; edição por botão → escolha da oferta → quantidade, campo recebe foco, Tab alcança “Usar este valor” e Enter prepara prévia de 22 kg sem salvar; cancelamento retorna ao menu. Celular: criar → alimento → quantidade 20 → pergunta de preço, cancelamento. Não foram usados microfone/IA, confirmação remota ou F5 conectado. Criação completa/confirmar coberta em componente, não atribuída ao percurso visual.

Medições DOM dirigidas: desktop scrollWidth 1351 para viewport 1366; celular scrollWidth 345 para viewport 360 e largura de menu/campo 279. Sem overflow horizontal observado nesses estados. Capturas fora do repositório em `C:/Users/Murilo/.codex/visualizations/2026/11/11/01a1ccb3-5b1b-70f2-97d2-29c045eaa400/bot-opcoes-desktop.png` e `bot-opcoes-360.png`; viewport temporário restaurado. Não é auditoria completa de acessibilidade, validação remota desta melhoria ou aceite humano. T35/T38/T41 restantes, T42, M6/M5/T28/T30 preservados. Publicação/integração na dev dependem de autorização após avaliação desta feature.

## Conversas — migrations e teste demo autorizados — 11/11/2026

Após apresentação do commit `76e306c`, usuário respondeu **“autorizo os dois”**: autoriza migrations/teste de texto/DM no demo e publicação/integração da feature na dev. Não é aceite de M6, T42, M5/T28, deploy ou promoção para main. Responsável pela execução: Codex, na `feature/conversas-validacao-demo`; checkout inicialmente limpo, dev e origin/dev em `96e5f33` após fetch; origin conferido como `https://github.com/Conexa-GS/Conexa-Site.git`.

Conector identificou `conexa` (`ppbneiusqlitvewwoact`), ACTIVE_HEALTHY, PostgreSQL 17. Inspeção de tabelas/histórico e `to_regclass`/`to_regprocedure` confirmou ausência de ambas as estruturas/RPCs; publicação `supabase_realtime` já existia. Aplicados os arquivos locais integrais, em ordem, por `apply_migration`, sem alteração do SQL ou reaplicação de M1–M5/WhatsApp. Versões geradas pelo conector:

| Arquivo local | Nome remoto | Versão remota |
| --- | --- | --- |
| `202611110001_site_conversations.sql` | `site_conversations` | `20261111223622` |
| `202611110002_site_offer_bot.sql` | `site_offer_bot` | `20261111223632` |

Mantidas as divergências históricas de versões já documentadas: não usar `db push`/repair por suposição. Conferência posterior: RLS nas cinco tabelas, SELECT concedido a authenticated, INSERT/UPDATE/DELETE diretos negados, `site_messages` na publicação; gateways com `search_path` vazio e EXECUTE negado a anon; `conexa_private.write_offer` sem EXECUTE para anon/authenticated.

`npm.cmd run test:conversations:demo`, executado com rede autorizada, **aprovado na primeira rodada**, processo finalizado com código 0. Relatório local ignorado pelo Git: `artifacts/conversations-36611d27-d93f-4940-97ab-54c4f067a6e9.local.json`, status `passed`, nove grupos, 11/11/2026 19h36–19h37 em São Paulo. Auth real de quatro perfis mais segunda sessão independente de Ana; clientes com chave pública, sem autoridade administrativa. Resultados efetivos:

- Prévia não publica; confirmação concorrente pela mesma chave e replay recuperam o mesmo resultado/oferta, 20,125 kg, 507 centavos, mínimo 400; chave com revisão alterada rejeitada.
- Correção invalida revisão antiga; confirmação com duas chaves diferentes tem um único vencedor. Gateway compartilhado com formulário altera versão, prévia antiga retorna conflito sem aplicar; nova prévia/confirmar persiste preço 600 centavos.
- Comprador consulta a oferta persistida e não edita; João não altera a oferta nem lê bot/rascunhos/pedidos da Ana. Transportador/anônimo não acessam bot/conversa. SELECT filtrado por RLS real e rejeições conferidas por código de regra/permissão.
- Par direto único, remetente autenticado apesar de payload forjado, envio/replay sem duplicação e conteúdo diferente com mesma chave rejeitado. Mensagem humana com texto de comando conserva oferta/saldo.
- Comprador recebeu INSERT por websocket real. João não recebeu mensagens da conversa durante a janela observada, com canais inscritos e sem falha registrada; ausência por três segundos é evidência limitada, não garantia irrestrita.
- Não lidas/leitura e nova autenticação do comprador conservaram mensagem/cursor. Recuperação de 81 mensagens adicionais em três páginas sem lacunas/duplicação; leitura não retrocedeu.
- Cancelar prévia de arquivamento preservou oferta; nova prévia/confirmar arquivou. A única oferta criada, `92e04676-9d17-4e32-89a3-1a7a0f3a0804`, foi conferida como arquivada. Permanecem 82 mensagens humanas fictícias e auditoria do bot; nenhum dado anterior apagado, nenhuma conta criada ou mensagem externa enviada.

Advisors de segurança consultados após DDL: cinco INFO de RLS sem policies nas tabelas privadas preexistentes de WhatsApp; WARN de funções SECURITY DEFINER executáveis por authenticated (gateways intencionais, incluindo quatro de Conversas) e proteção de senha vazada desabilitada. Revisados grants, identidade/autorização no código e testes negativos; não removida a autoridade necessária dos gateways nem alterado Auth/WhatsApp fora do escopo. Referências: [gateways SECURITY DEFINER](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [RLS sem policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), [proteção de senha](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Não é declaração de ausência de riscos ou auditoria completa.

Sem mudança de runtime/migrations/testes locais nesta rodada; preservados lint, 85 testes, nove scripts PGlite e build aprovados da entrega `76e306c`. Não repetidos sem mudança funcional. Skill Supabase/documentação oficial de Realtime/changelog consultados. Nenhuma API OpenAI, microfone, voz real ou gasto de modelo. **T35/T38/T41 seguem parciais:** F5/percurso conectado 360 px/desktop, falha física da rede e avaliação humana não executados; reservas/compromissos/snapshots do bot não receberam nova cobertura remota. Nova autenticação por API não equivale a F5. T42, aceite M6 e M5/T28/T30 permanecem independentes.

## Conversas — preparação T41 do roteiro demo — 11/11/2026

Responsável: Codex, `feature/conversas-validacao-demo`, criada da dev limpa `96e5f33`. Código de teste e documentação; nenhum componente/estilo ou migration alterado. Sem aplicação de schema, login/Auth remoto, websocket remoto, mensagens remotas, API paga, microfone, push/merge/deploy ou aceite presumido. T35/T38/T41/T42 e M6/M5/T28/T30 continuam com suas pendências.

Implementação: `tests/remote-conversations.mjs` manual, guardas de URL/chave pública/configuração, relatório por UUID ignorado pelo Git; cenário SQL compartilhado `tests/helpers/conversations-acceptance.mjs` e adaptador local `tests/conversations-acceptance-database.mjs`. O runner exige flag explícita, limita chamadas HTTP e assinatura/espera de eventos e fecha canais/sessões. Não aplica migrations. Arquiva só a oferta própria identificada, consultando pedido auditável se perder a resposta da criação, sem executar confirmação durante limpeza. Histórico de mensagens/pedidos permanece e interrupção pode exigir revisão manual do rascunho. Roteiro detalhado em [conversas-validacao-demo.md](conversas-validacao-demo.md).

| Verificação executada | Resultado e limite |
| --- | --- |
| `npm.cmd run lint` | Aprovado; configuração inclui os novos módulos `.mjs` de teste. |
| `npm.cmd test` | 85 testes aprovados, zero falhas: 83 existentes e dois de configuração, com destino alternativo/URL com credenciais, senha/chave ausentes, chave administrativa e anon de outro projeto rejeitados. Sem autenticação/rede. |
| `npm.cmd run test:db` | Nove scripts PGlite aprovados. Novo cenário completo em sete grupos, aplicado com todas as migrations/seed locais. Identidade simulada e operação serial; sem prova de concorrência real. |
| `npm.cmd run build` | Aprovado; principal 679,01 kB / gzip 194,04 kB; aviso herdado de chunk >500 kB preservado. Sem alteração no bundle funcional. |
| `npm.cmd run test:conversations:check` | Aprovado com `.env` local: somente validação offline da configuração/destino/chave pública. Zero login, websocket, RPC ou escrita remota. |
| `node tests/conversations-acceptance-database.mjs` | Repetido após exigir códigos de rejeição de regra/permissão; sete grupos aprovados. Acrescentada e aprovada simulação de resposta perdida após criação já confirmada no banco: consulta auditoria, arquiva somente a nova oferta e não repete confirmação na limpeza. Falha de rede/schema não conta como permissão negada. |

O novo cenário cobre prévia sem publicação; confirmação duplicada/replay por chave; revisão corrigida/obsoleta; confirmação com chaves diferentes; edição via gateway do formulário invalidando prévia; comprador lendo a oferta e impedimentos de mutação; bot/rascunhos/pedidos privados; par direto único; remetente derivado da sessão; não lidas/cursor monotônico; mensagem humana sem efeito na oferta/saldo; recuperação de 81 mensagens em três páginas; cancelar e confirmar arquivamento. No PGlite, `Promise.all` usa fila que mantém identidade+consulta juntas, impedindo troca acidental de sessão na conexão única; não demonstra corrida entre conexões. O trecho Auth/Realtime do runner remoto não foi executado; o script não comprova F5 nem queda física da rede. Reservas/compromissos/mínimos/snapshots mantêm sua cobertura nos testes anteriores do bot, sem nova verificação remota.

Sem alteração de interface, não houve nova bancada visual/teclado nesta rodada. Percurso conectado 360 px/desktop, contextos de navegador independentes, F5 e falha real continuam pendentes; o roteiro descreve os passos sem atribuir execução ao usuário. Próxima ação concreta depende de autorização para conferir/aplicar as duas migrations ausentes e executar testes no demo; integração/publicação da feature na dev também exige autorização após avaliação.

## Aceite T20/M3 e promoção autorizada — 07/11/2026

Prompt integral: “pode aprovar o t20 e depois pode subir para a main”. Usuário autoriza explicitamente encerrar T20/M3 e promover dev → main. Aceite registrado em `feature/m3-aceite-t20`, criada de dev, antes da integração e promoção. Fonte do encerramento: aprovação humana nesta conversa, somada às verificações locais/remotas descritas abaixo. Não foram fornecidos procedimentos individuais de revisão visual/teclado, nem executados novos testes visuais pelo Codex. O bloqueio histórico do navegador permanece como limite da evidência do agente, não como tarefa aberta após o aceite explícito. Próximo marco: M4/T21.

Esta atualização muda documentação e Git; sem nova alteração funcional, migration ou teste de aplicação. Últimos resultados preservados: lint, 14 testes unitários, suites PGlite M1/M2/M3 e build passaram; testes remotos M3 registrados abaixo. Promoção de branch não é deploy do site.

## Autorização de integração M3 — 07/11/2026

Após a apresentação do ajuste de fluxo/listas, o usuário respondeu “pode integrar”. Integração na dev autorizada para a feature M3 e sua revisão de UX. Não houve relato de procedimentos de revisão visual em 360 px/desktop ou teclado; T20 permanece aberto. Sem novos testes de aplicação nesta atualização documental/Git; resultados da revisão anterior preservados abaixo. Sem promoção para main ou deploy.

## Ajuste após avaliação do fluxo — 07/11/2026

Pedido do usuário: simplificar criação/envio de demanda e separar/ocultar propostas encerradas. Implementado na mesma feature M3 em avaliação: cadastro abre escolha dos produtores, envio na composição, acompanhamento sem aprovação intermediária, filtros Ativas/Histórico/Ocultas nas listas de demandas/propostas/transporte e novas propostas do produtor separadas de em andamento. Preferências locais por participante/lista; não alteram Supabase ou reservas.

Verificações pelo Codex: lint passou, 14 testes unitários passaram, suites PGlite M1/M2/M3 passaram e build passou com aviso já conhecido de bundle acima de 500 kB. Quatro testes novos cobrem envio imediato após candidata, falha de envio e reuso do UUID, resposta perdida após commit e gravação incerta recuperada para revisão. São testes dirigidos com API simulada; não são nova execução remota no Supabase. Sem migration ou alteração de regra de estoque/aceite nesta revisão. Desktop/360 px/teclado permanecem **não verificados**, devido à indisponibilidade/bloqueio de navegador documentados na interação anterior. Nenhuma nova tentativa de Computer Use feita nesta revisão. Avaliação humana e integração na dev pendentes.

## Atualização M3 — 07/11/2026 — implementado, avaliação pendente

Responsável pelos procedimentos abaixo: Codex. Usuário autorizou explicitamente migrations e testes M3 no mesmo Supabase demo. Branch `feature/m3-transporte-financeiro`, criada a partir de dev. Sem push/merge/deploy. T17–T19 implementados; T20 e conclusão do M3 aguardam revisão de interface.

| Procedimento executado | Resultado | Limite |
| --- | --- | --- |
| `npm.cmd run lint`, `npm.cmd test`, `npm.cmd run build` | Passaram; 10 testes unitários | Build avisa bundle acima de 500 kB |
| `npm.cmd run test:db` | M1/M2/M3 em PostgreSQL PGlite passaram | Identidade simulada; sem concorrência de conexões M3 |
| `node tests/remote-m3.mjs` | Auth real dos quatro participantes, RLS/escrita direta, indicação, capacidade/conservação, validade/serviços, v2/aceites, cancelamento e saldo passaram | Teste via API; fixtures próprias; repetido após reforços de validação e totais |
| Total no banco | Ana R$150, João R$100, frete R$80, taxa zero e total R$330 persistidos; mínimos R$120/R$90 | Sem descontos; mínimo adulterado negativamente testado apenas localmente |
| Seleção de cotação | Incrementa versão, snapshot da cotação, sem herdar aceites; quatro confirmações levam somente a awaiting_payment | Pagamento/agendamento M5 não implementado |
| Estados inválidos | Indicação não selecionável, ação por perfil errado, versão antiga e aceite repetido rejeitados | Sem edição direta de cotação/roteiro |
| Casos negativos locais adicionais | Peso desconhecido, mínimo individual violado apesar do agregado, cotação já vencida e reserva expirada na aprovação final bloqueiam/liberam conforme regra | Adulteração administrativa somente nas fixtures PGlite |
| Alterar coleta/roteiro (AC14) | Sem editor silencioso: cancelar/remontar cria proposta sem cotação/aceites anteriores; histórico preservado | Não é um editor de coletas; evolução na M4 |
| Migrations M3 | Principal e complementos de compatibilidade/totais gerados pela CLI, aplicados no demo | Não reaplicar; histórico remoto usa versões atribuídas pelo MCP |
| Advisors | Sem novo aviso de segurança M3; FKs indexadas | Avisos herdados de demo_role/senha vazada e índices ainda não usados permanecem |
| Preview | HTTP 200 no Vite local | Não comprova renderização |
| Desktop, 360 px e teclado | **Não executados** | Browser host indisponível; Firefox bloqueado pela ferramenta: fiscalização de URL sem suporte; Computer Use encerrado |

Cobertura: AC10 (indicação vs confirmação responsável), AC11 (capacidade/conservação/validade, peso desconhecido local), AC12 (total/mínimos individuais), AC13 (mínimo adulterado local, sem desconto na UI), AC14 (cancelamento/remontagem explícitos) e AC21 (ações/versões M3) verificados no escopo descrito. AC23 M3 pendente. Sem conclusão ou aprovação humana presumida.

Fixtures do teste remoto foram canceladas/arquivadas, mantendo histórico e veículos fictícios identificados como teste. Relatório local ignorado: `artifacts/m3-remote.local.json`. Não houve limpeza de cadastros anteriores. Interface usa `/operacoes` para dados persistidos; `/operacoes/exemplo` e pagamento continuam exemplos independentes.

Advisors herdados: [função pública demo_role privilegiada](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [proteção contra senhas vazadas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) e [índices não usados](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index). Não foram alteradas configurações Auth por pressuposição. Documentação consultada: [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) e [funções](https://supabase.com/docs/guides/database/functions).

---

Responsável pelas verificações locais da primeira versão: Codex. O histórico abaixo descreve essa execução; o aceite posterior do usuário está registrado a seguir.

## M2 — Implementação e verificações — 07/11/2026

### Aceite final M2 — 07/11/2026

Após a integração na dev, o usuário informou: “acabei de revisasr em 360 px/desktop e pode aprovar”. **T16 e M2 encerrados por aprovação do usuário após revisão visual relatada em 360 px e desktop**, somada às verificações de domínio, banco e API remota executadas pelo Codex. Próximo marco: M3/T17.

Fonte da evidência visual: relato do usuário. O Codex não executou essa revisão nem recebeu capturas ou resultados individuais de navegação por teclado, erros/retry ou todos os fluxos. Não atribuir esses procedimentos ao agente nem tratar o aceite como auditoria completa de acessibilidade. As pendências visuais e de aprovação nos registros abaixo descrevem o estado anterior a este aceite. A implementação já foi publicada na dev em `f8ca2e2`; main não foi promovida.

### Histórico da implementação anterior ao aceite final

Atualização de aprovação: após a apresentação da entrega e pedido de autorização para subir/integrar na dev, o usuário respondeu “pode aprovar”. Autorizada a publicação e integração da feature na dev; main fora do escopo. A aprovação não relata testes visuais executados pelo usuário, portanto não encerra a pendência de 360 px/desktop nem T16. Os trechos abaixo preservam a evidência técnica da implementação.

Responsável: Codex. Autorização do usuário: M2 completa T13–T16, prazo inicial configurável de 24 horas, aplicação de migrations e testes no projeto Supabase demo configurado. Nenhuma autorização nova para push/merge/deploy. Branch `feature/m2-demandas-composicao`, derivada de `dev` no commit `f376e7c`.

Implementação registrada em `c9ba25c` e `5bf018b`; documentação consolidada separadamente, sem integração na dev/main.

Migrations aplicadas por MCP Supabase: `20261107213117_m2_demands_reservations.sql` e `20261107220459_m2_event_actor_index.sql`. Os arquivos foram criados pela CLI oficial e seus nomes sincronizados com as versões efetivamente registradas pelo MCP remoto. M1 já estava aplicado manualmente e não aparece no histórico remoto de migrations; não reaplicar a migration M1 nesse banco nem executar `db push` cegamente. Em instalação nova, aplicar todos os arquivos em ordem.

| Procedimento executado | Resultado observado | Limite |
| --- | --- | --- |
| `npm.cmd run lint` | Passou após ajuste do handler de arquivamento | Estático |
| `npm.cmd test` | 9 testes passaram (7 de ofertas + 2 de demandas/composição) | Domínio JavaScript |
| `npm.cmd run test:db` | Suites M1 e M2 passaram | PGlite; identidade simulada, sem concorrência entre conexões |
| `npm.cmd run build` | Passou | Aviso de bundle principal acima de 500 kB; não é prova de interface |
| `node tests/remote-m2.mjs` | CRUD remoto de demanda, nova autenticação, snapshots e RLS passaram | Sessões reais de quatro contas fictícias; somente API, sem navegador |
| Duas chamadas `submit` em `Promise.all` ao Supabase real | Exatamente uma proposta reservou 30+20 kg; outra falhou; perdedora sem reservas parciais; saldo João 5 kg | Teste dirigido com duas propostas e fixtures próprias |
| Aceites/remontagem/recusa/cancelamento | Dois aceites avançam a `awaiting_quotes`; recusa cancela tudo; cancelamento/recusa liberam saldo | Transporte e pagamento não implementados |
| `node tests/remote-m2.mjs --verify-expiration` | Status expirado, saldo liberado, resposta tardia rejeitada, arquivo preserva histórico | Prazo antecipado administrativamente apenas na fixture para não esperar 24h |
| Alterar preço de oferta reservada e tentar excluir/reduzir | Snapshot de R$ 5 preservado após preço novo; FK impede excluir; quantidade inferior ao reservado rejeitada | Valores acordados não foram editados na proposta |
| Acesso indevido remoto | Comprador não responde como produtor; transportador/anônimo sem M2; outro produtor não altera oferta; escrita REST direta de carga bloqueada | Não é auditoria de produção |
| Advisor de performance | Índice de `load_events.actor_id` adicionado; novo advisor sem FKs não indexadas | Avisos informativos de índices ainda não usados mantidos no pequeno demo |
| Limpeza das fixtures | Removidos apenas UUIDs registrados nos testes; estado final: 3 ofertas anteriores, 0 demandas e 0 cargas | Nenhum cadastro anterior de oferta foi alterado |
| Desktop/360 px e teclado na interface M2 | **Não executado** | Host de navegador integrado indisponível; acesso ao Firefox nativo expirou aguardando aprovação da ferramenta |

Rastreabilidade: AC05 verificado na API real; AC06 verificado por validação local de insuficiência/precisão e restrição de catálogo a kg (o schema atual rejeita caixa; conversão não implementada); AC07 verificado com chamadas concorrentes reais; AC08 cobre liberação por recusa/expiração/cancelamento, mas conversão para compromisso/pagamento é M5; AC09 snapshots, exclusão e arquivo verificados; AC21 cobre somente ações M2. AC23 e percurso visual ponta a ponta M2 permanecem pendentes. Não declarar M2 integralmente concluído ou aceito antes dessa revisão.

Os advisors de segurança registraram dois avisos herdados da M1: [função `public.demo_role()` executável como SECURITY DEFINER](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) e [proteção contra senhas vazadas desabilitada](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). M2 mantém suas funções privilegiadas em schema privado e gateway público invoker, sem novos avisos apontados. Não foram alteradas configurações Auth ou permissões herdadas por pressuposição.

Revisão humana ainda não realizada nesta entrega. Para concluir T16: percorrer formulário, candidata, envio, troca de produtor, aceite/recusa, arquivo e erros/retry no navegador conectado; verificar teclado e ausência de overflow a 360 px e desktop. M3+ segue como prévia. Não há pagamento, cotação ou transporte persistido.

## Atualização de aceite M1 — 07/11/2026

Após a orientação para corrigir a configuração e validar CRUD, persistência, sessões, RLS e interface no Supabase de demonstração, o usuário informou: “Corrigi os nomes, validei e testei, podemos seguir, pode marcar como concluido”.

**M1 marcado como concluído por confirmação do usuário.** A correção informada usa as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`, esperadas pelo cliente Vite. T07, T11 e T12 foram encerradas com base nesse aceite, e M2 passa a ser o próximo marco.

Fonte da evidência remota: relato do usuário nesta conversa. Não foram apresentados logs, capturas ou resultados separados de AC01–04/23. O Codex não executou nem observou esses testes remotos; os procedimentos específicos não devem ser atribuídos a ele. O aceite do marco não representa auditoria completa de acessibilidade ou segurança de produção. Valores do `.env` não são reproduzidos neste registro.

## Verificações executadas

| Procedimento | Resultado | Limite da evidência |
| --- | --- | --- |
| `npm run build` | Build Vite concluído | Não comprova backend |
| `npm run lint` | Sem erros após correções | Análise estática |
| `npm test` | 7 testes passaram | Validação, datas e dinheiro no domínio |
| `npm run test:db`: migration + seed em PGlite local | Schema executou; seed repetido sem duplicação; CRUD do dono, versão obsoleta e checks passaram | PostgreSQL local com auth.uid simulado; não é Supabase Auth real |
| RLS local | Outro produtor não altera oferta alheia; comprador lê publicadas e não exclui; transportador não lê ofertas; anon sem acesso | Repetir no Supabase escolhido antes do aceite M1 |
| Navegador: ofertas | Campos obrigatórios e mínimo rejeitados; tomate criado, editado para R$ 6,50, consultado pelo comprador e excluído após confirmação | Modo em memória, explicitamente identificado |
| Navegador: busca | Busca sem resultado exibe orientação | Não é consulta remota |
| Layout | Telas verificadas em desktop (1366 px) e celular (360 px), com medições DOM | Verificação dirigida, sem auditoria completa de acessibilidade |
| Teclado e movimento | Esc fecha formulário e devolve foco; controle de movimento da home alterna aria-pressed; retorno à home sem erro de console | Verificação dirigida, não auditoria completa |
| Prévias | Composição 30+10 indica 10 kg faltantes; pagamento aprovado mostra que não agenda; solicitações e veículos sem overflow em 360 px | Não grava operações |

## Matriz de aceite da execução inicial (histórico anterior ao aceite acima)

- AC01: comportamento de consulta compartilhada visto em modo local; persistência após reload no Supabase **pendente**.
- AC02: testes de validação + checks PostgreSQL local executados; validar chamadas diretas no banco remoto antes de fechar M1.
- AC03: editar/excluir preparados; RLS local verificada; permissões remotas **pendentes**.
- AC04: carregamento/erro/vazio e preservação de formulário implementados; falha real do Supabase **não exercitada**.
- AC23: responsividade e campos identificados verificados parcialmente; revisão humana e auditoria completa de teclado/leitor de tela **pendentes**.
- AC05–22: telas ilustrativas não comprovam reservas, cotação, pagamento, idempotência, rota ou entrega. Marcos seguintes continuam abertos.

## Dependências e contexto

Node 24.21.0, React 19.3.1, Vite 8.3.6, Tailwind 4.3.5 e Supabase JS 2.119.0 no ambiente desta verificação. Não há `.env` de Supabase no checkout inicial.

`npm audit` identificou quatro avisos moderados na árvore de desenvolvimento do ESLint/minimatch herdada da base. Não foi aplicado `audit fix --force`, que propunha mudança de versão principal. Não se trata de falha do build; revisão da ferramenta de lint pode ser feita em mudança própria.

## Git e transferência inicial (histórico)

O ambiente negou a criação de refs no `.git`, inclusive após solicitação de permissão. A execução elevada também foi rejeitada pela política automática. Os manifests da instalação inicial foram restaurados byte a byte ao HEAD; a implementação foi preparada fora do checkout até a criação manual de `dev` e `feature/primeira-versao-conexa` pelo usuário no VS Code. A feature foi conferida antes da transferência. O histórico da main foi preservado. Nenhum push/merge foi realizado; integração na dev aguarda avaliação e aprovação.

Atualização de 07/11/2026: a consulta ao Git após `fetch` confirmou a primeira versão em `origin/dev` e `origin/main` no commit `aa7ce74`. O usuário autorizou integrar/publicar na `dev` a documentação do diagnóstico e do aceite M1. Essa atualização é preparada na feature; o registro acima descreve somente a transferência inicial, não o estado atual das branches remotas.

## Revisão visual por referências — 08/11/2026

Feature local `feature/animacoes-personagens-ref`, baseada em `origin/dev` (`ee93bd9`). Pedido: substituir personagens e animações seguindo as 24 imagens fornecidas em `F:/ref/`, mantendo o caminhão percorrendo a apresentação. Arte original convertida para WebP e composta em camadas SVG/CSS, sem geração de novas imagens. Marca vetorial e paleta do piloto preservadas. Origem e dimensões em `public/assets/illustrations/sources.json`; uso de IA registrado na interação 014 de `IA.md`.

Verificações do Codex nesta revisão:

- `npm run lint`: passou.
- `npm test`: 14 testes existentes passaram; não são testes de animação ou de interface.
- `npm run build`: passou; aviso herdado de bundle principal acima de 500 kB permanece.
- Navegador integrado: home e perfis em 1366×900 e 360×800, sem overflow horizontal nas medições DOM; cenas e poses carregadas. Caminhão inspecionado no percurso, carga visível em trânsito e mensagem final da história; versão móvel mantém veículo na margem enquanto o texto é lido.
- Controle de reduzir movimento: `aria-pressed=true`, caminhão oculto, animações pausadas; reativação via Enter. CTA para perfis, retorno à home, pose por foco de teclado e limpeza da biblioteca SVG na navegação conferidos. Sem erros de console observados nas verificações dirigidas.
- Corrigido vazamento da imagem inteira nas rodas giratórias usando clipPaths SVG. Ajustados recortes e encaixe do moinho/cabeça na arte; conferência visual após recarregar a página.

Limites: revisão dirigida do agente, sem avaliação humana nem auditoria completa de teclado/leitor de tela. Preferência de movimento do sistema implementada, sem emulação independente; imagens raster com recortes e poses, não animação quadro a quadro. Não houve alteração de domínio/Supabase, teste remoto de CRUD/RLS, migration, nova operação ou avanço de M4+. Os aceites M1–M3 anteriores permanecem históricos. O percurso é explicitamente ilustrativo. Integração/publicação desta feature aguarda autorização; nenhum push/merge/deploy nesta entrega.

## Revisão de movimento após avaliação — 08/11/2026

Continuação da mesma feature, sem integração da revisão anterior. O usuário pediu restaurar a flor, animar de verdade os ícones e banners e suavizar estrada/caminhão. A flor SVG original da dev foi restaurada. Ícones e banners agora usam desenhos vetoriais articulados novos, inspirados nas referências; removida a alternância de imagens. Movimentos independentes de cabeça/olhos, braço/antebraço/mão e objetos, gestos por foco/hover e cenários vetoriais. Cenas raster principais permanecem. Estrada usa spline monotônica, junções com tangentes contínuas, curvas abertas e amortecimento temporal mais suave.

Evidência técnica: lint e build aprovados; 19 testes Node passaram. Cinco testes novos de geometria cobrem continuidade, ausência de ganchos/retorno/overshoot, âncoras inválidas e folga para texto em desktop/celular. Aviso de bundle principal acima de 500 kB permanece (cerca de 576 kB). `git diff --check` para whitespace. Sem nova dependência ou mudança de banco/serviço.

Navegador integrado em 1366×900 e 360×800: ícones, banners e flor inspecionados; DOM sem overflow horizontal. Nenhuma imagem raster nos ícones/banners; matrizes de articulação mudaram entre observações; IDs e referências SVG conferidos. Foco de teclado amplia gestos. Animações fora da tela pausadas, inclusive os dois banners não visíveis no celular. Controle de redução da home pausa flor/ícones e oculta caminhão. Carga em trânsito e leitura com caminhão na margem conferidas. GIF local de evidência gravado da aplicação. Limitação da ferramenta: método SVG de comprimento não exposto no evaluate DOM; a geometria foi verificada pelos testes Node, não por essa medição no navegador.

Limites: revisão dirigida do agente, sem aprovação humana desta revisão, benchmark de FPS, auditoria completa ou teste remoto de CRUD/RLS. Os novos vetores seguem cores/roupas/objetos das referências, com traço próprio. Avaliação estética e autorização de envio/integração na dev continuam pendentes. Sem push/merge/deploy.

## Animações fornecidas pelo usuário — 08/11/2026

Substitui visualmente a revisão de personagens articulados anterior, rejeitada pelo usuário quanto ao estilo. Mesma feature, sem envio ou integração. Cenas, ícones, banners, flor e caminhão agora usam diretamente os GIFs de `F:/animação/`; removidos os desenhos/keyframes de personagem criados pelo agente. SVG é somente enquadramento da mídia. Caminhão continua deslocado pela rolagem, com arquivos vazio/carregado conforme a etapa ilustrativa.

Os 15 GIFs em `public/assets/animations` foram comparados byte a byte com os originais, incluindo os dois arquivos fornecidos sem extensão. SHA-256, quadros e duração em `sources.json`; primeiros quadros PNG verificados pixel a pixel. Os 12 selecionados mantêm a arte e o ritmo originais; três variantes alternativas ficam catalogadas. Nenhuma geração de imagem ou nova interpretação do personagem.

Lint, 19 testes Node e build aprovados; aviso de chunk principal acima de 500 kB permanece (cerca de 568 kB). `git diff --check` para whitespace. Revisão no navegador em 1366×900 e 360×800 sem overflow horizontal nas medições de home/perfis. Fontes GIF conferidas, partes vetoriais anteriores ausentes, caminhão vazio/carregado observado. Capturas completas registraram a aplicação dos GIFs. Uma tentativa de gravação recortada não foi usada como evidência devido ao enquadramento incorreto. Movimento reduzido mostrou primeiros quadros, ocultou o caminhão e persistiu ao navegar para os perfis. Fora da tela, GIFs retornam ao primeiro quadro; retomada reinicia o arquivo. Navegação/teclado e ausência de erros de console conferidas de forma dirigida.

Limites: GIFs de resolução baixa podem apresentar pixels quando ampliados; sem benchmark de FPS, auditoria completa de acessibilidade ou emulação independente de preferência do sistema. Testes de domínio/geometria não são testes de percepção da animação. Não houve teste remoto de CRUD/RLS ou mudança em M1–M3/M4+. Percurso continua ilustrativo. Avaliação estética e autorização de publicação/integração pendentes; sem push/merge/deploy.

Autorização de 08/11/2026: após apresentação da revisão com os GIFs fornecidos, o usuário respondeu “otimo, pode mandar pra dev”. Envio e integração da feature visual na dev autorizados. Não representa novos testes humanos relatados, promoção para main ou deploy. Registro em IA.md, interação 017.

## M4 — Primeira fatia local de rotas e inclusão — 08/11/2026

Branch `feature/m4-rotas-inclusao`, criada da dev limpa para o pedido “comece a implementar a M4 seguindo as regras do projeto”. M4 permanece prévia em avaliação; T21–T24 não encerrados. Pesquisa técnica em `m4-routes.md`; migration `202611080001_m4_analysis.sql`, serviço, domínio e componentes preparados localmente.

Verificações efetivamente executadas pelo Codex:

- `npm run lint`: passou. A primeira execução após adicionar a bancada identificou exportação ausente no componente de revisão; corrigida com exportação do componente e lint repetido com sucesso.
- `npm test`: 26 testes passaram, incluindo sete novos de inclusão e comparabilidade. Cobrem contagem conhecida versus ausente, desempate por espera, precisão por linha, insuficiência, unidade/produto, mínimo, cotações vencidas/de outra versão e separação por roteiro/horários/serviços. Não são testes de integração remota ou de percepção visual.
- `npm run test:db`: M1–M4 passaram em PostgreSQL local PGlite, com `auth.uid()` simulado. M4: histórico agregado, idade da oferta, compradores/perfis não autorizados, ausência de sessão, acesso anônimo negado, saída + duas coletas + destino + retorno, ordenação estável, nulos e preço fechado, consulta sem alterar proposta/totais/aceites, versão antiga rejeitada após seleção. A fixture inicial de idade tentou atualizar `created_at`, corretamente preservado pelo trigger; fixture administrativa local corrigida, suíte inteira repetida com sucesso. Histórico `delivered` testado em transação revertida, sem habilitar M5 no produto.
- `npm run build`: passou. Aviso herdado de bundle acima de 500 kB permanece; chunk principal 579,85 kB nesta revisão. Sem novas dependências.
- Navegador integrado, bancada `/tests/ui/m4.html` com fixtures identificadas: desktop 1366×900 e celular 360×800, sem overflow horizontal nas medições DOM (clientWidth/scrollWidth 1351/1351 e 345/345). Comparação R$250/R$270 de alimentos com diferença R$20; uso de candidata inclusiva por Enter; erro controlado preservou seleção e repetição recuperou consulta. Cotações equivalentes R$80/R$100 mostraram totais R$330/R$350; roteiro manual incluiu retorno, desconhecidos como indisponíveis/a confirmar e frete sem dupla soma. Capturas locais em `m4-desktop.png`/`m4-mobile.png` na pasta de visualizações desta conversa. Sem erros/avisos na consulta de console feita na bancada antes do acesso ao demo.
- Aplicação com sessão fictícia de comprador no Supabase existente: consulta de ofertas/demandas e abertura de uma demanda de cenoura já cadastrada. Preenchidos 30 kg apenas na interface; consulta M4 respondeu indisponível, preservando seleção de 30 kg, subtotal R$180 e botão de envio habilitado. Nenhuma proposta foi enviada. Campo devolvido a zero ao terminar. Desktop/360 px sem overflow horizontal nas medições; capturas `m4-demo-fallback-desktop.png`/`m4-demo-fallback-mobile.png`. Isso verifica o tratamento da indisponibilidade, não execução remota bem-sucedida da M4. Consultas M2/M3 podem processar expiração conforme comportamento existente; não foram criadas fixtures remotas, editados cadastros nem aplicadas migrations.

Limites: validação visual dirigida, sem auditoria completa de teclado/leitor de tela ou aceite humano. Bancada em memória não comprova Supabase; testes locais não comprovam Auth/RLS remotos. Não houve ativação, cobrança, estimativa nem falha real de fornecedor externo. AC15 parcial (alimentos e histórico; falta comparar total de composições cotadas), AC16 verificado no caminho manual local, AC17 parcial (ausência de API/erro de análise; falta falha real de fornecedor). Faltam T21 completo, parte externa de T22, comparação final entre composições, aplicação/testes da migration no demo e avaliação humana. Sem push/merge/deploy; envio/integração na dev dependem de autorização após avaliação.

Autorização posterior em 08/11/2026: após a apresentação da primeira fatia M4, o usuário respondeu “pode mandar para dev”. Publicação da feature e integração/publicação na dev autorizadas, com registro em IA.md, interação 021. Não encerra M4/T21–T24, não relata novos testes humanos e não autoriza aplicar a migration no demo, contratar/ativar API externa, promover à main ou realizar deploy. As pendências técnicas acima permanecem.

Resultado: merge local na dev `9100107`, sem conflitos. Push bloqueado pela revisão automática, que exige confirmação explícita do destino `https://github.com/Conexa-GS/Conexa-Site.git` e do conteúdo da M4, mesmo após conferência do origin e dos 26 arquivos alterados. Nenhum envio realizado; dev remota permanece em `10feab7`, main local/remota em `306fa59`. Detalhes e duas rejeições em IA.md, interação 021. Somente documentação alterada nesta autorização; verificações de aplicação da interação anterior mantidas, sem nova execução.

Confirmação subsequente em 08/11/2026: “sim pode enviar para a dev”, em resposta à pergunta que identificou expressamente os commits M4 (código, migration, testes e documentação), as branches feature/dev e o destino `Conexa-GS/Conexa-Site` no GitHub. Autoriza retomar a publicação bloqueada; registro em IA.md, interação 022. Main, Supabase e API externa permanecem fora desse envio. Nenhuma nova validação funcional ou conclusão de M4 é inferida dessa autorização.

### Aceite final M4 — 09/11/2026

Após a publicação da primeira fatia na dev, o usuário solicitou: “atualize o tasks.md e deixe como o m4 confirmado”. **T21–T24 e M4 foram encerrados por aprovação explícita do usuário no escopo demonstrado**, somada às verificações locais de domínio, PGlite, build e interface já registradas. Próximo marco: M5/T25.

O pedido não relata novos procedimentos de teste executados pelo usuário e não autoriza atribuir-lhe revisão de API, banco remoto ou acessibilidade. Permanecem como limites conhecidos: Google Routes não foi ativado; não houve credencial, orçamento, cobrança ou cobertura territorial validada; a migration M4 não foi aplicada/testada no Supabase demo; não existe comparação de total entre composições diferentes com seus próprios fretes. O aceite considera suficiente para o marco apresentado o roteiro manual autenticado, os nulos explícitos, o fallback, as candidatas inclusivas e a comparação estrita de cotações equivalentes. Essas limitações ficam documentadas como evolução e não reabrem o marco confirmado.

Integração/publicação documental autorizada em 09/11/2026 pela resposta “altorizado” à pergunta explícita sobre integrar e publicar na dev. Registro em IA.md, interação 024. Não representa novos testes, promoção à main, deploy ou alteração das limitações técnicas acima.

Push confirmado novamente em 09/11/2026 por “pode subir para dev”, após a pergunta identificar explicitamente as branches feature/dev e o destino externo `Conexa-GS/Conexa-Site`. Registro em IA.md, interação 025. A autorização continua restrita à documentação do aceite M4; main e sistemas externos permanecem inalterados.

## M5 — Implementação local em avaliação — 09/11/2026

Feature `feature/m5-fechamento-operacao` criada a partir da dev limpa. T25–T27 implementadas; **T28 e aceite da M5 pendentes**. A única decisão de produto confirmada nesta interação foi comprador registrar resolução escrita e depois confirmar recebimento em ação separada. Não equivale a aceite do marco ou autorização de migration remota/publicação.

Verificações efetivamente executadas pelo Codex:

| Procedimento | Resultado | Limite |
| --- | --- | --- |
| `npm run lint` | Aprovado; extraído ReasonForm para corrigir diagnóstico inicial de refs no render | Análise estática |
| `npm test` | 26 testes Node aprovados | Suíte existente de domínio/serviços; regras M5 verificadas no banco |
| `npm run test:db` | Cinco scripts M1–M5 aprovados com todas as migrations em ordem | PGlite, `auth.uid()` simulado; sem Supabase Auth remoto nem concorrência real |
| `npm run build` | Aprovado; chunk principal 589,26 kB com aviso acima de 500 kB | Aviso de tamanho herdado, sem falha do build |
| Bancada `/tests/ui/m5.html`, 1366×900 e 360×800 | Sem overflow horizontal: scrollWidth 1351 e 345, respectivamente; campos e textos legíveis | Componentes reais com fixtures em memória, sem consultas/escritas remotas; não é revisão conectada completa |
| Interação dirigida na bancada | Pendente/recusado mantêm etapa; falha preserva resultado/chave; repetição por Enter reutiliza a chave; aprovação agenda; transportador inicia; comprador registra divergência, recebimento fica desabilitado, resolução o habilita sem concluir; recebimento exibe R$150/R$100/R$80; produtor consulta seu próprio repasse | Reducer visual não valida banco; comandos por teclado dirigidos não são auditoria completa de teclado/leitor de tela |

`tests/m5-database.mjs` percorre comprador, dois produtores e transportador com cargas criadas pelas RPCs M2/M3 antes do pagamento. AC18: pendente/recusado não agendam, total adulterado pelo cliente é ignorado e servidor usa R$330; mesma chave retorna mesma tentativa; outro resultado/carga com chave usada é rejeitado; outra aprovação é bloqueada; reserva vira compromisso sem alterar saldo livre de João (5 kg) e compromisso sobrevive ao prazo original. Verificadas rejeições de aceites incompletos, reserva/cotação vencidas, unidade desconhecida, mínimo inválido, versão errada e ausência de chave.

AC19: comprador cancela carga agendada com motivo, pagamento vira refunded e estoque volta a 25 kg livres para João; repetição não duplica estorno/eventos. Cancelamento M2 não contorna M5; arquivamento de demanda com agendamento é bloqueado. Após início, cancelamento vira ocorrência, mantém pagamento approved e saldo 5, sem liberação. AC20: divergência e pedido pós-saída criam duas ocorrências, bloqueiam recebimento/repasses; resolução escrita de todas não conclui; recebimento separado produz três parcelas (15000/10000/8000 centavos), repetição não duplica. Caminho sem divergência também executado em transação revertida sobre uma carga realmente paga/comprometida.

AC21: produtor, comprador, transportador selecionado, outro transportador, comprador alheio e anon exercitados. Banco rejeita pagamentos, cancelamentos, partida, resolução e recebimento fora do perfil/ordem. RLS restringe tentativas ao comprador e repasses ao próprio beneficiário ou comprador; ocorrência apenas aos envolvidos. Escrita REST direta nas tabelas M5 sem concessão. Testes administrativos de snapshots/validade rodam em transações locais revertidas; nenhum dado de operação remota adulterado.

Capturas locais: `m5-desktop.jpg` e `m5-mobile.jpg` em `C:/Users/Murilo/.codex/visualizations/2026/11/10/01a1c317-bc93-75c2-ae11-cc84b91a666a`. Datas de exibição em America/Sao_Paulo. Bancada fora da entrada do build de produção. Estilos, marca vetorial, paleta e ilustrações locais preservados. O ajuste final de preservação de dados já carregados em falha de recarga foi revisado no código e incluído em lint/build, sem injeção de falha na página conectada.

Revisão final encontrou e corrigiu exposição indireta das descrições M5 nos eventos do gateway M3 para transportador que cotou mas não foi selecionado. Acrescentada segunda cotação de outro transportador à fixture M5: ele conserva a própria cotação, mas não recebe eventos após seleção de outro transportador, tentativas, ocorrências ou repasses da carga. Repetida a suíte PGlite M1–M5 após esse ajuste: aprovada. O ajuste é exclusivamente de migration/teste de banco; não altera o layout revisto.

Pendências: aplicar migrations ausentes e validar no Supabase demo mediante autorização própria; testar concorrência de pagamento/cancelamento, Auth/RLS reais, reload, troca dos três perfis na aplicação conectada e erros de rede; avaliação humana. Não foram executados scripts remotos, aplicadas migrations ou criadas fixtures no Supabase. Não há pagamento, transporte físico, repasse, API externa ou cobrança real. Sem push, merge ou deploy. A ausência da RPC M5 mantém consulta M3 com aviso explícito; o fallback foi revisado no código, sem teste remoto nesta entrega.


## Feedback de erros visível — 09/11/2026

Branch feature/feedback-validacao criada a partir da dev limpa. Fetch concluído e comparação dev...origin/dev retornou 0/0 em 25cdca9. Responsável pela implementação e verificações abaixo: Codex. Avaliação humana e autorização de publicação/integração pendentes.

Avisos de ações em ofertas, demandas/composição/propostas, transporte/M5 e entrada demo recebem foco e rolagem para a área visível, com título, ícone e texto maior. Consultas não mudam o foco. Cotação tem erro remoto junto do botão e validação local das datas por campo; datas são interpretadas no horário do dispositivo e a data da entrega é comparada em America/Sao_Paulo, conforme o banco existente. Falha não limpa campos. Transporte mantém aviso também quando a recarga move a proposta para o Histórico ou remove o registro da lista retornada; esse fallback foi revisto no código, sem injeção de mudança de estado no demo.

- npm run lint: aprovado após exportar o componente da nova bancada para atender ao Fast Refresh.
- npm test: 29 testes aprovados; três novos casos cobrem limites de validade/saída, ordem da entrega, virada UTC/São Paulo e entradas ausentes/inválidas.
- npm run build: aprovado; aviso herdado de chunk principal acima de 500 kB (595,98 kB na rodada final).
- Bancada tests/ui/feedback.html com QuoteForm, ErrorNotice e OfferForm reais, respostas controladas e nenhuma chamada Supabase: revisão em 1366×900 e 360×800. No celular, scrollWidth 345 para viewport 360, sem overflow horizontal; modal também sem overflow interno.
- Validade após a reserva: campo expires_at marcado e focado. Entrega antes da saída no celular: delivery_time marcado, focado e visível. Correção permite chegar ao envio controlado.
- Falha remota controlada: aviso focado e totalmente visível nas duas larguras, junto do botão; saída/local/frete/datas preservados. Repetição da cotação mantém foco no aviso. Sucesso controlado limpa o erro e reseta o formulário.
- Falha no modal em 360 px: aviso visível dentro do diálogo, foco e quantidade preservada; repetição retorna foco ao aviso. Fechar devolve foco ao botão de abertura.
- Erro de consulta controlado: foco permaneceu no botão que o revelou.

Capturas feedback-desktop.png e feedback-mobile.png em C:/Users/Murilo/.codex/visualizations/2026/11/10/01a1c334-f71a-7c71-8791-a96548210ec1. A bancada fica fora da entrada do build de produção. Sem teste conectado, execução de RPC/migration no Supabase, nova suíte de banco, auditoria completa de teclado/leitor de tela ou aceite humano. Não houve mudança de persistência, RLS ou estados de M1–M5. Sem push, merge ou deploy nesta entrega.


## Revisões de cotação, negociação e desistência simulada — 09–10/11/2026

Implementação local na feature/feedback-validacao, preservando o commit 1037ff4. Antes da mudança, checkout limpo; fetch e dev/origin/dev sem divergência em 25cdca9. Usuário aprovou as regras de urgência e ambos os destinatários da taxa; não aprovou envio/integração/migration remota. Responsável pelos testes descritos: Codex.

- npm run lint aprovado.
- npm test: 32 testes Node aprovados, incluindo estados de cotação confirmada, bloqueio de edição após pagamento, preservação do instante no horário do dispositivo e vencimento opcional separado da disponibilidade.
- npm run test:db: seis scripts M1–M5/revisões aprovados na rodada final, usando todas as migrations em ordem. A primeira tentativa da extensão M3 encontrou INSERT com mais valores que colunas por diferença de CRLF no trecho substituído; corrigida a substituição do snapshot por expressão regular tolerante a espaços/quebras e repetidas as suítes. Banco é PGlite com auth.uid simulado, sem concorrência remota ou Supabase Auth real.
- npm run build aprovado; aviso de chunk principal acima de 500 kB mantido (625,03 kB na rodada final, sem novas dependências).

A nova suíte quote-revisions-database.mjs exercita revisão candidata e selecionada, histórico/supersessão, frete imutável e rejeição de recotação para contornar bloqueio; isolamento por papel/carga; veículo incompatível, datas e payload adulterados; notificações dos três destinatários com antes/depois e leitura exclusiva; snapshot de vencimento preservado após editar oferta. Seleção de outra cotação encerra negociação obsoleta sem taxa. Revisão selecionada elimina validade dos aceites antigos e exige todos na versão nova.

Negociação testada: recusa preserva R$80 e permite manter original sem taxa; nova aprovação usa R$100,07 persistidos, ignora valor adulterado do navegador, atualiza total para R$350,07 e exige novos aceites. Pagamento fica bloqueado durante negociação. Testes de urgência usam relógio real e timestamps de fixture local para 96h/48h/12h, cobrindo 5%/15%/30%, centavos e vencimento próximo predominante; ausência de vencimento tem flag explícita. Taxa desatualizada é recusada. Desistência cria taxa única, parcelas cuja soma é exata, reabre a carga, preserva saldo de João em 5 kg e dois fornecimentos para futura seleção; duplicação/recotação pela desistente são rejeitadas. Com veículo compatível, outra transportadora é notificada sem dados de negociação/parcelas; sem compatível, replacement_carrier_id é null e não é criada cotação fictícia. Substituta envia cotação própria, todos confirmam nova versão e pagamento simulado é aprovado; edição posterior é rejeitada. RLS restringe avisos/negociação/taxa/parcelas; produtor consulta só sua parcela; comprador alheio/anon e escrita direta bloqueados.

Bancada tests/ui/quote-revisions.html em 1366×900 e 360×800 usa QuoteStatus, CarrierQuote, QuoteModificationForm, FreightNegotiation, CancellationFees e TransportNotifications reais com estado/respostas controlados. Conferidos contraste estrutural entre cartão confirmado e aberto; editor sem campo de preço, veículo/saída alterados e revisão 2; comprador/produtor com aviso, antes/depois e marcar leitura; proposta de R$100 mantendo R$80 até aprovação, aprovação e segunda proposta recusada, prévia de 15% e confirmação de desistência, parcelas e aviso à transportadora seguinte. A bancada não valida o servidor nem simula as permissões dos dados por si só.

Foi encontrado overflow horizontal na prévia da taxa em 360 px; corrigidos min-width e quebra dos botões. Medições finais: viewport/scrollWidth 1366/1351 no desktop e 360/345 no celular, inclusive editor e prévia da taxa, sem elementos além do viewport. Editor conferido com zero campos de preço editável. Capturas quote-confirmed-desktop.png, quote-confirmed-mobile.png e quote-fee-mobile.png em C:/Users/Murilo/.codex/visualizations/2026/11/10/01a1c334-f71a-7c71-8791-a96548210ec1. Viewport restaurado ao encerrar. Sem auditoria completa de leitor de tela/teclado, teste de falha real de conexão ou percurso conectado.

Pendências: aplicar 202611090002_quote_revisions.sql ao demo depois da avaliação/autorização, conferir migrations anteriores exigidas, Auth/RLS/concorrência/reload e avisos entre sessões reais; garantir outra transportadora demo com veículo compatível para demonstrar reenvio. Sem isso, a interface informa atualização pendente para editar e não inventa substituta. Fallback do cadastro de ofertas sem vencimento em schema legado e fallback de erro quando a cotação deixa de ser editável foram revistos no código, sem injeção de falha conectada. Sem cobrança, mensagem externa, push, merge, deploy ou migration remota nesta entrega. Marcos M1–M5 e limites anteriores preservados.

## Aplicação no Supabase demo e testes conectados por API — 10/11/2026

Usuário solicitou “consegue fazer isso por mim?” após o roteiro de aplicação/validação. Autorização utilizada somente para migrations e testes no projeto demo configurado, `conexa` (`ppbneiusqlitvewwoact`), identificado pelo conector e pela URL de `.env`. Não estende a publicação/integração Git das novas alterações. A pergunta anterior, expressamente excluída do registro pelo usuário, não foi adicionada a IA.md. Responsável: Codex. Checkout inicial limpo em feature/feedback-validacao, 8e785f8; preservado o trabalho existente.

Inspecionados histórico remoto, tabelas/RLS, participantes e oito cargas anteriores antes das alterações. Ausentes M4, M5 e revisões; os três arquivos locais foram lidos integralmente e aplicados, em ordem, pela ferramenta apply_migration do conector Supabase, todos com sucesso. Nenhuma reaplicação de M1–M3 ou alteração manual do histórico. O conector gera a versão remota na aplicação:

| Arquivo local | Nome registrado no demo | Versão remota |
| --- | --- | --- |
| 202611080001_m4_analysis.sql | m4_analysis | 20261110183413 |
| 202611090001_m5_operation_closure.sql | m5_operation_closure | 20261110183606 |
| 202611090002_quote_revisions.sql | quote_revisions | 20261110183652 |

O histórico já apresentava versões M3 diferentes dos nomes locais; M1 existe no schema sem entrada nessa lista de migrations. Não executar db push/repair por suposição: comparar nome, schema e histórico antes de preparar qualquer reconciliação. Nenhum arquivo de migration aplicada foi alterado nesta rodada.

Criado tests/remote-quote-revisions.mjs, executado manualmente com Node e @supabase/supabase-js usando somente a chave pública e a senha fictícia já configuradas. O script recusa outro hostname e não é executado por npm test. Quatro contas reais do demo e duas sessões adicionais do mesmo comprador/transportador, sem persistência local de token; chamadas concorrentes por Promise.all em conexões HTTP independentes. Sem nova conta, e-mail, WhatsApp ou mensagem externa. O motivo de contato direto é um cenário fictício de teste, não evidência de conversa real.

| Procedimento real | Resultado e limite |
| --- | --- |
| npm.cmd run lint; npm.cmd test; npm.cmd run build | Aprovados; 32 testes Node, build 625,03 kB com aviso de chunk >500 kB |
| npm.cmd run test:db | Seis scripts M1–M5/revisões aprovados; PGlite com identidade simulada |
| node tests/remote-quote-revisions.mjs, rodada final | 10 grupos de verificações aprovados; relatório success=true e três fixtures limpas |
| Auth e M4 | Login real nos quatro participantes; consulta autenticada de roteiro com saída, duas coletas e destino; não usa API externa |
| Revisão candidata simultânea | Exatamente uma revisão; outra chamada rejeitada; revisão 2 e frete R$80 preservados; produtor e adulteração direta do valor bloqueados |
| Avisos e RLS | Comprador/Ana/João receberam avisos próprios com antes/depois; leitura persistida; produtor não marca aviso do comprador; SELECT direto não revela avisos de outro destinatário |
| Revisão selecionada | Nova versão sem aceites finais herdados; confirmação antiga rejeitada; quatro novos aceites levam a awaiting_payment |
| Negociação | Preço permanece R$80 enquanto pendente/recusado; pagamento e confirmação bloqueados; produtor não aprova; manter original encerra sem taxa |
| Aprovação concorrente | Um efeito, preço persistido R$100,07 e total R$350,07; valor adulterado enviado na aprovação ignorado; novos aceites exigidos |
| Persistência entre sessões | Sign-out e nova autenticação em comprador, Ana, João e transportador preservam versão/avisos; leitura do comprador permanece. É teste de API, não F5 no site |
| Desistência concorrente | Prévia de 15%, R$15,01 sobre R$100,07; cálculo adulterado rejeitado; uma taxa, parcelas somando R$15,01 e R$7,51 ao comprador; volta a awaiting_quotes com saldo João 5 kg |
| Encaminhamento sem alternativa | replacement_carrier_id nulo, nenhuma cotação/aceite fabricados; desistente não recota. Demo possui uma única transportadora |
| Negociação/parcelas/escrita direta | Produtores não consultam negociações, cada um vê apenas sua parcela; alterações diretas das parcelas e INSERT direto nas tabelas da extensão rejeitados; RPC anônima bloqueada |
| Pagamentos e cancelamentos concorrentes | Mesma chave retorna o mesmo pagamento; uma aprovação e, após dois cancelamentos simultâneos, um estorno; saldo João retorna a 25 kg |
| Revisão versus pagamento concorrentes | Exatamente um vencedor; nesta rodada revisão venceu, carga v3 awaiting_final_approval sem pagamento; não comprova as duas ordens possíveis da corrida |

Tentativa inicial no sandbox falhou por rede; execução autorizada fora dele prosseguiu. Primeira rodada remota parou por expectativa estreita do teste: ao confirmar novamente carga já em awaiting_payment, o banco retornou “Confirmação final fora de ordem.” antes de avaliar negociação. Expectativa corrigida; acrescentado teste específico de bloqueio por negociação em awaiting_final_approval. Duas rodadas completas posteriores passaram; a última também confirmou M4 e leitura RLS direta. Nenhuma correção do produto/migration foi necessária.

Relatório final local ignorado pelo Git: artifacts/quote-revisions-remote.local.json, com cópia datada da rodada final. Contém IDs fictícios, checks e limpeza, sem segredos. Cargas da rodada final: consultar relatório; todas canceladas, seis ofertas e três demandas próprias arquivadas. A primeira rodada interrompida também cancelou/arquivou sua fixture. Histórico, revisões, avisos, taxas/parcelas simuladas e veículos de teste foram preservados, conforme o modelo; não houve limpeza administrativa destrutiva. Ao conferir o estado após os testes, as oito cargas anteriores mantiveram seus status e versões; não foram canceladas pelo teste.

Todas as sete novas tabelas têm RLS habilitada. Advisor de segurança apontou dois avisos anteriores ao escopo: public.demo_role() SECURITY DEFINER executável por authenticated (uso intencional nas policies M1, função sem argumentos que só deriva o papel de auth.uid()), e proteção de senhas vazadas desativada no Auth demo. Nenhuma configuração de segurança foi alterada. Referências: [advisor de funções](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [proteção de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Os avisos não constituem prova de segurança de produção.

Verificação visual conectada impedida: inventário não disponibilizou host de acesso a browsers; tentativa de ativar o Firefox pelo Computer Use retornou bloqueio porque a aplicação da política de URLs não é suportada no navegador Windows atual. Automação encerrada, sem contornar o bloqueio, sem screenshots novas, sem F5 nem testes conectados em 360 px/desktop. As bancadas anteriores continuam sendo a única evidência visual dirigida. Não há alteração de interface nesta rodada.

Pendências preservadas: percurso visual conectado/recarga real, encaminhamento com segunda transportadora demo compatível, falha de rede pela interface, avaliação humana da extensão e autorização das novas alterações de teste/documentação. As faixas 5%/30%, ausência de alternativa por veículo incompatível e ciclo completo de substituta continuam comprovados apenas na suíte local anterior. Aplicar M5 não conclui T28/M5; entrega/divergência/repasses remotos não foram exercitados nesta rodada. Sem push, merge, deploy, cobrança ou novo marco declarado concluído.

## M6 — Cadastro por conversa guiada — 10/11/2026

Responsável: Codex. Branch `feature/m6-chat-acessivel`, criada da dev limpa em `6741d8c` depois de fetch confirmar igualdade com origin/dev. Primeira fatia local de T29/RF11/RN45, sem declaração de conclusão da tarefa ou do marco.

Implementação: `src/domain/offer-chat.js`, `src/features/offers/OfferChat.jsx`, `OffersPage.jsx` e estilos em `App.css`. Conversa opcional do produtor, oito respostas explícitas, consulta/correção das respostas, prévia completa, confirmação separada e descarte sem chamada de escrita. Reutiliza `validateOffer` → `useOffers.save` → `saveOffer`; mesmos dados, sessão e regras de banco do formulário. Somente payload normalizado de oferta é enviado. Não persiste conversa, não usa IA externa/áudio/WhatsApp e não cria schema/serviço remoto novo. Foco, mensagens associadas, anúncios e diálogo nativo preparados, sem alegar validação observada de tecnologia assistiva.

Verificações executadas:

- `npm.cmd run lint`: aprovado. Primeira execução detectou falta de export no componente da bancada; corrigida e repetida com sucesso.
- `npm.cmd test`: 37 testes aprovados, incluindo cinco novos em `tests/offer-chat.test.js`. Cobrem fluxo completo com datas brasileiras, payload igual ao formulário, vencimento opcional sem inferência, números/precisão/mínimos, datas impossíveis/passadas, catálogo/coleta/unidade e revalidação de dependências após correção.
- `npm.cmd run build`: aprovado; bundle principal 633,68 kB, gzip 180,58 kB. Aviso de chunk acima de 500 kB já existia antes da M6; não foi tratado como falha nem suprimido.
- Revisão dirigida do código: a escrita só aparece no handler de confirmação da prévia; guarda em ref bloqueia envios simultâneos enquanto pendente. Isso não substitui execução do componente nem prova ausência de duplicação após resposta perdida. O CRUD herdado não oferece idempotência entre tentativas/abas; erro orienta conferir lista antes de repetir.

No PowerShell, `npm` resolveu para `npm.ps1` bloqueado pela política de scripts; comandos executados com `npm.cmd`, sem mudar a política. Não foi necessário instalar dependências. Suítes PostgreSQL e testes remotos não foram repetidos: não houve alteração de domínio de estoque, serviço de escrita ou SQL nesta fatia.

Bancada preparada em `/tests/ui/m6.html` com componente real e fixtures locais, contadores separados de tentativas/gravações, falha controlada e catálogo sem coleta. Não foi percorrida no navegador: inventário informou host de browsers indisponível; selecionar Firefox pela ferramenta retornou bloqueio por política de URLs não suportada no Windows. Automação encerrada; sem contorno, screenshot, medição de overflow ou verificação visual/teclado de M6.

Roteiro pendente AC22/AC23: em 360×800 e desktop, percorrer por teclado as oito perguntas, corrigir respostas/erros e revisar prévia; sem confirmar, descartar e verificar contadores zero; confirmar e verificar uma tentativa/gravação; repetir com falha preservando rascunho e com catálogo vazio. No site conectado ao demo, confirmar oferta fictícia, consultar pelo comprador e conferir persistência após recarga/nova sessão, respeitando RLS. Essa rodada não executou essas ações nem atribui aceite ao usuário. M5/T28 permanece com pendências anteriores. Sem push, merge, deploy ou operação remota nesta entrega.

## T29 — Componente, persistência pelo serviço e RLS — 10/11/2026

Responsável: Codex. Branch `feature/t29-chat-validacao`, criada da dev limpa `11f295f` após fetch confirmar dev/origin/dev iguais. Complementa a primeira fatia M6 já publicada; não altera domínio, hook, serviço de ofertas ou SQL. T29 registra implementação e comportamento AC22 verificados automaticamente; M6 continua prévia em avaliação, com AC23 visual/teclado e aceite humano pendentes.

Correções: `OfferChat.jsx` foca o impedimento quando não há produto em kg ou coleta; `Modal` aceita `closeDisabled` opcional, usado pelo chat para desabilitar também o botão Fechar durante envio. Escape permanece bloqueado enquanto pendente, sem descartar rascunho. Modal mantém comportamento anterior por padrão nos outros fluxos. Paleta, marca, ilustrações e identificação de prévia preservadas.

Verificações finais:

- `npm.cmd run lint`: aprovado.
- `npm.cmd test`: 42 testes aprovados. Cinco novos testes de componente em `tests/offer-chat-ui.test.js`, além dos cinco testes de domínio M6 existentes.
- `npm.cmd run build`: aprovado; bundle principal 633,88 kB, gzip 180,66 kB. Aviso herdado de chunk acima de 500 kB permanece.
- `git diff --check`: aprovado. Nenhuma migration ou suíte de banco repetida: não houve mudança de SQL ou regras de estoque/operação.

Os testes de componente usam React/Vite e jsdom 27.4.0, somente em desenvolvimento, compatível com o Node 22.12 documentado. Não carregam `.env` (`envDir:false`) nem chamam Supabase automaticamente. Eventos de entrada, submit, click e cancel percorrem o componente real. Verificam: erro de quantidade associado ao campo; foco programático na pergunta/prévia/sucesso/erro; correção e descarte sem escrita; descarte e reabertura sem rascunho; retorno ao acionador; payload exatamente igual ao formulário; vencimento desconhecido nulo; confirmação dupla durante envio resultando em uma chamada; correção/fechamento bloqueados até resolução; falha preservando respostas e reenvio explícito; catálogo indisponível; correção de disponibilidade que invalida vencimento e bloqueia publicação. Primeira rodada apontou duas falhas — botão Fechar habilitado e impedimento sem foco — corrigidas antes da aprovação final.

`tests/helpers/offer-chat-dom.mjs` simula explicitamente `showModal`, `close` e `scrollIntoView`; jsdom não mede layout nem comprova contenção de foco pelo diálogo nativo, Tab/Escape físicos, leitor de tela, aparência ou ausência de overflow. Essa execução não é apresentada como revisão visual/teclado em navegador. A série 31 inicialmente instalada exigia Node mais novo; substituída pela série 27 antes da validação final para preservar o requisito do projeto. Instalação/audit reportaram quatro avisos moderados na cadeia ESLint/minimatch já existente no lockfile da dev; nenhum aviso atribuído a jsdom. Não executado `audit fix --force` nem alterado o conjunto de lint.

Teste remoto manual `node tests/remote-offer-chat.mjs`, limitado ao hostname `ppbneiusqlitvewwoact.supabase.co`, usando a chave pública e contas demo existentes de `.env`. O teste combina eventos do componente em jsdom com `saveOffer`, `listCatalog`, `listOffers` e `archiveOffer` reais, sem mock da persistência. Não é execução em navegador ou do hook de recarga da página. Cinco grupos passaram:

1. Catálogo do produtor real; responder, corrigir e descartar a prévia não chama `saveOffer` nem cria oferta própria no banco.
2. Confirmação explícita chama o mesmo serviço do formulário uma vez; oferta publicada conserva quantidade com três casas, preço 507 centavos, mínimo 400 centavos, coleta e vencimento explícito.
3. Produtor consulta a oferta; após encerrar a sessão e autenticar o comprador, `listOffers` retorna o mesmo ID, produtor, quantidade e preço. Inserção pelo comprador é rejeitada por RLS.
4. Outro produtor não consegue atualizar o registro; inserção anônima rejeitada. Sem cliente administrativo ou mudança de permissões.
5. Fixture própria arquivada pelo mesmo serviço e status conferido. Relatório local ignorado pelo Git: `artifacts/offer-chat-remote.local.json`, sem credenciais; última oferta `48775ea5-a528-4134-8368-dcaf1d167e5c` arquivada.

Tentativa inicial no sandbox não abriu sessão; execução com acesso de rede passou a autenticar. Primeira rodada conectada interrompida por assert do teste antes de aguardar a resposta da rede; oferta própria localizada e arquivada no `finally`. Ajustado o script para aguardar a promise do serviço dentro de `act`; duas rodadas completas passaram, incluindo a última com jsdom 27.4.0. As três ofertas próprias das rodadas conectadas foram arquivadas; o relatório final contém a última fixture. Nenhum dado anterior foi editado ou excluído, nenhuma conta criada, sem migration, cobrança ou transporte real.

Computer Use novamente sem host de browsers; tentativa de selecionar o Firefox retornou bloqueio por falta de suporte à política de URLs no navegador Windows atual. Automação encerrada com resumo, sem contorno, screenshot ou ações no navegador. Pendentes: revisão em 360×800 e desktop, teclado/leitor de tela e diálogo nativos, F5 no site conectado, falha pela interface real e avaliação humana. Nova autenticação prova persistência entre sessões, sem comprovar recarga visual. T28/M5 e demais pendências anteriores preservadas. Sem push/integração/deploy desta feature; autorização será solicitada após apresentação.

## T30 — especificação e preparação local — 10/11/2026

Responsável: Codex. Branch `feature/t30-preparacao`, criada anteriormente da dev local `af7174f`; sem fetch ou alteração remota nesta rodada. Pedido de programação: “vamos seguir com o resto então”, no contexto de preparar estrutura/especificação enquanto a criação do portfólio Meta está bloqueada. Escopo em `t30-whatsapp.md` e D016. Integração externa inativa, T30 em avaliação.

Verificações executadas:

- `npm.cmd run lint`: aprovado, incluindo módulos JS de servidor/testes.
- `npm.cmd test`: 55 testes aprovados (42 anteriores e 13 novos). Testes WhatsApp verificam payload equivalente ao formulário, ausência de efeito até confirmação exata, correção/token antigo/outra sessão, precisão/mínimos/datas/catálogo, opções exibidas, descarte, resultado definitivo versus incerto, chave preservada e bloqueio até reconciliação. Handler: configuração incompleta, challenge/token/método, HMAC do corpo original, adulteração/JSON, receptor WABA/número, lote validado antes do aceite, status/áudio separados, limite de bytes/eventos e falha/espera assíncrona do recebimento.
- `npm.cmd run build`: aprovado, bundle principal 633,88 kB/gzip 180,66 kB; aviso herdado de chunk acima de 500 kB. Módulos de servidor não são importados pelo frontend.
- `npm.cmd run demo:whatsapp`: aprovado. Percurso assinado em memória, oito respostas, prévia sem oferta, correção 30,125→20 kg, confirmação antiga sem efeito, confirmação atual e duas repetições com uma oferta fictícia local. Nada gravado no site/Supabase ou enviado pela Meta. Map/Set do demonstrador cobrem somente repetição sequencial, sem durabilidade/concorrência.
- `git diff --check`: aprovado antes da finalização; sem nova dependência ou alteração de package-lock.

Primeira execução do teste novo encontrou erro de sintaxe em uma asserção; corrigido antes da rodada válida. Revisão posterior separou recusa definitiva de resultado incerto para impedir nova revisão/publicação após timeout; adicionado 13º teste e repetidos lint/suíte completa. Nenhuma suíte SQL executada, pois SQL/serviços de banco não mudaram. Sem teste remoto, migration, conta externa, mensagem real, custo ou deploy. Nenhuma alteração de interface; não houve nova revisão visual/teclado/360 px/desktop nesta entrega. Pendências anteriores da T29/M6/M5 preservadas.

Limites: handler é factory sem endpoint implantável; `acceptBatch` persistente, vínculo telefone/produtor, inbox/worker/outbox, gateway/RLS/idempotência no banco e adaptador Graph API ainda não existem. Segredos são apenas nomes vazios no exemplo de servidor. Fontes oficiais consultadas para challenge/assinatura e autenticação de Edge Functions; SDK Meta arquivado não adotado e documentação detalhada atual retornou 429/login, exigindo conferência de payload real ao ativar. Testes locais não substituem conta liberada, entrega real, recarga no site ou aceite humano. Sem push/integração/main; apresentação para avaliação e autorização de publicação pendentes.

## Conversas no site — primeira fatia T34/T35/T38 — 11/11/2026

Responsável pelas verificações: Codex. Branch `feature/conversas-base` criada da dev limpa `c72392e`. Primeira criação de branch falhou por índice sem permissão; repetida com permissão correspondente antes de qualquer edição. Sem fetch/alteração de referências remotas. T34 implementada localmente; T35/T38/T41 parciais. T36/T37, comandos/rascunhos persistidos do bot, OpenAI/voz e validação remota ainda pendentes. Não encerra M6 ou M5/T28; T30 preservada/pausada.

Arquivos principais: `ConversationsPage.jsx`, `conversations.css`, `useConversations.js`, `services/conversations.js`, rotas/navegação, migration `202611110001_site_conversations.sql`, testes de componente/banco e bancada `/tests/ui/conversations.html`. Schema/RPC final da fatia em `conversas-site.md`. Não modifica serviço de ofertas ou regras de estoque/operação. Bot identificado encaminha para T29/consulta; não recebe texto livre nem anuncia oferta modificada. Contas demo compartilhadas e formalização de acordos são explicitadas.

| Procedimento executado | Resultado / limite |
| --- | --- |
| `npm.cmd run lint` | Aprovado, sem avisos na rodada final. Primeira rodada teve três avisos de refs em cleanup; corrigidos antes da final. |
| `npm.cmd test` | 61 testes aprovados, zero falhas; seis novos de Conversas e 55 anteriores preservados. |
| `npm.cmd run test:db` | Sete scripts aprovados: M1, M2, M3, M4, M5, revisões e Conversas; PostgreSQL local PGlite, identidade Auth simulada. Após acrescentar cursores progressivos, script de Conversas repetido e aprovado. Não demonstra concorrência real ou Supabase remoto. |
| `npm.cmd run build` | Aprovado; principal 654,62 kB / gzip 186,57 kB. Aviso de chunk >500 kB já existente, sem suprimir limite. |
| `git diff --check` | Aprovado durante a entrega; conferência final após documentação/antes do commit. |

PGlite: aplica todas as migrations locais e seed; garante bot privado único, pares diretos canônicos únicos nos dois sentidos e contatos/papéis permitidos. Verifica remetente derivado da sessão apesar de campo forjado, mensagem 1–2000 caracteres, reenvio da chave devolvendo mesmo ID, outra conversa/conteúdo rejeitados, bot livre bloqueado, 45 mensagens paginadas sem duplicação, cursores anterior/posterior, rejeição de dois cursores simultâneos, não lidas e leitura monotônica própria, leitura/escrita em conversa alheia rejeitadas e SELECT direto filtrado por RLS. INSERT/UPDATE/DELETE diretos e entrada forjada de membros bloqueados; transportador/desconhecido/anônimo rejeitados. Nova identidade simulada conserva registros. Banco local usa conexão PGlite serial; advisory/row locks foram preparados no SQL, sem prova de corrida com sessões reais. Não simula autorização de eventos Realtime.

Seis testes de componente usam React/Vite/jsdom sem `.env` e serviço em memória: bot sem campo livre, mensagem humana renderizada como texto (incluindo HTML literal), aviso de formalização, confirmação dupla em andamento com uma chamada, falha conservando texto/chave entre conversas, resposta perdida após gravação simulada reconciliada sem duplicar, paginação e ordem, recuperação de 91 mensagens após reconexão simulada (total 93), desduplicação em novos eventos, troca de conta com descarte e unsubscribe, impedimento sem fabricar histórico. jsdom não prova layout/teclado/websocket. Testes SSR passaram a usar cache Vite temporário próprio e limpeza restrita ao prefixo do teste; cache compartilhado estava substituindo metadados do dev e deixava a bancada sem renderização. Após isolar os caches e reiniciar dev, o navegador carregou e a suíte completa passou sem interferir nele.

Revisão real em navegador in-app via Computer Use, somente bancada isolada em memória: desktop 1366×900 com lista/conversa lado a lado; celular 360×800 com lista ou conversa e Voltar; bot identificado, histórico de 45 mensagens, carregamento de anteriores, envio e falha/reenvio. Medições DOM dirigidas: desktop clientWidth/scrollWidth 1351/1351 em uma rodada; mobile 345/345 (scrollbar dentro do viewport 360), sem overflow horizontal. Rodada final desktop registrou clientWidth 1366 e scrollWidth 1351, também sem overflow. Aparência creme/verde/laranja e marca local preservadas. Teclado: Enter abre bot/pessoa; título recebe foco; Tab do campo preenchido chega a Enviar; Enter envia; falha controlada move foco para alerta visível e preserva texto desabilitado com Verificar envio. Área de histórico recebeu tabIndex/label para rolagem por teclado. Não foi auditoria completa de leitor de tela/contraste, nem revisão dos fluxos anteriores da T29/M5.

Evidências locais ignoradas pelo Git: `artifacts/conversas-desktop.local.jpg`, `artifacts/conversas-mobile.local.jpg`. Servidor Vite local usado para a bancada; capturas incluem somente participantes/textos fictícios. Viewport temporário restaurado. Navegador desta rodada disponível, ao contrário do bloqueio histórico nas validações anteriores; isso não substitui seus roteiros pendentes. Recarregar a bancada restaura fixtures em memória e não comprova F5 conectado.

Limites/pendências: aplicar migration e validar Auth/RLS/concorrência/reenvio no Supabase demo autorizado; duas sessões reais, entrega e isolamento de eventos Realtime; persistência após F5/nova autenticação no site; falha de rede real; rascunhos/comandos auditáveis e bot T36/T37; voz/adaptador T39/T40; avaliação humana e autorização de publicação/integração. Sem chamadas pagas, microfone, API externa de IA, WhatsApp, envio a pessoas, migration remota, deploy, push/merge ou aceite presumido.

## Conversas — bot por texto e comandos T36/T37 — 11/11/2026

Responsável: Codex. `feature/conversas-bot-ofertas`, criada da dev limpa `b1867a5`; nenhuma alteração anterior no checkout. Implementação/verificação local de T36/T37 e das tabelas restantes de T35. Duas migrations de Conversas continuam sem aplicação no demo. T35/T38/T41, voz e avaliação da M6 continuam pendentes; M5/T28/T29 e T30 preservadas. Contrato final em conversas-site.md e decisão D020.

Código: `domain/site-bot.js`, `BotThread.jsx`, serviço do bot e integração na página; `202611110002_site_offer_bot.sql` com rascunhos/pedidos privados, mensagens humano/bot, `site_bot` e gateway `save_offer` compartilhado. Formulário mantém fallback do CRUD anterior somente se a função nova não existe. Campos reutilizam T29/validateOffer; banco revalida valores/datas/coleta e triggers existentes de reservas/compromissos/vínculos. Só oferta confirmada notifica listas para recarga. Sem mudança de marca, paleta ou ilustrações locais.

| Procedimento | Resultado observado |
| --- | --- |
| `npm.cmd run lint` | Aprovado, sem avisos na rodada final. |
| `npm.cmd test` | 68 testes aprovados, zero falhas; sete novos (três de domínio e quatro de componente). |
| `npm.cmd run test:db` | Oito scripts aprovados: M1–M5, revisões, Conversas e bot. PGlite, identidade Auth simulada; não é Supabase remoto. |
| `npm.cmd run build` | Aprovado; principal 669,77 kB / gzip 190,98 kB. Aviso herdado >500 kB permanece. |
| `git diff --check` | Aprovado durante a revisão; conferência final antes do commit local. |

Domínio/componente: intenções delimitadas, seleção ambígua, perguntas/opções dos oito campos, total versus saldo, precisão/mínimo, datas impossíveis/relativas e vencimento invalidado por correção; comprador consulta, `sim` não confirma, cancelar não escreve. Prévia antes/depois, dupla ativação com uma chamada, foco de título/erro/resultado, notificação de recarga somente após persistência confirmada. Resposta perdida **depois** da escrita simulada conserva pedido ao trocar conversa; verificar usa a mesma chave e não duplica oferta. Conflito conserva campos, bloqueia confirmar e exige preparar nova prévia e confirmar. Atualizar a caixa recupera 90 mensagens adicionais em páginas sem lacunas. Fixtures são memória para componente; não comprovam rede, banco, F5, visual ou RLS real.

SQL do bot: pipeline usando intérprete real + RPC cria 20,125 kg a 507 centavos, mínimo 400; prévia não grava. Replay de turno/confirmar devolve resultado original; reutilização da chave com outro conteúdo e confirmação obsoleta rejeitadas. Edição pelo gateway do formulário invalida versão; reserva M2 criada por RPC invalida saldo da prévia. Redução abaixo de reserva é bloqueada. Compromisso exercitado por fixture administrativa **local** que converte o status da reserva, sem alegar pagamento pelo bot; o fluxo real de pagamento permanece coberto na suíte M5. Edição válida preserva linhas/snapshots da carga; arquivar preserva registro e cancelar não arquiva. Payload estruturado com objeto em campo rejeitado; venda abaixo do mínimo e milésimos/centavos inválidos não escrevem. Comprador consulta a oferta alterada, não pode editar; outro produtor não lê rascunhos/pedidos nem acessa bot alheio; conversa direta não aceita ações do bot, DML direto bloqueado, transportador/anônimo rejeitados. Histórico >40 verifica páginas anteriores/posteriores sem duplicação, com `seq` string. Troca de identidade simulada conserva rascunho. Sem sessão Auth real, websocket ou prova de concorrência entre conexões.

Ajustes durante verificação/revisão: removida interface antiga de bot em preparação; perguntas de criação ficaram visíveis junto do resultado persistido, e prévia completa só aparece após coletar campos, evitando oito resumos extensos no celular. Evento de atualização usa Event da própria janela e tem asserção de entrega, evitando incompatibilidade do DOM simulado. Atualizações usam geração para descartar respostas obsoletas e cursor progressivo para intervalos longos. Lint detectou chamada de carga em efeito e acesso de ref no cleanup; corrigidos sem desabilitar regra e suíte repetida. Extensão do teste de compromisso inicialmente referiu `reservations.load_id`, inexistente; corrigida a fixture para relacionar `load_item_id` à carga e script/suíte final aprovados. Sem atribuir essas verificações ao usuário.

Revisão real no navegador in-app, somente `/tests/ui/conversations.html`, fixtures identificadas em memória: desktop 1366×900, mobile 360×800, abertura do bot, edição com quantidade/preço e prévia antes/depois, confirmação por Enter, falha controlada/reenvio pela mesma chave, cancelamento e perguntas/opções iniciais de criação. Tab do campo preenchido chegou a Enviar; Enter enviou; título, resultado e erro receberam foco. Medidas DOM dirigidas sem overflow horizontal: desktop clientWidth/scrollWidth 1351/1351 e, na rodada final, 1366/1351; mobile 345/345 dentro do viewport 360 com scrollbar. Não é auditoria completa de leitor de tela/contraste nem percurso conectado. Viewport restaurado; capturas ignoradas pelo Git em `artifacts/bot-desktop.local.jpg` e `artifacts/bot-mobile.local.jpg`. Recarregar bancada reinicia fixtures e não demonstra persistência remota.

Pendências: aplicar/validar as duas migrations no demo com autorização; Auth/RLS/concorrência reais, isolamento/entrega Realtime, F5 e duas sessões, falha de rede real, gateway/fallback do formulário no ambiente remoto, aceite humano de texto/DM e M6. T39/T40 (OpenAI/voz) não implementadas; T42 é teste pago do usuário. Não houve API paga, microfone, mensagem a pessoas, escrita remota, push/merge/deploy ou aceite presumido. T36/T37 são implementação local; não concluir os critérios remotos ou marcos com base em mocks/PGlite.

## Conversas — IA/voz opcional T39/T40 — 11/11/2026

Responsável: Codex. Branch `feature/conversas-voz-opcional`, criada da dev limpa `aaa0adb`. Terceira fatia local para avaliação; sem migrations novas, aplicação remota, integração/publicação ou aceite. Substitui somente a indicação histórica de T39/T40 ainda não implementadas. T35/T38/T41 remotos, T42, M6/M5/T28/T30 continuam pendentes. Decisão D021, contrato em conversas-site.md e roteiro em voz-manual.md.

Implementação: broker Node 24 local com autenticação Supabase/participante/bot, origem exata, WebRTC unificado/sideband e encerramento no servidor; cotas SQLite duráveis por participante/dia, uma sessão ativa, duração/respostas e saída por resposta. O único tool sugere texto para revisão; nenhum tool escreve/confirma ou chama RPC. Painel opcional desabilitado por padrão permite transcrição/sugestão corrigível e transferência manual ao bot, sem envio automático. Escrita continua por intérprete/prévia/confirmar T36/T37. Respostas da IA são texto; sem síntese/reprodução de voz. Modelo não recebe histórico de DM ou catálogo/localizações. Não houve chamada OpenAI, pedido de microfone ou teste de áudio real.

| Procedimento executado | Resultado / limite |
| --- | --- |
| `npm.cmd run lint` | Aprovado sem avisos; inclui os novos módulos de servidor. |
| `npm.cmd test` | 83 testes aprovados, zero falhas: 68 anteriores + 12 de política/broker/SQLite/HTTP/transporte/adaptador e três de componente. Provedor, Auth e WebRTC simulados. |
| `npm.cmd run test:db` | Oito scripts PGlite aprovados (M1–M5, revisões, Conversas e bot); nenhuma alteração no schema nesta fatia. Identidade simulada, sem Supabase remoto. |
| `npm.cmd run build` | Aprovado; principal 679,01 kB / gzip 194,04 kB; aviso herdado >500 kB preservado. |
| `npm.cmd run dev:voice` | Iniciado sem `.env.voice`: respondeu no console que estava desabilitado, sem chamar API; processo de teste encerrado. Não comprova a configuração habilitada ou Auth real. |
| Dependência/lock | `ws` 8.22.2 já instalado via jsdom declarado diretamente para o broker; `npm install --package-lock-only --offline --ignore-scripts --no-audit --no-fund` sincronizou o lock. Tentativas anteriores de instalação online/offline falharam por rede/cache; nenhuma instalação remota foi concluída. |
| Diff | `git diff --check` aprovado durante a revisão; conferência final antes do commit. |

Testes novos: default desligado, configuração incompleta rejeitada, ferramenta sem autoridade de escrita, argumentos/nomes indevidos rejeitados, origem/JWT/participante/bot simulados e fechamento por outro dono negado; concorrência de início libera apenas uma chamada, limite diário persiste ao reabrir SQLite, duração e respostas encerram pelo servidor, perda de controle/configuração alterada encerram, criação incerta conserva lease e bloqueia repetição, criação tardia recebe hangup, falha no hangup bloqueia novas chamadas. Adaptador real teve somente fetch injetado para verificar multipart SDP/configuração, ID e hangup; não abriu websocket externo.

Transporte simulado: importação sem mídia/rede, início explícito, texto sem microfone, sugestão desduplicada sem mutação, sem reinício após queda, limite e stop liberam tracks/conexão, permissão negada e ferramenta indevida preservam texto, cancelamento durante permissão/SDP limpa resultados tardios. Componente: flags desligadas não oferecem início, proposta corrigida exige transferir → enviar → prévia → confirmar, transcrição corrigível/cancelar, troca de conversa/conta e pagehide encerram. Primeiro teste de foco detectou que aviso de encerramento roubava foco do campo; corrigido e suíte aprovada. Lint inicial interpretou helper useText como hook; renomeado sem supressão, import de timer explicitado.

Revisão dirigida real no navegador in-app via Computer Use, somente bancada `/tests/ui/conversations.html` identificada em memória e sem microfone/API/Supabase: desktop 1366×900, celular 360×800, início/encerramento de sessão simulada, transcrição/sugestão corrigíveis, transferência de sugestão para o campo local, Tab até Enviar/Enter e prévia antes/depois. Foco confirmado no campo e no feedback; não houve confirmação de oferta no banco real. Medições DOM: scrollWidth 1351 dentro de viewport 1366; scrollWidth 345 e painel 279 dentro de viewport 360. Sem overflow horizontal observado; paleta/marca/ilustrações preservadas. Capturas fora do repositório em `C:/Users/Murilo/.codex/visualizations/2026/11/11/01a1cc88-6941-7781-a4ff-935942149068/conexa-voz-360.jpg` e `conexa-voz-desktop.jpg`. Viewport restaurado. Bancada recarregada após atualização de código para descartar sessão mock antiga preservada pelo HMR; recarga reinicia memória e não comprova F5 remoto. Não foi auditoria completa de acessibilidade.

Limites: Auth/RLS real do broker, negociação WebRTC, sideband/hangup, precisão da transcrição, entendimento do modelo, custo efetivo e interrupção real continuam sem teste. Tetos são operacionais, não garantia financeira; crash do processo requer recuperação/supervisão, e criação sem ID exige conciliação manual. Broker local de instância única não está pronto para publicação pública/serverless. Duas migrations anteriores seguem sem aplicação autorizada no demo; não validar T35/T38/T41 ou encerrar T42/M6 por mocks. Documentação oficial consultada, sem usar API paga; testes reais somente pelo usuário conforme roteiro.

Autorização posterior da revisão de fluxos, 12/11/2026: usuário respondeu “pode integrar” após apresentação de 160d235, autorizando publicação de feature/revisao-fluxos-acessibilidade e integração/publicação na dev. Substitui somente a pendência de autorização Git dessa revisão; não implica deploy, main, auditoria integral ou novo aceite de marco. Registro em IA.md, interação 056.
# Login individual e acesso de desenvolvedor — 13/11/2026

Implementação pelo Codex na `feature/login-real`, criada da dev `807254e`, por pedido explícito do usuário. `/login` com três perfis compactos, e-mail/senha, cadastro, confirmação, recuperar/redefinir senha, feedback e retomada; entrada da landing atualizada. `/demo` preserva as quatro contas fictícias para desenvolvedor, condicionado a DEV/flag de demo; build padrão bloqueia esse acesso. Fonte principal: `src/pages/Login.jsx`, `login.css`, `services/account-auth.js`, integração App/layout e migration aditiva. D030 registra a distinção entre credencial pessoal e domínio acadêmico.

**Verificação local executada:** `npm run lint`, `npm test` (119/119), `npm run build` aprovados. Build conserva aviso de chunk >500 kB. `npm run test:db` aprovado nos dez scripts PGlite, incluindo novo teste de trigger, três papéis, locais fictícios, bloqueio de mudança de papel/account_kind, função privada, CRUD/RLS produtor/comprador/anon. Quatro novos testes do serviço e dois do componente jsdom verificam papel da tabela, não confiar em user_metadata, demo desabilitado, confirmação, recuperação genérica, mostrar senha, payload e bloqueio/preservação durante envio. jsdom não comprova layout ou teclado nativo.

**Supabase demo real:** CLI oficial gerou arquivo local `20261113155836_personal_account_auth.sql`; MCP aplicou como `20261113160056` (`personal_account_auth`) ao projeto `conexa`, sem mudanças em dados de negócio preexistentes. Consulta de settings pública confirmou e-mail habilitado, cadastro habilitado e confirmação obrigatória. Três contas QA fictícias foram provisionadas com e-mail já confirmado para exercitar trigger e login sem envio externo. `tests/account-auth-remote.mjs` passou para produtor, comprador e transportador: login por senha, `getUser`/tabela, refresh, sessão em novo cliente, tentativa de trocar role/account_kind bloqueada, metadados alterados sem efeito no papel, perfil incorreto rejeitado e consulta M2/M3 do próprio papel. Conta demo recusada com acesso developer desligado. As três fixtures e seus locais/participantes foram removidos; consulta final confirmou zero usuários QA desta execução. Não houve criação de ofertas, demanda, DM ou pagamento de teste neste roteiro; consultas M2/M3 conservam sua manutenção usual de expiração.

**Revisão visual dirigida:** Chrome headless com perfis temporários, capturas de `/login` em desktop 1440 px e mobile 360 px inspecionadas pelo agente; marca/ilustrações locais e campos sem caixas mantidos. Primeira revisão identificou fundo retangular da arte e contorno global no main; substituídos por SVGs locais e regra de foco específica do main. Artefatos locais ignorados: `artifacts/login-desktop.local.png`, `artifacts/login-mobile.local.png`. O gate da habilidade retornou `GATE: OFF (no build active)`; não alegar aprovação automática do gate. Revisão dirigida não equivale a teste nativo integral de cadastro/login/F5/teclado.

**Limites:** confirmação por e-mail e recuperação possuem integração real no código, verificadas com mocks de resposta; envio, entrega e clique em e-mail não foram percorridos. Não foram alterados SMTP, Site URL nem URLs autorizadas do Supabase; configurar origem `/login` e `/redefinir-senha` e validar com caixa de entrada controlada antes de convidar usuários. Advisories remotos conservaram avisos de RPCs SECURITY DEFINER existentes, tabelas privadas históricas sem policies e proteção de senhas vazadas desligada; a função nova é privada e sem EXECUTE de clientes. Credenciais pessoais identificam participantes do mesmo ambiente acadêmico; todas as operações e locais iniciais continuam simulados. Aceite humano, push/integração na dev e deploy desta feature pendentes; M5/M6 e pendências anteriores não foram encerrados por este trabalho.

## Revisão do login sem animações e com divisão integral — 13/11/2026

Pedido corretivo do usuário atendido na mesma feature/login-real: removidas as ilustrações acrescentadas e os movimentos/entradas/transformações do login. Desktop agora tem metade verde e metade creme ocupando toda a tela, sem margens externas ou cartão arredondado. Mobile com cabeçalho/apresentação verde e acesso claro abaixo. Marca vetorial preservada. A orientação de não criar novas animações passa a prevalecer sobre sugestões da habilidade de design.

Verificação pelo Codex: npm run lint, npm test (119/119) e npm run build aprovados, com aviso de chunk >500 kB preservado. Capturas Chrome headless em 1440×1000 e 360×800 inspecionadas; revisão visual dirigida, sem alegar percurso de teclado/cadastro ou gate automático completo. git diff --check aprovado. Sem alterações em Auth/banco ou novas verificações remotas. Avaliação humana e autorização de push/integração na dev pendentes.

## Conversas como mensageiro — 13/11/2026

Implementação: `feature/conversas-mensageiro`, da dev `36ee42d`, D031. BotThread reúne perguntas, seleção de ofertas, campos guiados, prévia e confirmação nos balões. Compositor sempre aberto, sugestões junto ao campo, envio por Enter (Shift+Enter para linha), histórico com rolagem própria, lista lateral desktop e Voltar no mobile. Consulta do produtor passa diretamente à edição da oferta selecionada; informações de disponibilidade e identificação distinguem colheitas do mesmo alimento. Prévia fica oculta enquanto um campo é corrigido e é removida depois de aplicar. Recuperação de revisão obsoleta limpa seleção local do campo.

Verificação técnica por Codex: npm run lint, npm test (120 testes aprovados, zero falhas), npm run build e git diff --check. Build mantém aviso preexistente de chunk JS acima de 500 kB. Suíte usa os fixtures/jsdom existentes e teste adicional com duas ofertas do mesmo alimento, comprovando alvo correto e confirmação separada; verificação de rejeição/revalidação também exercita campo guiado aberto. Asserções antigas sobre campo oculto/ausente e retorno técnico foram atualizadas ao novo comportamento; a primeira rodada teve falhas por essas expectativas e uma falha de alocação ao imprimir um elemento DOM inesperado, resolvidas antes da rodada final.

Navegador integrado, bancada isolada `/tests/ui/conversations.html` com memória local: revisados início, consulta com cartão, edição de quantidade, prévia antes/depois e cancelamento em 360×800; consulta digitada enviada por Enter e disposição desktop em 1280×900. Compositor permaneceu visível nos estados observados; largura de conteúdo 345/360 px no mobile e 1265/1280 px no desktop (sem overflow horizontal). Capturas locais em artifacts/conversas-mensageiro-mobile.local.jpg e artifacts/conversas-mensageiro-desktop.local.jpg. Houve interrupção/falha transitória de captura na primeira sessão do navegador; revisão e capturas foram repetidas com sucesso em nova sessão.

Limites: fixtures não comprovam CRUD/RLS/Realtime/F5 no demo. Sem escrita remota, migration, envio a pessoas, API paga ou microfone nesta rodada. Histórico persistido conserva os textos originais no servidor; cartões ativos representam somente o estado atual. Propostas/demandas mantêm seus fluxos existentes. Teclado virtual físico, leitores de tela e uso por pessoas reais não verificados. Avaliação humana, aceite M6 e autorização de push/integração permanecem pendentes; sem deploy ou promoção para main.

## Respostas no compositor normal — complemento D031 — 13/11/2026

Codex ajustou BotThread.jsx e conversations.css para remover FieldAnswer, usar o compositor normal nas perguntas de quantidade/preço/mínimo/datas e manter alimento/coleta/vencimento desconhecido selecionáveis no balão. Foco e teclado decimal acompanham a pergunta. Respostas simples e correções passam pelas mesmas validações, sem publicação até confirmar a revisão. Perguntas já exibidas nesta visita permanecem na apresentação em memória ao avançar, sem regravar o histórico do servidor nem prometer reconstrução após F5.

Verificação: npm run lint, npm test (120 aprovados, zero falhas), npm run build e git diff --check passaram. Build mantém aviso preexistente de JS acima de 500 kB. Testes de componente atualizados para preencher o compositor, verificando criação completa, preço inválido preservado, preço válido como mensagem comum, retenção da pergunta anterior, datas, correções, cancelamento e confirmação separada. Não foram acrescentados testes de banco para mudança sem alteração de serviços/schema.

Bancada isolada em memória no navegador integrado: escolhido Criar oferta → Alface; enviados 20 e 5,00 pelo compositor com Enter, avançando para preço e mínimo. Conferência visual em 360×800 e 1280×900, sem input dentro do histórico; campo normal visível (borda inferior em aproximadamente 745/800 px e 795/900 px), conteúdo sem overflow horizontal (345/360 e 1265/1280 px). Capturas artifacts/conversas-resposta-chat-mobile.local.jpg e artifacts/conversas-resposta-chat-desktop.local.jpg. Sem API paga, microfone, escrita remota ou teste físico de teclado virtual/leitor de tela. Feature permanece para avaliação e autorização de publicação/integração.

## Fotografias por perfil no login — 13/11/2026

Implementação por Codex em feature/imagens-login, criada da dev: fotografias fornecidas pelo usuário copiadas para public/assets/login e associadas a Produtor (plantação), Comprador (loja) e Transportador (caminhões) em Login.jsx. login.css mantém a divisão integral e usa fotografia com camada verde e enquadramento responsivo no painel de apresentação. Sem novas animações ou alteração de Auth/serviços/banco.

Verificação: npm run lint, npm test (120 aprovados, zero falhas), npm run build e git diff --check passaram. Build conserva aviso de chunk JS acima de 500 kB. Navegador integrado no /login local existente na porta 5173: troca entre os três perfis e revisão visual em 1280×900 e 360×800. Medições dirigidas sem overflow horizontal: largura 1265/1280 e 345/360; carregamento da foto selecionada confirmado. Capturas locais ignoradas em artifacts/login-{produtor,comprador,transportador}-{desktop,mobile}.local.png. Viewport temporário restaurado.

Limites: fotografias originais sem otimização, aproximadamente 9,7 MB no total e carregamento conforme seleção; recorte com object-fit:cover varia com o viewport. Sem teste de rede lenta, novo teste remoto, fluxo completo de autenticação ou auditoria integral de acessibilidade. Avaliação humana, autorização de push/integração e deploy pendentes.

Autorização posterior: usuário solicitou “mande para dev depois para main”, autorizando publicação e integração desta alteração nas duas branches. A autorização Git não implica deploy ou teste adicional de produto.

## Google Maps Embed — cenário fictício de Botucatu — 13/11/2026

Implementação pelo Codex em feature/google-maps-simulacao, criada da dev 549241d. DemoRouteMap, demo-map.js e CSS adicionam circuito fictício de Botucatu com saída, coletas, entrega e retorno quando acordado; percurso completo ou trechos. Integrado em OperationPage e RouteAnalysis, preservando roteiro manual, distância/tempo/pedágio não confirmados e todos os valores/estados da operação. Apenas contagem das coletas/presença de retorno são usadas do roteiro consultado, sem encaminhar seus endereços ou identidades ao Google. Limite explícito de seis coletas, com fallback integral no manual. Configuração Embed pública restrita preparada vazia por escolha do usuário, incluindo .env local não versionado; sem criar credencial, ativar API, faturamento ou alterar Supabase.

Codex executou npm run lint, npm test (123 aprovados, zero falhas), npm run build e git diff --check com sucesso. Aviso preexistente de chunk principal acima de 500 kB preservado. Três testes novos: URL somente de coordenadas inventadas, sequência/retorno e ausência de requisição sem chave/circuito suportado; componente abre sob demanda, seleciona trechos, recarrega/fecha iframe e reinicia estado ao mudar circuito. Testes DOM usam jsdom sem recursos externos. Primeira execução detectou uma asserção sobre propriedade não implementada pelo jsdom; alterada para atributo DOM. Um ensaio de evento error do iframe mostrou que esse evento não serve como detecção confiável de erro interno; removida a dependência, mantidos aviso permanente, fallback e retry, com load usado apenas para encerrar o indicador de abertura. Reexecução direcionada e suíte completa passaram.

Navegador integrado, bancada /tests/ui/m4.html em 1366×900 e 360×800: consulta do roteiro fictício com retorno, lista do cenário, seleção de Coleta 2, informação do trecho e estado sem chave inspecionados. Medições documentElement.scrollWidth/innerWidth: 1351/1366 desktop e 345/360 mobile, sem rolagem horizontal. Navegação por Tab de Coleta 2 para Entrega conferida; zero iframes sem chave. Capturas locais ignoradas: artifacts/google-maps-desktop.local.png e artifacts/google-maps-mobile.local.png. Viewport restaurado ao fim. Revisão dirigida da bancada; não é auditoria integral ou novo teste remoto de M4/M5.

Limites: chave vazia por pedido do usuário, sem consulta real ao Google, traçado nas ruas/cobertura dos pontos, validação de chave/restrições ou estimativas/retorno do provedor. O Google pode exibir POIs reais da cartografia, sem relação com os participantes fictícios. Sem GPS, rota certificada para caminhões, Routes API, frete automático, persistência Google ou alteração de cotação/aceites/estoque/status. README documenta configuração e fontes oficiais. Sem aceite humano, commit, push, merge, deploy ou ZIP atualizado nesta entrega.

## Frete e previsão com Google Maps Routes — D034 — 13/11/2026

Implementação pelo Codex em feature/frete-google-maps, criada da dev. Nova cotação recebe calculador de distância/frete/entrega com tarifas explícitas (base + km + adicionais, mínimo opcional), aplicação revisada sem enviar e renovação da confirmação das condições. Retorno entra no frete/direção total, fora da entrega; paradas são informadas. Alteração de roteiro/versão/saída esconde estimativa anterior, com aviso quando aplicada. Broker separado Node, chave privada, Auth/papel carrier consultados no Supabase, origem, quotas demo voláteis e timeout; nenhuma migration. Exemplo da transportadora em Botucatu usa coordenadas inventadas e não muda resumo financeiro nem contratos. Conteúdo Google não é persistido.

Verificação local por Codex: npm run lint, npm test (130 aprovados, zero falhas), npm run build e git diff --check passaram. Aviso preexistente de chunk JS acima de 500 kB mantido. Sete testes novos de domínio/servidor/componente cobrem centavos/arredondamento/mínimo/adicionais, retorno separado da entrega, ordem/coletas/limites, requisição/field mask com chave privada, resposta incompleta, origem/Auth/papel/quotas/concorrência, erro sem segredos, mudança de tarifas sem nova consulta, invalidação do resultado e preenchimento de cotação sem envio/renovação da confirmação. Testes usam Google/Auth simulados e jsdom, não layout ou Supabase reais. Primeira rodada lint detectou falta de export na bancada React; corrigida, rodada final aprovada.

Navegador integrado na bancada isolada /tests/ui/freight.html com distâncias/tempos fictícios: desktop 1366×900 e mobile 360×800; larguras documentElement.scrollWidth/innerWidth de 1351/1366 e 345/360, sem overflow horizontal nos estados vistos. Exercitados cálculo com retorno (25 km, base 10, km 2, adicionais 5 = R$ 65), ajuste para km 3 (R$ 90), remoção do retorno com invalidação, falha controlada/fallback e cotação integrada sem retorno (15 km, base 10, km 2, adicionais 5 = R$ 45). Quarenta minutos de direção + 30 de paradas com saída 08:00 resultaram em entrega 09:10; campos price 45.00 e delivery_time 2099-11-16T09:10 conferidos, confirmação desmarcada e nenhum envio. Tab do botão de aplicar alcançou a confirmação das condições. Capturas locais ignoradas em artifacts/google-maps-freight-{desktop,mobile,quote-mobile}.local.png; viewport restaurado.

A revisão integrada identificou que o valor visível do datetime-local não estava chegando ao estado do cálculo ao preencher pelo navegador. Corrigido para tratar input diretamente, capturando o valor antes da atualização; reexecução visual confirmou cálculo/aplicação e teste do componente cobre o evento. Atualização de código via HMR reiniciou estado de uma primeira tentativa visual; preenchimento/revisão foram repetidos. Não foi tratado o valor visível como prova de atualização interna sem testar a ação.

Limites: nenhuma consulta Google real, credencial/faturamento/API ativados, autenticação remota desta fatia, persistência real de nova cotação derivada do cálculo, testes de cobertura rural/caminhão ou implantação. Os locais demo antigos com apenas nomes fictícios não foram geocodificados nem substituídos por negócios reais. Servidor configurável preparado, sem endpoint publicado. Quotas em memória reiniciam e não substituem orçamento/cotas Google. Termos/privacidade públicos e configuração de hospedagem são pré-requisitos de ativação, documentados no README. Verificação dirigida de teclado/layout não é auditoria integral de acessibilidade. Avaliação humana e autorização de subir/integrar na dev pendentes; nenhum commit, push, merge ou deploy nesta entrega.
## Página principal — acesso único ao login — 13/11/2026

- Implementação local em `feature/home-acesso-entrar`, criada da dev: `Landing.jsx`, `home.html` e `polish.css`. Somente “Entrar” abre `/login`; demais chamadas são âncoras internas e os três perfis têm descrições informativas.
- Codex executou `npm run lint`, `npm test` (130 aprovados, zero falhas), `npm run build` e `git diff --check` com sucesso. Build mantém o aviso preexistente de chunk JS acima de 500 kB. Sem testes novos para esta alteração de navegação/apresentação.
- Navegador integrado no servidor local existente em `localhost:5173`: “Conhecer a rede” abriu `#como-funciona`, “Conheça os participantes” e “Conhecer os perfis” abriram `#para-quem`; “Entrar” abriu `/login`. DOM confirmou um único `[data-login]`, nenhum botão nos perfis e todas as chamadas de conteúdo com âncoras locais.
- Revisão visual em 1366×900 e 360×800: leitura dos perfis e apresentação local preservadas, sem rolagem horizontal nas medidas conferidas (1351/1366 e 345/360). Verificação dirigida, sem autenticar conta, alterar Supabase ou certificar todos os fluxos de acessibilidade.
- Avaliação humana e autorização de publicação/integração na dev pendentes. Sem commit, push, merge ou deploy nesta entrega.

## Página principal — carrossel por perfil e retirada de chamadas — 13/11/2026

Complemento D036 à revisão anterior D035, na mesma feature/home-acesso-entrar. O pedido posterior reintroduz login por perfil e substitui as linhas informativas por uma faixa de cartões lado a lado, com repetição horizontal. Setas, chamadas internas de rolagem e botão final removidos; controle de movimento deslocado do rodapé para junto dos perfis.

- Codex executou npm run lint, npm test (130 aprovados, zero falhas), npm run build e git diff --check com sucesso. Aviso preexistente de chunk acima de 500 kB mantido. Sem testes automatizados novos para esta alteração local de apresentação.
- Navegador integrado, localhost:5173, em 1366×900 e 360×800: três cartões na largura desktop; faixa horizontal com cartão de 84% no celular. Medidas sem overflow da página: 1351/1366 e 345/360. A rolagem interna dos cartões é intencional.
- Os três links foram clicados e abriram /login?perfil=produtor, comprador e transportador, com rádio e fotografia correspondentes selecionados. Um cartão repetido também foi clicado e abriu o perfil correto. Sem envio de credenciais nem autenticação.
- Progresso automático e repetição conferidos por observação visual e medidas: com grupo de 1351 px, scrollLeft de 1470 para 1712 em aproximadamente 39,8 segundos, consistente com avanço de 40 px/s e retorno de uma largura no ciclo. Controle Reduzir movimento/Ativar movimento conferido: cópias ocultas e scrollLeft zero ao reduzir; Tab alcançou o primeiro perfil original, sem passar pelas cópias. Preferência de sistema implementada, sem emulação nesta rodada. Deslize em aparelho físico e leitor de tela não foram testados.
- Captura local de avaliação: C:/Users/Murilo/.codex/visualizations/2026/11/13/01a1d6f2-b28d-77c0-baf6-c78168390da7/perfis-home.png, carrossel pausado para mostrar os três perfis. Sem commit, push, merge, deploy ou novo aceite humano presumido.

## Textos e botões verdes — D037 — 13/11/2026

- Codex ajustou site.css, App.css, login.css e profile-carousel.css na feature/home-acesso-entrar, preservando as alterações anteriores da página principal. Títulos antes laranjas e botão do login agora usam verde; cartão clicável do comprador usa verde claro.
- npm run lint, npm test (130 aprovados, zero falhas), npm run build e git diff --check passaram. Aviso preexistente de chunk acima de 500 kB permanece. Não foram criados testes novos para a troca de cores.
- Navegador integrado, localhost:5173, em 1366×900 e 360×800: página principal e login conferidos visualmente; títulos da home e botão de envio com rgb(23, 77, 56), cartão do comprador com rgb(237, 242, 223). Sem overflow horizontal nos estados medidos (1351/1366 e 345/360). Sem envio de formulário ou nova autenticação. Destaque PageHeading conferido no CSS, sem percorrer novamente todos os portais autenticados.
- Capturas locais fora do repositório, em C:/Users/Murilo/.codex/visualizations/2026/11/13/01a1d6f2-b28d-77c0-baf6-c78168390da7/home-verde-desktop.png e home-verde-mobile.png. Marca/ilustrações/fotografias originais preservadas.
- Usuário autorizou publicar a atualização acumulada e promover à main, conforme D037; não é relato de testes humanos específicos. A execução Git deve ser conferida no histórico/relato final, separada de deploy, configuração Google e demais pendências anteriores.

## Perfis fixos no desktop e fotografias — D038 — 13/11/2026

Codex ajustou profile-carousel.js/css na feature/perfis-fixos-fotografias, criada da dev local. Lint, 130 testes, build e diff-check aprovados; aviso preexistente de chunk acima de 500 kB permanece. Sem testes novos para esta revisão visual reversível.

Navegador integrado em localhost:5173: desktop 1366×900 com três fotos/cartões lado a lado, cópias ocultas e scrollLeft zero em observações separadas. Em 360×800, cópias flex e avanço para scrollLeft 1145 mantidos; clique no comprador abriu /login?perfil=comprador com a função selecionada. Retorno de 360 para 1366 px voltou a scrollLeft zero e cópias ocultas. Sem overflow de página nas medidas 1351/1366 e 345/360. Sem autenticação ou teste remoto. Captura desktop em C:/Users/Murilo/.codex/visualizations/2026/11/13/01a1d6f2-b28d-77c0-baf6-c78168390da7/perfis-fotos-desktop.png. Fotos originais reutilizadas, sem edição dos arquivos; recorte cover varia por largura. Avaliação humana desta revisão e envio remoto pendentes.

## Perfis com camada verde do login — D039 — 13/11/2026

Codex alterou somente a apresentação dos cartões em profile-carousel.css: camada verde idêntica ao login, texto e contorno de foco creme. npm run lint, npm test (130 aprovados), npm run build e git diff --check passaram; aviso preexistente de bundle acima de 500 kB. Revisão no navegador integrado em 1366×900 e 360×800, sem overflow da página nas medidas conferidas; no celular, scrollWidth 345 para viewport 360 e texto computado rgb(255,249,236). Captura desktop local perfis-verde-login.png na pasta de visualizações desta conversa. Sem autenticação, teste remoto ou novo teste automatizado para esta mudança de CSS. Sem commit/push/merge desta revisão ou aceite humano presumido.

## Vídeo de abertura e zoom na rolagem — D040 — 13/11/2026

- Codex implementou na feature/video-abertura-scroll, criada da dev local a141553. Vídeo fornecido copiado sem transcodificar, SHA-256 igual na origem/destino; navegador identificou 1280×720 e duração aproximada de 10,03 s. Poster JPEG capturado do próprio vídeo, 140.079 bytes. Sem IA de imagem ou envio a provedor de mídia.
- npm run lint, npm test (130 aprovados, zero falhas), npm run build passaram. Aviso preexistente de chunk acima de 500 kB permanece. Sem testes novos para a apresentação; suíte existente cobre regressões, sem comprovar animação por si só.
- Navegador integrado em localhost:5173, desktop 1366×900: muted=true, reprodução ativa e readyState=4. Na rolagem y=675, escala do vídeo 1,5; y=1215, escala aproximada 1,107 e moldura 0,920 com opacidade 0,522. Em y=2430, abertura fora da tela e vídeo pausado; ilustrações/rota existentes visíveis, 18 elementos provided-animation presentes após recarga completa.
- Em 360×800: scrollWidth 345, sem overflow horizontal; texto e controle legíveis. Em y=600, escala 1,5; y=1080, vídeo 1,101 e moldura 0,919. Controle pausou reprodução, removeu animação/fixação, reduziu a abertura a 800 px e sincronizou o botão inferior “Ativar movimento”; segundo clique retomou vídeo/efeitos.
- Preferência prefers-reduced-motion emulada via CDP: vídeo pausado, animationName=none, palco relative e abertura de 800 px; controle desabilitado com descrição do sistema. Emulação removida e viewport temporária restaurada no fim. Nenhum erro no console capturado. Control+Home usado para retornar ao começo; não houve prova completa de teclado, leitor de tela ou aparelho físico.
- Capturas fora do repositório: C:/Users/Murilo/.codex/visualizations/2026/11/13/01a1d71d-a68d-70a0-bc60-2f25cb0da7f7/conexa-video-desktop.png e conexa-video-mobile.png. Fallback de navegador sem scroll timeline, autoplay bloqueado, rede lenta e política de economia de dados não foram emulados. Vídeo cover recorta mais as laterais no celular. Sem autenticação, Supabase, deploy, publicação/integração Git ou aceite humano nesta revisão.

## Perfis minimalistas no acesso de desenvolvedor — D041 — 13/11/2026

- Codex implementou na feature/perfis-desenvolvedor-minimalistas, criada da dev local 499e563. Demo.jsx/demo.css simplificam a tela; profile-photos.css compartilha fotos e gradiente com Landing/home.html/profile-carousel.css. Fotografias e marca originais preservadas. Sem nova dependência ou animação na tela de desenvolvedor.
- npm run lint, npm test (130 aprovados, zero falhas), npm run build e git diff --check passaram. Aviso preexistente de chunk acima de 500 kB permanece. Sem novos testes para esta alteração de apresentação reversível.
- Navegador integrado em localhost:5174: desktop 1224×901 com três cartões de 500 px de altura; sem overflow horizontal. Em 360×800, cartões empilhados com 313×360 px, scrollWidth 345 e botões de 50 px de altura. Os três perfis e aviso final conferidos visualmente; seletor Ana/João e Tab do seletor ao botão do produtor verificados. Sem prova completa de teclado, leitor de tela ou aparelho físico.
- Página principal consultada após extração do CSS: três perfis originais continuam com fotos correspondentes, gradiente rgba(23,77,56,.45/.6/.85), texto creme e links por função. Não foi repetida toda a validação de vídeo/carrossel. Viewport temporária restaurada.
- Capturas fora do repositório: C:/Users/Murilo/.codex/visualizations/2026/11/13/01a1d73a-9f6e-7a73-bffa-67a05bff88ea/perfis-dev-desktop.png e perfis-dev-mobile.png. Sem acionar entrada de conta, autenticação remota, alteração no Supabase, commit, push, merge, deploy ou aceite humano nesta revisão.

### Complemento D041 — seleção sem menu nativo — 13/11/2026

Codex revisou Demo.jsx/demo.css para remover pontos dos títulos/aviso e usar radios estilizados Ana/João, sem menu select do sistema. Lint, 130 testes e build passaram; aviso preexistente de bundle acima de 500 kB. Navegador integrado em desktop 1224×901 e 360×800: seleção por clique em João e por ArrowLeft para Ana comprovadas na árvore acessível; celular com scrollWidth 345 para viewport 360. Capturas perfis-dev-selecao-desktop.png e perfis-dev-selecao-mobile.png na mesma pasta externa desta revisão. Viewport restaurada, sem entrada de conta, alteração remota ou aceite humano presumido.

## Área de usuário e dashboard — D042 — 13/11/2026

Feature/area-usuario criada a partir da dev limpa. Codex implementou AppLayout/workspace.css, rotas/perfis, SalesDashboard/ProducerOrders, agregação sales.js e acesso do comprador às propostas. Lint, 132 testes e build aprovados na primeira rodada; teste de entrada do bot ajustado para passar pelo dashboard e clicar Produtos. Dois testes novos verificam isolamento dos valores por produtor, exclusão de estados não concluídos, filtro de datas e gráfico atravessando o ano com meses vazios. Build mantém aviso de bundle acima de 500 kB.

Navegador integrado e helper Computer Use falharam na inicialização (failed to write kernel assets). Alternativa: Chrome local headless com CDP e perfil temporário separado. Bancada tests/ui/workspace.html apresenta três operações explicitamente fictícias por componente de conteúdo; não autentica conta nem grava operações. AppLayout conserva consulta de notificações existente. Revisão desktop 1440×1100 e celular 360×800; scrollWidth respectivamente 1425 e 360. Menu celular mostrou seis destinos, abriu/fechou com aria-expanded correspondente; seletor alterado para mês atual. Conflito de precedência do display da app-shell detectado na captura desktop e corrigido; capturas repetidas. Evidências externas: C:/Users/Murilo/.codex/visualizations/2026/11/14/01a1d76d-2ff5-7091-8307-751b3269d91e/workspace-desktop.png, workspace-mobile.png e workspace-menu.png.

Limites: bancada com fixtures não comprova os indicadores com dados de conta autenticada no Supabase, CRUD/RLS remotos, aparelho físico ou leitor de tela. Sem migrations, escrita de dados remotos, push, merge, deploy ou aceite humano desta mudança. Demais marcos e aceites preservados. Nova rodada final das verificações registrada no relato de entrega.

Rodada final após os ajustes de CSS/período e a separação do componente de conteúdo: npm run lint, npm test (132/132), npm run build e git diff --check aprovados. Aviso de bundle acima de 500 kB mantido. Chrome temporário de revisão encerrado; servidor local da feature disponível na porta 5176 para avaliação.

### Complemento D042 — limpeza do menu — 13/11/2026

Por pedido explícito do usuário, removido o cartão Conexões que dão frutos do menu lateral (JSX e estilos) e retirado o sublinhado/borda inferior apenas do link Ver todos os pedidos. Lint, 132 testes e build aprovados; aviso de bundle preexistente mantido. Chrome headless/CDP na bancada visual 1440×900 e 360×900 confirmou bloco ausente, decoração none e borda 0 px no link, sem overflow horizontal. Capturas externas workspace-clean-1440.png e workspace-clean-360.png na mesma pasta de D042. Sem teste remoto, novo aceite humano ou integração/publicação.

Autorização de publicação D042: usuário respondeu ‘pode’ ao pedido explícito de subir e integrar na dev, incluindo o redesenho e a limpeza do menu. Autorização restrita à feature → dev; sem promoção para main ou comprovação de deploy.

### Complemento D042 — bloco auxiliar e sublinhados — 13/11/2026

feature/limpeza-acoes criada da dev 7595870. Pedido do usuário remove integralmente o bloco Mais tempo para o que você cultiva do dashboard e sublinhados das ações compartilhadas (incluindo linhas inferiores text-link, links do rodapé e controle do carrossel). Alterados SalesDashboard.jsx, workspace.css, participant.css, site.css e profile-carousel.css; foco preservado. Lint, 132 testes e build aprovados, com aviso preexistente de bundle. Chrome headless/CDP em 1440×900/360×900 na bancada: bloco ausente, ações sem decoração/linha inferior e sem overflow horizontal. Capturas actions-clean-1440.png e actions-clean-360.png em C:/Users/Murilo/.codex/visualizations/2026/11/14/01a1d76d-2ff5-7091-8307-751b3269d91e. Tabela móvel conserva quebra estreita preexistente. Sem nova escrita remota, verificação de todas as telas, aceite humano ou publicação presumida.

Usuário autorizou explicitamente a publicação desta revisão no repositório Conexa-GS/Conexa-Site e integração na dev e main. Autorização Git não comprova deploy ou novos aceites de marco.

## Página principal fotográfica — D043 — 14/11/2026

Codex implementou a reformulação em feature/home-fotografica, criada da dev limpa fba0512. Landing.jsx deixa de montar artwork/motion/carrossel antigos; home.html, home.css e home-motion.js compõem apresentação fotográfica, processo e inclusão. Vídeo e sua lógica/CSS existentes preservados. Fotos locais fornecidas foram redimensionadas/recomprimidas para 960/1920 px com System.Drawing; originais preservados. Seis derivados somam aproximadamente 1,5 MB, com seleção responsiva e carregamento sob demanda.

Verificações locais pelo Codex: npm run lint aprovado; npm test com 132/132 aprovados; npm run build aprovado, mantendo aviso preexistente de bundle acima de 500 kB. Revisão visual no navegador integrado via cua_repl, com viewport desktop 1440×900 e celular 360×800. Confirmados vídeo sem som, fotografias carregadas, ausência de elementos de desenhos na home e ausência de overflow horizontal. As três entradas foram clicadas e abriram login com produtor, comprador e transportador selecionados; nenhuma conta foi autenticada. Foco por Tab percorreu comprador → transportador com indicação visível. Controle de movimento reduziu a preferência, pausou vídeo e revelou todos os blocos pendentes; preferência do sistema emulada pausou vídeo, desabilitou reativação e deixou palco em position relative. Sem erros de console na revisão final.

Na revisão foi corrigida a faixa de transporte que herdava o grid de duas colunas e estreitava o texto. Desktop voltou a usar bloco único com texto em 53% da largura; celular conserva flex e texto na largura disponível. Conferência repetida nas duas larguras sem overflow. Captura móvel via CDP com recorte de página apresentou artefato de captura; descartada e substituída por screenshot nativa após ajuste da viewport pelo navegador. Preferência emulada e viewport temporárias restauradas.

Evidências externas: C:/Users/Murilo/.codex/visualizations/2026/11/14/01a1d7fd-32cf-78b2-a95f-a678f0ff680a/home-fotos-desktop.png, home-fotos-360.png e home-fotos-completa.png. Servidor Vite local na porta 5173 para avaliação. Limites: navegador emulado não comprova aparelho físico ou leitor de tela; não houve CRUD/RLS remoto, pagamentos, transporte físico ou novo aceite humano. Nenhum push, merge, deploy ou integração foi executado nesta revisão.

### Complemento D043 — faixas de carregamento/recebimento — 14/11/2026

Codex substituiu as duas seções finais em home.html, reutilizando o tratamento da faixa de transporte e retirando estilos antigos de processo/ideia de home.css. Quatro derivados responsivos das duas fotos fornecidas, com alt/lazy loading. Lint, 132/132 testes e build passaram (aviso preexistente de bundle). Títulos reduzidos na revisão visual; build final repetido após ajuste textual.

Navegador integrado em 1440×900 e 360×800: duas fotos carregadas, textos legíveis, âncoras do cabeçalho levando às novas seções e ausência de overflow horizontal. Seletores home-process/home-idea/home-steps ausentes. Viewport restaurada. Capturas em C:/Users/Murilo/.codex/visualizations/2026/11/14/01a1d7fd-32cf-78b2-a95f-a678f0ff680a/: home-carga-desktop.png, home-recebimento-desktop.png, home-carga-360.png e home-recebimento-360.png. Capturas antigas da página completa conservam contexto anterior. Sem aparelho físico, leitor de tela, escrita remota ou aceite humano. Publicação/integração seguem pendentes.

### Complemento D043 — remoção dos rótulos — 14/11/2026

Pedido do usuário remove os seis rótulos home-label e traços laranja acima dos títulos. HTML e CSS correspondentes removidos; títulos, explicações e ações mantidos. Navegador integrado em 1440×900/360×800 conferiu composição e zero elementos home-label, sem overflow móvel. Capturas home-sem-rotulos-desktop.png e home-sem-rotulos-360.png na pasta externa desta conversa. Lint, 132 testes e build executados nesta rodada; resultados no relato de entrega. Viewport restaurada. Sem avaliação humana, publicação ou alteração de dados.

### Complemento D043 — abertura sem Mais juntos e sem realces — 14/11/2026

Pedido explícito remove Mais juntos apenas do título inicial; h1 passa a Do campo / pra cidade. Removido destaque verde claro de ir mais longe e suas regras de cor, mantendo títulos uniformes sobre os respectivos fundos. Navegador integrado conferiu 1440×900/360×800, zero spans nos títulos da home, h1 creme e ausência de overflow móvel. Captura abertura-sem-destaque-desktop.png na pasta externa desta conversa. Viewport restaurada; sem alteração de dados, aceite humano ou publicação.

## D044 — Paleta sage e tipografia — 14/11/2026

Codex inspecionou cópia PNG decodificada da referência AVIF fornecida: cores A3B18A, DAD7CD, 588157, 3A5A40 e 344E41. Paleta aplicada via theme.css, estilos das páginas/área interna e cores da marca vetorial, sem alterar fotos. Lint, npm test (132/132) e build aprovados; aviso preexistente de chunk acima de 500 kB mantido.

Navegador integrado em 1440×900 e 360×800 conferiu home, login e bancada tests/ui/workspace.html, sem overflow horizontal. Home e login: font-family Poppins, Arial, sans-serif, título peso 500; document.fonts.check para Poppins aprovado. Fundo computado rgb(218,215,205) e botões/bloco principal rgb(52,78,65). Home antes usava a mesma família com título peso 700, agora alinhado ao login. Bancada interna usa fixtures explícitas, sem autenticação/alteração remota. Viewport restaurada.

Capturas na pasta externa desta conversa C:/Users/Murilo/.codex/visualizations/2026/11/14/01a1d7fd-32cf-78b2-a95f-a678f0ff680a/: paleta-home-desktop.png, paleta-home-360.png, paleta-login-desktop.png, paleta-login-360.png, paleta-workspace-desktop.png e paleta-workspace-360.png. Não é auditoria completa de contraste/acessibilidade, verificação de todas as páginas com dados reais ou aparelho físico. Sem aceite humano, publicação ou integração presumidos.
