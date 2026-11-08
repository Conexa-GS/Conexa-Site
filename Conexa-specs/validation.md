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
