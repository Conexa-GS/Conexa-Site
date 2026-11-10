# Verificação da primeira versão — 07/11/2026

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
