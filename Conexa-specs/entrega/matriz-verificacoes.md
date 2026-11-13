# Matriz de verificações e aceites — T33/T43

Consolidada em **12/11/2026** pelo Codex. “Técnico” indica procedimento registrado, não aceite humano integral. Evidências remotas/visuais abaixo são das rodadas citadas; nesta preparação documental não foram repetidas. Uma linha parcial conserva as partes verificadas e explicita a lacuna. Critérios completos em [acceptance.md](../acceptance.md).

Fontes versionadas: [V1 M1/relato humano](../validation.md#atualização-de-aceite-m1--07112026), [V2 M2](../validation.md#m2--implementação-e-verificações--07112026), [V3 M3](../validation.md#atualização-m3--07112026--implementado-avaliação-pendente), [V4 M4](../validation.md#m4--rotas-manuais-e-sugestões-inclusivas-no-demo--12112026), [V5 M5](../validation.md#t28m5--fechamento-completo-no-demo--12112026), [V6 texto/DM](../validation.md#conversas--migrations-e-teste-demo-autorizados--11112026), [V7 D025](../validation.md#t41d025--bot-e-mensagens-após-recarga-recuperação-e-estoque--11112026), [V8 D026](../validation.md#t41d026--recuperação-controlada-e-modo-offline-do-navegador--12112026), [V9 voz simulada](../validation.md#conversas--iavoz-opcional-t39t40--11112026), [V10 UI](../validation.md#revisão-de-fluxos-responsividade-e-teclado--12112026), [V11 T31](../validation.md#t31--conferência-acadêmica--12112026), [V12 T29](../validation.md#t29--componente-persistência-pelo-serviço-e-rls--10112026), [V13 cotações](../validation.md#cotações--percurso-conectado-recarga-e-desistência--12112026).

## Critérios funcionais

| Critério | Procedimento / evidência / data | Ambiente e responsável real | Resultado e limite técnico | Aceite humano |
| --- | --- | --- | --- | --- |
| AC01 | V1 07/11; V11 12/11 criar/ler, reautenticar comprador | Usuário relatou M1; Codex API/Auth demo na T31 | CRUD/persistência API comprovados; T31 não fez F5 de navegador. V1 não tem logs individuais | M1 aceito em 07/11, no escopo relatado |
| AC02 | V1; testes `offers.test.js`/`database.mjs`, conferência T31 | Usuário, e Codex em domínio/PGlite | Validações locais/banco; sem nova execução remota de cada combinação na T31 | M1 aceito; não atribuir cada caso ao usuário |
| AC03 | V11 12/11: atualizar, versão antiga rejeitada, DELETE e ausência, negativas REST/RPC | Codex, serviços reais via Vite SSR e Auth/RLS Supabase | Sete grupos aprovados; oferta própria sem vínculos excluída; três rodadas. Controle de versão sequencial, não corrida | Aceite M1 histórico; T31 técnica, sem novo aceite |
| AC04 | V1; V10 12/11 falhas/vazio/formulário preservado | Usuário no relato; Codex no navegador/bancadas isoladas | Erro/foco/vazio verificados; falha da bancada não é indisponibilidade real de todo banco | Aceite M1 histórico; revisão UI sem novo aceite |
| AC05 | V2 07/11 `remote-m2.mjs`: demanda50, reserva30+20, João5 livres | Codex, Auth/RLS API demo | Composição/quantidades e consulta persistida aprovadas; fixtures próprias | M2 aceito 07/11; visual relatado pelo usuário |
| AC06 | V2: domínio/SQL rejeitam unidade incompatível e insuficiência | Codex, domínio/PGlite e catálogo kg | Parcial: catálogo não implementa conversão de caixa; não alegar caso remoto de conversão | M2 aceito com limites registrados |
| AC07 | V2: duas submissões simultâneas ao último saldo | Codex, Supabase real/duas chamadas concorrentes | Uma vence; outra sem reservas parciais | M2 aceito |
| AC08 | V2 liberação/expiração; V5 conversão/compromisso/cancelamento | Codex, API demo, Auth/RLS/concorrência | Reservas liberadas e conversão sem duplo desconto; antecipação de expiração em fixture registrada | M2 aceito; aceite M5 pendente |
| AC09 | V2 snapshots/FK/arquivo; V7 estoque/histórico | Codex, API demo/PGlite | Preço acordado preservado, exclusão vinculada rejeitada e orientação a arquivar | M2 aceito; sem novo aceite nesta entrega |
| AC10 | V3 07/11 indicação/cotação por perfil | Codex, API/Auth/RLS demo | Cotação só pelo transportador; limites visuais originais preservados | T20/M3 aceito explicitamente 07/11 |
| AC11 | V3 capacidade/peso/conservação/validade | Codex, domínio/PGlite/API demo no escopo V3 | Bloqueios registrados; não equivale a certificação sanitária | M3 aceito no escopo apresentado |
| AC12 | V3 totais individuais; V5 ciclo financeiro | Codex, banco/API demo | Alimentos+frete/taxa zero, centavos e mínimos individuais; números são cenário, não saldo atual | M3 aceito; M5 pendente |
| AC13 | V3 mínimo individual e arredondamento | Codex, testes de domínio/banco | Resultado agregado não compensa mínimo violado; sem desconto oculto implementado | M3 aceito |
| AC14 | V3/V4 invalidação/versionamento; V13 revisão da cotação | Codex, SQL/API e site conectado/recarga | Revisões exigem novos aceites; não declarar cada possível nova coleta percorrida no navegador | M3/M4 aceitos com limites; extensão cotações em avaliação |
| AC15 | V4 12/11 histórico7/4, candidatas R$290/R$310, insuficiência80/60 | Codex, Auth/RLS API, site/F5/360 px/desktop | Razões inclusivas e diferença de alimentos observadas; total entre composições com fretes próprios sem prova | M4 aceito 09/11 no escopo manual |
| AC16 | V4 roteiro com saída/coletas/destino/retorno e nulos | Codex, API/site/F5 comprador/transportador | Mesmo roteiro, frete sem dupla soma; distância/pedágio/provider desconhecidos | M4 aceito no escopo manual |
| AC17 | V4 roteiro manual com campos desconhecidos; testes `m4-database.mjs` | Codex, demo e domínio/PGlite | Parcial: manual funciona; API externa/falha de fornecedor não ativada nem testada | M4 aceito com limite de API externa |
| AC18 | V5 12/11 pagamento recusado/pendente/aprovado/replay | Codex, API/Auth/RLS/concorrência e navegador demo | Sem agenda indevida ou duplicação; dinheiro sempre simulado | Aceite M5 pendente |
| AC19 | V5 cancelamento/estorno/estoque e ocorrência pós-início | Codex, API demo e site no escopo V5 | Estorno único antes do transporte; início não libera estoque automaticamente | Aceite M5 pendente |
| AC20 | V5 divergência → resolução → recebimento; D027 zero centavos | Codex, API demo/concorrência e site/F5 três perfis | Uma parcela por beneficiário; repasse bloqueado até resolver/receber; zero simulado válido | Aceite M5 pendente |
| AC21 | V2/V3/V5 negativas de perfil/ordem e estado preservado | Codex, Auth/RLS demo e testes locais | Ações indevidas rejeitadas nos cenários exercitados; sem auditoria universal de todas as transições | M2/M3 aceitos; M5 pendente |
| AC22 | V12 T29; V7 bot vigente/prévia/correção/confirmar | Codex, jsdom + serviço/Auth demo; depois site conectado | Texto só grava após confirmação explícita; modal T29 histórico restrito à bancada | Aceite M6 pendente |
| AC23 | V10 12/11 e V7: 360×800/1366×900, Tab/Enter/Escape/foco/erros | Codex, navegador conectado e bancadas separadas | Parcial: revisão dirigida, overflow corrigido; sem auditoria global de leitor/contraste/todos os estados | Aceites anteriores preservados; nenhum aceite global presumido |
| AC24 | V7/V10 Conversas nos dois perfis/bot/pessoa/Voltar/teclado | Codex, navegador demo e bancada | Técnico no escopo dirigido; sem sugerir WhatsApp conectado | Aceite M6 pendente |
| AC25 | V6/V7/V8 mensagem entre sessões, F5, replay, não lidas e reconciliação | Codex, Auth/Realtime demo e site conectado | Texto/DM verificados; queda física/reabertura efetiva do WebSocket pendente em T41 | Aceite M6 pendente |
| AC26 | V6 negativas anônimo/terceiro, remetente derivado e Realtime privado; V7 troca de conta | Codex, API/websocket demo, site e mocks de voz | Texto/DM técnico; limpeza/autorização do broker de voz real ainda não verificada | Aceite M6 pendente |
| AC27 | V6/V7 criar/editar/arquivar/cancelar, consulta comprador | Codex, SQL/API/Auth demo e site/F5 no escopo registrado | Perguntas/prévia/confirmar e catálogo persistido; não alegar linguagem arbitrária | Aceite M6 pendente |
| AC28 | V7 `remote-bot-stock.mjs`, negativas, reservas/compromissos/snapshots | Codex, Supabase real; domínio/PGlite complementares | Proteções técnicas de texto aprovadas; fala incidental/provedor somente simulado | Aceite M6 pendente; T42 aberta |
| AC29 | V6/V7/V8 versão/saldo obsoletos, timeout antes/depois, mesma chave/F5 | Codex, API demo/concorrência, site e falha injetada | Sem duplicação nos casos exercitados; D026 limpou erro de consulta sem apagar pedido incerto | Aceite M6 pendente; rede física T41 aberta |
| AC30 | V6/V7 DM não chama bot nem formaliza operação | Codex, SQL/API e componente/site | Texto humano fica mensagem; formalização depende dos fluxos próprios | Aceite M6 pendente |
| AC31 | V9 11/11 default desligado, limites/auth mock, sugestão sem escrita | Codex, mocks/SQLite local/bancada | Parcial: modo simulado sem custo; broker/provedor/Auth reais não executados | Sem aceite de voz; usuário executa T42 |
| AC32 | V9 cleanup/transcrição/correção/limite simulados | Codex, mocks/WebRTC simulado, sem microfone/API | Voz real **não verificada**; custo e término no provedor sem evidência real | T42 e aceite M6 pendentes |

## Requisitos acadêmicos e pacote

| Item | Evidência / responsável | Estado desta entrega | Pendência |
| --- | --- | --- | --- |
| React/Vite/Tailwind, oito componentes, useState/useEffect, dois hooks | Codex, T31 12/11: dez componentes e seis hooks com consumidores reais; [auditoria](../t31-auditoria.md) | Conferido anteriormente no checkout | Sem repetir auditoria integral nesta preparação |
| API externa com CRUD | T31, serviços reais/Supabase/Auth/RLS, sete grupos e Delete observado | Conferido tecnicamente | Não substitui todos os AC01–04/navegador |
| 15 commits significativos | T31: amostra de quinze implementações, sem contar merges; 70 não merges na base auditada | Conferido no histórico local | ZIP não inclui `.git`; histórico é consultado no repositório |
| IA.md e AI.md | T31 e nova entrada de programação do empacotador | Cinco seções presentes; arquivo canônico e ponte | Consultas/esclarecimentos antigos e completude dos integrantes ainda exigem saneamento |
| README/.env.example/lockfile | README revisto e exemplos sem credenciais | Artefatos preparados para execução limpa | Ambiente remoto depende de configuração local segura; instalação limpa registrada em validation.md |
| ZIP sem configurações/segredos conhecidos | `scripts/package-delivery.ps1`, auditoria, hashes e releitura | Pacote gerado/verificado localmente; detalhes em validation.md | Detector delimitado; não é certificação universal ou assinatura |
| Repo privado, professores com escrita, deploy e envios separados | Não verificados nesta entrega | Pendentes; T32 parcial | Não criar/alterar acessos ou publicar por pressuposição |
| Matriz T33 e documentação T43 | Estes artefatos e roteiro, Codex 12/11 | Preparados e apresentados para avaliação | T43/aceite M6, aceite M5 e autorização de push/integração dependem do usuário |

## Verificações desta preparação

Os comandos realmente executados, resultados, instalação da cópia extraída e inspeção do pacote constam da seção [T32/T33/T43 em validation.md](../validation.md#t32t33t43--artefatos-para-avaliação--12112026). Lint/test/build locais não contam como repetição remota, voz ou aceite humano. Os relatórios brutos e capturas locais anteriores ficam fora do ZIP; os resultados essenciais versionados acima permanecem disponíveis.
