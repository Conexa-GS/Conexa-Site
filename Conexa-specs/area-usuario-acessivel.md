# Área do participante — reformulação para avaliação

software: área de tarefas para pequenos produtores, compradores e transportadores.
Identidade preservada: creme, verde e laranja, marca vetorial e ilustrações locais na escolha de perfil. Tipografia do piloto, leitura a partir de 16 px, botões principais de 48 px ou mais. Sem sorteio de paleta, hero publicitário, efeitos ou cenas: o pedido explícito prioriza uso direto e menos informação.

## Direção de interface

- Voz: português cotidiano, frases curtas, nome da tarefa no título e verbo na ação. Nenhum fato de negócio inventado.
- Ofertas: título direto, Nova oferta, cadastro assistido como alternativa, busca e lista com quantidade, disponibilidade, coleta, preço e edição/exclusão. Retirados os blocos promocionais e a decoração repetida dos cartões.
- Comprador: “Meus pedidos” substitui “Minhas demandas” na navegação e nos principais títulos; contratos e rotas permanecem os mesmos. Escolher produtores continua sendo uma etapa explícita.
- Navegação: texto e ícone, estado atual visível, composição vinculada a Meus pedidos, Trocar participante com rótulo visível e encerramento da sessão existente.
- Entregas: valores, prazo, estados e confirmações permanecem visíveis; roteiro, análise e comparação de frete abrem sob demanda em controles nativos de detalhes.
- Conversas: instrução direta e identificação de prévia sem texto de infraestrutura na apresentação. Prévia e confirmação do bot preservadas.
- Formulários: texto e controles ampliados, sem alterar validações, valores monetários ou gravação. Marca e ilustrações não foram substituídas por imagens externas.

## Verificação e limites

Branch `feature/area-usuario-acessivel`, criada da dev `48ec847`. Nenhum push, merge, deploy ou alteração de banco autorizado nesta entrega. Trabalho da branch anterior preservado.

Lint, 113 testes Node/jsdom e build executados com sucesso. O teste do acesso ao bot foi atualizado para o rótulo Cadastrar com ajuda; continua verificando navegação, seleção do bot e ausência de mutação. Aviso preexistente de bundle acima de 500 kB continua.

Bancada `tests/ui/participant.html` com componentes reais e Vite configurado sem variáveis de Supabase; ofertas locais e formulários em memória. Não comprova Auth/RLS, persistência, funcionamento completo de entregas ou avaliação por pessoas mais velhas. A bancada não faz gravações remotas. As telas de transporte sem backend exibem seu impedimento real.

O gate da skill foi armado antes das edições. Primeira rodada: `GATE: FAIL 29 (round 1 of 3)`, com 22 WARN, incluindo demandas de hero, seção por tela, visual em cada seção e momentos animados. Esses critérios de marketing não foram usados para introduzir conteúdo ou movimento contrário ao pedido. Não houve waiver nem alteração dos scripts da skill. Dois avisos de contraste e os alvos pequenos de marca/busca motivaram ajustes reais; foco visível do conteúdo também recebeu estilo.

O checker de layout inicialmente não encontrou Chrome; fornecido o caminho do Edge/Chromium instalado, iniciou e falhou internamente com `Cannot read properties of undefined (reading 'map')` e `r.sections is not iterable`. Não equivale a aprovação do layout. Capturas da skill são a evidência visual local, com limites distintos do gate.

Achados abertos da primeira rodada (alguns recebem várias ocorrências): hero-fill; flush; button-styles; cta; copy-headline; text-contrast; section-gaps; focus-ring; moment-none; hero-screen; section-height; section-air; one-section; container-edges; no-visual. WARN de 320 px: fold-cut do botão principal e tap-size da marca/busca (alvos ampliados depois). Relatório bruto local em `.taste-skill/gate.json`, não versionado por conter artefatos de execução. Nenhuma alegação de GATE PASS.

Não há novos contatos, domínio, formulário externo, fotos, slots de cliente ou dados assumidos. Não foi executado teste pago, voz, rede física ou novo percurso remoto. Aceites anteriores de marcos mantêm seu escopo; aprovação desta interface e integração na dev dependem da avaliação do usuário.

## Ocorrências do gate na primeira rodada

- **hero-fill** — main#conteudo > div.guided-entry "Quer ajuda para cadastrar? Cadastrar com". the next section shows on the first screen: it starts at 363px on a 900px screen (the hero ends at 339px)
- **flush** — main#conteudo > div.filter-bar > label.search-field "Buscar alimento ou produtor". its first line sits 0px under the top edge of div.filter-bar, where the ground changes
- **button-styles** — (one screen). 3 button styles on one screen: soft, outline #b8c4ad ("Trocar participante"); soft, fill #174d38, outline #174d38 ("Minhas ofertas"); soft, fill #174d38 ("Nova oferta"); the odd one out: "Nova oferta"
- **button-styles** — (the page). 3 button styles on the page: soft, outline #b8c4ad x5 ("Trocar participante"); soft, fill #174d38, outline #174d38 x1 ("Minhas ofertas"); soft, fill #174d38 x1 ("Nova oferta")
- **cta** — main#conteudo > aside.inline-note "Seu mínimo líquido é respeitado. O frete". the last section before the footer ends with no button
- **copy-headline** — main#conteudo > div.task-heading > div.page-heading.relative > h1 "Minhas ofertas". "Minhas ofertas" does not name what is sold (area do participante conexa, area, participante, conexa, from flags)
- **text-contrast** — div#root > div.app-shell > div.demo-banner "Demonstração com dados fictícios. Sem pa". body text in #5a604a on #f2edda reads 5.58:1 (needs 7:1)
- **text-contrast** — main#conteudo > aside.inline-note > p "Seu mínimo líquido é respeitado. O frete". body text in #475b48 on #f4efdf reads 6.39:1 (needs 7:1)
- **section-gaps** — main#conteudo > div.offer-grid > article.offer-card / main#conteudo > aside.inline-note. 90px between these sections, +76% against the median 51px of gaps at a change of ground
- **focus-ring** — #conteudo:focus. "#conteudo:focus" in the page removes the focus outline and sets nothing in its place
- **focus-ring** — .app-shell .app-content:focus. ".app-shell .app-content:focus" in the page removes the focus outline and sets nothing in its place
- **moment-none** — (the page). a software page (--type) deals no moment: every kind carries one, two on a long page (moments.md)
- **hero-screen** — main#conteudo > div.task-heading "Minhas ofertasCadastre o que você tem pa". the hero ends at 339px on a 900px screen, 561px above the fold: it ends at the fold, 1px either way (SR-1)
- **hero-screen** — main#conteudo > div.guided-entry "Quer ajuda para cadastrar?Cadastrar com ". 537px of the next section shows on the first screen (from 363px on a 900px screen): nothing below the hero shows at load (SR-1)
- **section-height** — main#conteudo > div.filter-bar "Buscar alimento ou produtorAlimentoTodos". the section is 54px tall (0.1 screens), 846px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
- **section-air** — main#conteudo > div.guided-entry / main#conteudo > div.filter-bar. 49px of air between the content of these two sections: 128-480px (64-600px WARN) (every gap out of the band at 1440px, top to bottom: 49px after "Quer ajuda para cada", 53px after "Buscar alimento ou p", 75px after "++Ana OliveiraDispon") (SR-3)
- **section-air** — main#conteudo > div.filter-bar / main#conteudo > div.offer-grid. 53px of air between the content of these two sections: 128-480px (64-600px WARN) (SR-3)
- **section-air** — main#conteudo > aside.inline-note "Seu mínimo líquido é respeitado. O frete". the content fills 28.9% of the section's height (19 of 66px): 55% or more (40% WARN) (SR-3)
- **one-section** — main#conteudo > div.task-heading > div.page-heading.relative > h1 "Minhas ofertas". the screen at scroll 0px (stride 0) shows 86px of section 1 and the heading of section 1 whole and the content of 4 sections, over 24px each beside section 4: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
- **one-section** — div#root > div.app-shell > footer.app-footer "Conexa · Do campo pra cidade. Mais junto". the screen at scroll 324px (the top of section 2) shows 75px of section 6 and the content of 3 sections, over 24px each beside section 4: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
- **container-edges** — main#conteudo > aside.inline-note "Seu mínimo líquido é respeitado. O frete". the content of section 5 runs 169px from the left and 541px from the right (read from its outermost blocks: no .wrap): the page's container starts at 121px; 169 and 541px are not one margin; the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)
- **container-edges** — div#root > div.app-shell > header.app-header "Ana OliveiraProdutor · perfil fictícioTr". the nav's content runs 121px from the left and 136px from the right (read from its outermost blocks: no .wrap): 121 and 136px are not one margin (one container, equal margins, 2px either way) (and 3 more like it: "Minhas ofertasCadastre o", "Buscar alimento ou produ", "Conexa · Do campo pra ci") (SR-6)
- **container-edges** — div#root "Pular para o conteúdoAna OliveiraProduto". a <div> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
- **container-edges** — main#conteudo > div.task-heading "Minhas ofertasCadastre o que você tem pa". the section needs exactly one in-flow child .wrap (it has 2 in-flow children, 0 .wrap) (and 5 more like it: "Quer ajuda para cadastra", "Buscar alimento ou produ", "++Ana OliveiraDisponível") (SR-6)
- **container-edges** — main#conteudo > aside.inline-note > span.seed. a box runs 143-157px, outside the container lines of section 5 at 169-899px: full width is for background layers and grounds only (SR-6)
- **container-edges** — div.offer-grid > article.offer-card > div.offer-card-copy > h2 "Alface". the h2 starts 25px right of the container's left: every h1 and h2 starts on it, 2px either way (SR-6)
- **container-edges** — main#conteudo > div.filter-bar > label.search-field "Buscar alimento ou produtor". 1 text block starts on a left line at x 138, 17px from the container's left: text starts on the container's left, or on one split line (x 624, 725, 825) (SR-6)
- **flush** — main#conteudo > div.task-heading > button.button "Nova oferta". its button sits 0px above the lower edge of div.task-heading, where the ground changes to div.guided-entry
- **no-visual** — main#conteudo > div.offer-grid > article.offer-card "Alface". no picture, effect or mock in this section; a feature section needs a visual

### Capturas inspecionadas

Ofertas do produtor: 1440, 1024, 820 e 360 px; comprador: 768 e 390 px. Sem cortes de cartões ou sobreposição observados nessas capturas. O placeholder da busca fica abreviado no tablet, mantendo nome acessível; a busca continua editável. Formulários de oferta e pedido em 360 px: campos ampliados, modal rolável; a captura mostra a primeira parte do formulário, não comprova o percurso de rolagem/teclado no navegador. Veículos desktop: estado de indisponibilidade local legível, não o formulário conectado. As capturas de ofertas antecedem o último ajuste que evita repetir a quantidade total quando igual à disponível e simplifica a nota do comprador; compilação posterior aprovada. Artefatos locais ignorados em artifacts/participant-*.local.png.

## Resultado final da skill

**GATE: OPEN 24 (rounds used up)**. Terceira e última rodada encerrada; sem waivers. Contraste, foco e estilos dos botões deixaram de constar como FAIL. Checker de layout executou no gate com Edge explícito, encontrando ausência de .wrap; a falha interna anterior ocorreu no comando standalone. Permanecem 20 WARN. Não é aprovação do gate.

- **hero-fill** — main#conteudo > div.guided-entry "Quer ajuda para cadastrar? Cadastrar com". the next section shows on the first screen: it starts at 363px on a 900px screen (the hero ends at 339px)
- **flush** — main#conteudo > div.filter-bar > label.search-field "Buscar alimento ou produtor". its first line sits 0px under the top edge of div.filter-bar, where the ground changes
- **cta** — main#conteudo > aside.inline-note "Seu mínimo líquido é respeitado. O frete". the last section before the footer ends with no button
- **copy-headline** — main#conteudo > div.task-heading > div.page-heading.relative > h1 "Minhas ofertas". "Minhas ofertas" does not name what is sold (area do participante conexa, area, participante, conexa, from flags)
- **section-gaps** — main#conteudo > div.offer-grid > article.offer-card / main#conteudo > aside.inline-note. 90px between these sections, +76% against the median 51px of gaps at a change of ground
- **moment-none** — (the page). a software page (--type) deals no moment: every kind carries one, two on a long page (moments.md)
- **hero-screen** — main#conteudo > div.task-heading "Minhas ofertasCadastre o que você tem pa". the hero ends at 339px on a 900px screen, 561px above the fold: it ends at the fold, 1px either way (SR-1)
- **hero-screen** — main#conteudo > div.guided-entry "Quer ajuda para cadastrar?Cadastrar com ". 537px of the next section shows on the first screen (from 363px on a 900px screen): nothing below the hero shows at load (SR-1)
- **section-height** — main#conteudo > div.filter-bar "Buscar alimento ou produtorAlimentoTodos". the section is 54px tall (0.1 screens), 846px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
- **section-air** — main#conteudo > div.guided-entry / main#conteudo > div.filter-bar. 49px of air between the content of these two sections: 128-480px (64-600px WARN) (every gap out of the band at 1440px, top to bottom: 49px after "Quer ajuda para cada", 53px after "Buscar alimento ou p", 75px after "Ana OliveiraDisponív") (SR-3)
- **section-air** — main#conteudo > div.filter-bar / main#conteudo > div.offer-grid. 53px of air between the content of these two sections: 128-480px (64-600px WARN) (SR-3)
- **section-air** — main#conteudo > aside.inline-note "Seu mínimo líquido é respeitado. O frete". the content fills 28.9% of the section's height (19 of 66px): 55% or more (40% WARN) (SR-3)
- **one-section** — main#conteudo > div.task-heading > div.page-heading.relative > h1 "Minhas ofertas". the screen at scroll 0px (stride 0) shows 86px of section 1 and the heading of section 1 whole and the content of 4 sections, over 24px each beside section 4: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
- **one-section** — div#root > div.app-shell > footer.app-footer "Conexa · Do campo pra cidade. Mais junto". the screen at scroll 324px (the top of section 2) shows 75px of section 6 and the content of 3 sections, over 24px each beside section 4: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
- **container-edges** — main#conteudo > aside.inline-note "Seu mínimo líquido é respeitado. O frete". the content of section 5 runs 169px from the left and 541px from the right (read from its outermost blocks: no .wrap): the page's container starts at 121px; 169 and 541px are not one margin; the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)
- **container-edges** — div#root > div.app-shell > header.app-header "Ana OliveiraProdutor · perfil fictícioTr". the nav's content runs 121px from the left and 136px from the right (read from its outermost blocks: no .wrap): 121 and 136px are not one margin (one container, equal margins, 2px either way) (and 3 more like it: "Minhas ofertasCadastre o", "Buscar alimento ou produ", "Conexa · Do campo pra ci") (SR-6)
- **container-edges** — div#root "Pular para o conteúdoAna OliveiraProduto". a <div> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
- **container-edges** — main#conteudo > div.task-heading "Minhas ofertasCadastre o que você tem pa". the section needs exactly one in-flow child .wrap (it has 2 in-flow children, 0 .wrap) (and 5 more like it: "Quer ajuda para cadastra", "Buscar alimento ou produ", "Ana OliveiraDisponívelAl") (SR-6)
- **container-edges** — main#conteudo > aside.inline-note > span.seed. a box runs 143-157px, outside the container lines of section 5 at 169-899px: full width is for background layers and grounds only (SR-6)
- **container-edges** — div.offer-grid > article.offer-card > div.offer-card-copy > h2 "Alface". the h2 starts 25px right of the container's left: every h1 and h2 starts on it, 2px either way (SR-6)
- **container-edges** — main#conteudo > div.filter-bar > label.search-field "Buscar alimento ou produtor". 1 text block starts on a left line at x 138, 17px from the container's left: text starts on the container's left, or on one split line (x 624, 725, 825) (SR-6)
- **flush** — main#conteudo > div.task-heading > button.button "Nova oferta". its button sits 0px above the lower edge of div.task-heading, where the ground changes to div.guided-entry
- **no-visual** — main#conteudo > div.offer-grid > article.offer-card "Alface". no picture, effect or mock in this section; a feature section needs a visual
- **container** — page. no .wrap

A composição de telas de tarefas é intencional: o pedido do usuário prevalece sobre publicidade de tela inteira, efeitos, visuais decorativos e estrutura de landing page exigida pelo checker. Os achados de espaçamento/contêiner continuam explícitos para avaliação, sem adicionar altura artificial ou fotografias à listagem. A marca mantém as cores originais e os detalhes financeiros continuam disponíveis.

Performance da bancada Vite de desenvolvimento (1 rodada em 1440/390): 4 FAIL por transferência/JS não empacotado (aprox. 28/24 MB), 1 WARN por 106 requests no desktop. Sem pedidos quebrados, layout shift 0,001/0,000, sem WebGL e imagens locais de 1,1 KiB. Não é medição do build de produção nem aprovação de performance; JSON local em .taste-skill/perf.json. O build de produção continua com aviso preexistente de chunk JS >500 kB.

Autorização posterior do usuário: publicar na dev e executar npm run dev para sua verificação. Autoriza publicação/integração desta feature na dev, sem promoção para main; não comprova aceite dos marcos ou teste humano da interface.
