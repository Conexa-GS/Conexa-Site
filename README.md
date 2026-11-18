# Conexa

Protótipo acadêmico da FIAP para a Global Solution 2026.2. A Conexa aproxima pequenos produtores, mercados, restaurantes e transportadores para reunir pequenas colheitas em uma carga compartilhada.

## Ficha da CitizenTech

| Campo | Conexa |
| --- | --- |
| Nome da CitizenTech | Conexa |
| Cidade e bairro | Vila dos Lavradores, Botucatu (SP). A feira livre do bairro é o ponto de partida proposto para a pesquisa. Os pontos de coleta e entrega mostrados no site são fictícios. [Prefeitura de Botucatu](https://www.botucatu.sp.gov.br/noticia/print-noticia/5483/do-produtor-ao-consumidor-nove-feiras-livres-fortalecem-a-alimentacao-e-a-economia-de-botucatu/) |
| Cidadão beneficiado | Pequenos produtores com lotes que podem ser reunidos para atender mercados e restaurantes. Compradores locais e transportadores também participam da rede. |
| Problema | Pequenos produtores têm dificuldade para atender pedidos maiores e chegar ao comércio local quando precisam negociar em separado o volume e o transporte. |
| Como funciona | O produtor publica a oferta. O comprador cadastra a demanda, combina ofertas e envia a proposta, que reserva os lotes. Após os aceites dos produtores, o transportador cota o frete e os participantes revisam a operação. Pagamento, viagem e repasse são simulados. |
| O que cada parte faz | **Front-end Design** apresenta os três perfis e seus fluxos em telas responsivas com React e Tailwind CSS. **Web Development** implementa formulários, validações, hooks, integração com o Supabase e persistência de ofertas, demandas, reservas e cotações no demo. |
| Repositório | [Conexa-GS/Conexa-Site](https://github.com/Conexa-GS/Conexa-Site) |
| Deploy | [Site no Vercel](https://conexa-git-main-murilocastro233-9936.vercel.app/) · [Acesso à demonstração](https://conexa-git-main-murilocastro233-9936.vercel.app/demo) |
| Indicador de impacto | **Pedidos concluídos por produtor no período.** O painel conta pedidos com recebimento confirmado no demo. O indicador pode acompanhar o acesso a compradores em um piloto real. Os números atuais são simulados. |
| ODS conectados | [ODS 2 — Fome zero e agricultura sustentável](https://brasil.un.org/pt-br/sdgs/2), com foco no acesso de pequenos produtores a mercados (meta 2.3). [ODS 12 — Consumo e produção responsáveis](https://brasil.un.org/pt-br/sdgs/12), pela proposta de organizar a saída da colheita e reduzir o risco de perdas pós-colheita (meta 12.3). |

### Pesquisa documental — perdas de alimentos

A Vila dos Lavradores tem uma feira livre registrada pela Prefeitura de Botucatu. No município, o Banco de Alimentos atua para aproveitar alimentos próprios para consumo e reduzir o desperdício. Essas fontes estabelecem o contexto local, mas não informam o volume descartado na feira do bairro. [Feiras de Botucatu](https://www.botucatu.sp.gov.br/noticia/print-noticia/5483/do-produtor-ao-consumidor-nove-feiras-livres-fortalecem-a-alimentacao-e-a-economia-de-botucatu/) · [Banco de Alimentos de Botucatu](https://botucatu.sp.gov.br/noticia/5453/banco-de-alimentos-de-botucatu-beneficia-mais-de-55-mil-pessoas-por-meio-de-53-projetos-sociais/)

A Embrapa identifica manuseio, temperatura, armazenamento e transporte como fatores que influenciam as perdas pós-colheita. A hipótese da Conexa é que combinar pedidos com antecedência e organizar coletas compartilhadas pode ajudar a planejar a saída das hortaliças. A pesquisa documental sustenta a investigação dessa hipótese. A redução de perdas com o protótipo ainda precisa ser medida. [Embrapa — manuseio pré e pós-colheita](https://www.embrapa.br/en/busca-de-publicacoes/-/publicacao/1003270/orientacoes-quanto-ao-manuseio-pre-e-pos-colheita-de-frutas-e-hortalicas-visando-a-reducao-de-suas-perdas)

### Simulação de perdas na feira da Vila dos Lavradores

**Método.** A simulação acompanha três produtos em um dia hipotético de feira, da chegada ao fechamento. As quantidades foram construídas para ilustrar o cálculo. Os fatores considerados vêm da pesquisa documental. Nesta simulação, o indicador mede o descarte e mantém as sobras aproveitáveis em uma categoria separada.

| Produto | Recebido | Vendido | Guardado, doado ou reaproveitado | Descartado | Taxa de descarte |
| --- | ---: | ---: | ---: | ---: | ---: |
| Alface | 20 kg | 15 kg | 2 kg | 3 kg | 15% |
| Cenoura | 25 kg | 21 kg | 3 kg | 1 kg | 4% |
| Tomate | 30 kg | 22 kg | 4 kg | 4 kg | 13,3% |
| **Total** | **75 kg** | **58 kg** | **9 kg** | **8 kg** | **10,7%** |

**Resultado da simulação.** A taxa total é 8 ÷ 75 × 100 = **10,7%**. O tomate representa o maior peso descartado (4 kg) e a alface, a maior proporção do volume recebido (15%). Nesse cenário, o volume de descarte torna o tomate prioritário em quilos, enquanto a proporção mostra que a alface merece atenção no manuseio e na conservação.

**Relação com a Conexa.** Concentrar ofertas em pedidos confirmados pode ajudar a planejar o volume enviado. Uma coleta compartilhada também precisa preservar o acondicionamento e o tempo de transporte das hortaliças. A taxa calculada é ilustrativa. A análise usa dados sintéticos, sem entrevistas ou pesagens na feira, e o efeito da Conexa sobre o descarte segue sem medição.

## Integrantes

| Nome | RM |
| --- | --- |
| Hiago Silva de Oliveira | 572664 |
| Murilo Castro Chialastri | 569382 |
| Gabriel Brito Braga | 570467 |

[Executar localmente](#executar-a-partir-do-zip-ou-checkout-limpo) · [Configurar o Supabase demo](#configurar-supabase-demo--opcional) · [Avaliação no Vercel](#avaliação-rápida-no-vercel) · [Uso de IA](AI.md) · [Roteiro de demonstração](Conexa-specs/entrega/roteiro-demonstracao.md)

## Executar a partir do ZIP ou checkout limpo

Use **Node.js 24**, npm e um terminal. A instalação inicial precisa acessar o registro npm. Use Git para clonar o repositório ou obtenha o ZIP da entrega. Para regenerar o pacote a partir do checkout, use Git e PowerShell 7.2+.

1. Abra um terminal em `Conexa-Site`, na pasta do `package.json`, após extrair o ZIP ou clonar o repositório.
2. Para avaliar em memória, mantenha vazias a URL e a chave Supabase e deixe a voz desligada.
3. Instale as dependências do lockfile e inicie o site.

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Se o PowerShell bloquear `npm.ps1`, use `npm.cmd` no lugar de `npm`.

Abra o endereço informado pelo Vite, normalmente `http://127.0.0.1:5173`. Para testar sem cadastro, abra `/demo` ou clique em **Entrar como desenvolvedor** no login. Escolha o produtor Ana ou João, o comprador ou a transportadora. Encerre o servidor com Ctrl+C.

Sem URL **e** chave Supabase configuradas, ofertas usam memória, compartilhada entre perfis na mesma página, e reiniciam ao recarregar. Não há persistência local de ofertas. M2–M5 e Conversas informam a necessidade do banco; não anunciam gravação persistida nesse modo. Não confundir as bancadas de teste com dados remotos.

## Configurar Supabase demo — opcional

O pacote não distribui credenciais nem dados/Auth do banco. Para usar o demo existente, obter a configuração do grupo por meio local seguro:

```powershell
Copy-Item .env.example .env.local
```

Editar localmente o arquivo e reiniciar Vite. Vite lê `.env`, `.env.local` e variantes por modo; valores do processo também podem sobrescrever arquivos. Para avaliar sem rede, usar uma pasta extraída limpa e confirmar ausência de variáveis de processo Supabase preenchidas.

| Variável | Valor esperado / uso |
| --- | --- |
| `VITE_SUPABASE_URL` | URL do projeto demo autorizado; vazia para memória |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública/publishable do mesmo projeto; nunca `service_role` ou secret key |
| `VITE_DEMO_ANA_EMAIL`, `VITE_DEMO_JOAO_EMAIL`, `VITE_DEMO_BUYER_EMAIL`, `VITE_DEMO_CARRIER_EMAIL` | Quatro contas fictícias confirmadas, correspondentes a `supabase/seed.sql`; defaults `@conexa.invalid` |
| `VITE_DEMO_PASSWORD` | Senha descartável exclusiva dessas contas compartilhadas; visível no navegador |
| `VITE_CONEXA_VOICE_ENABLED` | `false` por padrão; não habilitar para avaliar texto/DM |

Todas as variáveis `VITE_` entram no frontend. Não usar segredos administrativos ou chave OpenAI. Com URL/chave configuradas, uma falha remota gera erro e não retorna silenciosamente ao modo em memória. Não inserir dados pessoais reais nas contas compartilhadas; não é autenticação de produção.

No **demo existente**, as migrations já foram aplicadas: M1–M3 em 07/11, M4/M5/revisões em 10/11, Conversas/bot em 11/11 e correção de zero centavos M5 em 12/11. Versões remotas diferem de alguns nomes locais e M1 foi manual; conferir [mapeamento](Conexa-specs/estado-atual.md#supabase-demo-o-que-já-foi-aplicado). Não reaplicar migrations, seed, `db push`, reset ou repair por pressuposição.

O cadastro individual em `/login` usa Supabase Auth. Sua migration `20261113155836_personal_account_auth.sql` foi aplicada ao demo como `20261113160056`. Para configurar a confirmação e a recuperação de senha em outro ambiente, ajuste a **Site URL**, autorize `<origem>/login` e `<origem>/redefinir-senha` e configure o envio de e-mail/SMTP. O recebimento dos e-mails ainda precisa de verificação ponta a ponta. [Documentação do Supabase Auth](https://supabase.com/docs/guides/auth/passwords)

Para **outro projeto novo e vazio**, provisionado pelo responsável: aplicar `supabase/migrations/*.sql` em ordem de nome, criar/confirmar as quatro contas fictícias do exemplo no Supabase Auth, depois executar `supabase/seed.sql` para mapear seus UUIDs. Se mudar emails, atualizar o mapeamento do seed. Conferir RLS/CRUD no projeto novo antes de alegar funcionamento. Os roteiros remotos são restritos ao hostname do demo Conexa e rejeitam outro projeto. Esta entrega não provisionou novo banco nem repetiu testes remotos.

Com Supabase, F5 na mesma aba revalida Auth/participante; Trocar participante encerra sua sessão. Abra abas novas pelo endereço para identidades independentes: duplicar uma aba pode copiar sua sessão inicial. Auth/journal usam sessionStorage por participante/aba; se bloqueado, a retomada não é garantida e novo envio de Conversas sem chave durável é impedido.

## Avaliação rápida no Vercel

Abra a [demonstração no Vercel](https://conexa-git-main-murilocastro233-9936.vercel.app/demo), escolha um perfil fictício e clique em **Entrar**. O acesso de desenvolvedor também aparece na tela de login. O `vercel.json` habilita esse acesso no build e encaminha as rotas da aplicação para `index.html`, preservando `/api/`.

Para persistência no Supabase demo, o projeto Vercel precisa das variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_DEMO_PASSWORD` e dos e-mails fictícios de `.env.example` (se diferentes dos padrões). A senha deve pertencer exclusivamente às contas demo já cadastradas; variáveis VITE_ são públicas. Sem Supabase, a entrada usa a prévia local volátil. Nenhuma credencial foi adicionada ao repositório. A configuração habilita o acesso compartilhado nos deploys deste projeto acadêmico; não usar com dados pessoais reais.

A configuração segue a [documentação oficial de Vite no Vercel](https://vercel.com/docs/frameworks/frontend/vite) e de [build.env](https://vercel.com/docs/project-configuration/vercel-json). Preparação local não comprova publicação ou login no domínio remoto.

## Fluxos e demonstração

Para demonstrar a persistência, use o Supabase demo. Crie e edite uma oferta própria como produtor, recarregue a página e confira a oferta em outra aba como comprador. Para completar o CRUD, exclua a oferta de teste enquanto ela estiver sem vínculos. [Roteiro de demonstração](Conexa-specs/entrega/roteiro-demonstracao.md) · [Evidências do CRUD no Supabase](Conexa-specs/t31-auditoria.md#crud-remoto-executado-nesta-rodada)

| Área | Endereço / acesso | Estado |
| --- | --- | --- |
| Apresentação e acesso | `/`, `/login`, `/demo` | Página pública, login individual e entrada para quatro contas fictícias |
| Ofertas | `/produtor/ofertas`, `/comprador/ofertas` | CRUD em memória ou Supabase; exclusão sem vínculos, arquivo para histórico vinculado |
| Bot Conexa | Flor flutuante, **Cadastrar com ajuda** ou item do bot em Mensagens | Consulta para produtor e comprador. Produtor pode criar, editar e arquivar ofertas próprias com prévia e confirmação. Texto sem API paga. |
| Conversas comprador | `/comprador/conversas` | Consulta pelo bot e DM; comprador não edita ofertas de terceiros |
| Demandas/composição | `/comprador/demandas`, `/comprador/demandas/:id/composicao` | Supabase: selecionar quantidades compatíveis e enviar cria reserva atômica; insuficiência não reduz demanda automaticamente |
| Propostas do produtor | `/produtor/propostas` | Supabase: aceitar/recusar, saldo e prazo persistidos |
| Transporte | `/transportador/veiculos`, `/transportador/solicitacoes` | Veículo/cotação por transportador; indicação de produtor não confirma frete |
| Operações | `/operacoes` | Cotações, mínimos/totais, roteiro manual, aceites e M5 simulada persistida; M5 em avaliação |
| Exemplos | `/operacoes/exemplo`, `/operacoes/exemplo/pagamento` | Prévias independentes; não são operações ativas |

Bot prepara rascunho auditável; só **Confirmar revisão N** grava pelo gateway compartilhado com o formulário. **Cancelar rascunho** não modifica catálogo. Mudança de versão/saldo exige nova prévia; `sim` ou fala incidental não confirmam. Texto livre é delimitado, sem entendimento de linguagem arbitrária. Use opções visíveis; datas exigem dia/mês/ano ou ISO e vencimento aceita desconhecido.

DM não altera estoque/preço nem formaliza reserva, frete, pagamento ou aceite. Antes de enviar, pedido/chave ficam em sessionStorage. Depois de falha/F5, abrir a conversa e usar **Verificar envio** ou **Verificar pedido pendente** com a mesma chave; não há reenvio automático. Texto ainda não enviado é volátil; rascunho estruturado/histórico ficam no Supabase.

M2/M3 persistem demandas, composição, reservas, cotações, totais e confirmações. Revisões invalidam aceites; negociação exige aprovação explícita do comprador. M4 mostra candidatas inclusivas e roteiro manual, sem API externa de mapas ativa nem promessa de menor frete. Pedágio/distância desconhecidos ficam a confirmar. Demo tem uma transportadora: encaminhamento a segunda conta continua sem prova.

M5 não cobra dinheiro: aprovado libera agendamento uma vez; recusado/pendente não libera. Após viagem fictícia, divergência bloqueia repasses; comprador registra resolução e depois confirma recebimento em ação separada. Cancelamento antes do transporte libera estoque/estorna uma vez; após início vira ocorrência. Aceite humano M5 continua pendente.

Em uma sessão autenticada, **Como usar** abre uma visita guiada de 6 etapas para produtor, 9 para comprador ou 6 para transportadora. A visita usa telas de exemplo e respostas fictícias e termina na página original, sem gravar dados.

Alface, cenoura e tomate têm imagens padrão. No formulário de oferta, o produtor pode pré-visualizar, trocar ou remover uma foto. O envio de fotos próprias ao Supabase demo depende da migration de Storage `202611140001_offer_photos.sql`, ainda sem aplicação remota registrada. [Verificação de fotos](Conexa-specs/validation.md#fotos-das-ofertas--d045--14112026)

M1–M4 têm aceite humano no escopo registrado. M5 e as conversas por texto foram verificadas no Supabase demo e continuam em avaliação para aceite. [Estado do projeto](Conexa-specs/estado-atual.md) · [Matriz de verificações](Conexa-specs/entrega/matriz-verificacoes.md) · [Limitações](Conexa-specs/entrega/limitacoes.md)

## Verificações reproduzíveis

Em outro terminal, na mesma pasta:

```powershell
npm run lint
npm test
npm run test:db
npm run build
npm run preview -- --host 127.0.0.1
```

| Comando | O que verifica | Limite |
| --- | --- | --- |
| `npm run lint` | ESLint do código configurado | Não prova execução ou layout; PowerShell é verificado pela execução do empacotador |
| `npm test` | Domínio, componentes jsdom, mocks de rede/provedor/voz | Não acessa o demo nem API paga; não é navegador nativo |
| `npm run test:db` | PostgreSQL local/PGlite, migrations e seed de teste | Identidade simulada, conexão serial e sem acesso ao Supabase remoto |
| `npm run build` | Build estático em `dist` | Aviso preexistente de chunk principal >500 kB; não testa deploy |
| `npm run preview` | Serve somente o build gerado; abrir endereço informado, normalmente porta 4173 | Prévia local; não publica na internet |

Os roteiros `tests/remote-*.mjs`, `test:conversations:demo` e `test:m5:demo` são **manuais**, separados da suíte automática. Autenticam e podem criar mensagens, ofertas, reservas, cargas e pagamentos simulados persistentes; consultar seus roteiros/efeitos e usar apenas o demo autorizado. Muitos leem especificamente `.env` com `process.loadEnvFile`, mesmo se o Vite usar `.env.local`; um ZIP sem credenciais não os executa. Modos `--check`/`*:check` validam configuração offline e também exigem um `.env` preenchido, sem provar conexão.

## Bancadas de desenvolvimento, sem escrita remota

Com `npm run dev`, abrir `/tests/ui/conversations.html`, `/tests/ui/accessibility.html`, `/tests/ui/m4.html`, `/tests/ui/m5.html` ou `/tests/ui/quote-revisions.html`. São componentes reais com fixtures/falhas em memória, identificados e fora do build de produção. `/tests/ui/m6.html` conserva o modal T29 histórico; a entrada atual leva ao Bot Conexa. Recarregar bancada reinicia fixtures e não comprova persistência remota.

**Exceção conectada:** `/tests/ui/conversations-connected.html` usa serviços reais e deixa histórico no demo; consultar [roteiro/efeitos](Conexa-specs/conversas-validacao-demo.md) antes de executar. Falha injetada não equivale a desconexão física. D025/D026 já registram texto/DM, F5 e offline emulado; prova física de T41 foi adiada pelo usuário.

## Organização, rastreabilidade e publicação

`src/components` e `src/features` organizam a interface em React e Tailwind CSS. `src/hooks` coordena estado e consultas. `src/domain` reúne regras e validações. `src/services` integra Supabase Auth, CRUD e Realtime. `supabase/migrations` mantém o esquema e as políticas de acesso.

[Especificações](Conexa-specs/README.md) · [Regras de negócio](Conexa-specs/business-rules.md) · [Evidências datadas](Conexa-specs/validation.md) · [Auditoria acadêmica](Conexa-specs/t31-auditoria.md) · [Registro de IA](IA.md) · [Fluxo de desenvolvimento](Conexa-specs/workflow.md)

## Entrega acadêmica

A aplicação é a mesma, com dois envios separados no Teams. As duas tarefas pedem o link do GitHub privado, o ZIP do projeto, o README e o `AI.md`. Front-end Design também pede o link do deploy. Confirme o acesso de escrita dos dois professores ao GitHub. [Guia do pacote de entrega](Conexa-specs/entrega/README.md)

## Empacotar para avaliação

Em uma cópia Git com PowerShell 7.2+:

```powershell
pwsh -NoProfile -File ./scripts/package-delivery.ps1
```

Gera `artifacts/entrega/conexa-t32-t33-t43.zip`, `.zip.sha256` e `auditoria.json`, ignorados pelo Git. Inclui fontes, lockfile, assets, exemplos vazios, testes, migrations, documentação e manifesto SHA-256. Exclui `.git`, `.env` preenchido, dependências, build, banco de cotas e relatórios/capturas locais. Faz inspeção delimitada de tokens e comparação com credenciais locais, e relê cada entrada do ZIP. Detalhes, limites e avaliação em [entrega T32/T33/T43](Conexa-specs/entrega/README.md). Pacote extraído não tem Git; para regenerá-lo, usar o checkout Git. Não enviar arquivos de ambiente junto ao pacote.

## Mapa simulado de Botucatu — Google Maps

O roteiro de exemplo (`/operacoes/exemplo`) e a análise de roteiro em **Entregas e valores** incluem um cenário geográfico de Botucatu (SP), com base, propriedades e restaurante fictícios. Na análise de uma cotação, o cenário reproduz a quantidade de coletas (até seis) e inclui retorno somente quando acordado. Os pontos são inventados, independentes dos endereços cadastrados; não há busca de estabelecimentos reais nem geocodificação dos participantes.

Para habilitar a visualização:

1. No seu projeto Google Cloud, habilite **Maps Embed API**. O Google exige projeto com faturamento habilitado; a documentação consultada em 13/11/2026 informa que o uso desta API é gratuito. Não é necessário habilitar Routes, Places ou Maps JavaScript.
2. Crie uma chave exclusiva da **Maps Embed API**, com restrição de API para esse serviço e restrição de sites (HTTP referrers) para as origens usadas, por exemplo `http://127.0.0.1:5173/*`, `http://localhost:5173/*` e o domínio exato do deploy.
3. Preencha `VITE_GOOGLE_MAPS_EMBED_KEY=` no `.env` local (ou `.env.local`); reinicie o Vite. No deploy, configure a variável antes de gerar um novo build. Nunca versione a chave preenchida.
4. Abra o roteiro e escolha **Abrir mapa simulado**. **Percurso completo** mostra todas as paradas; os outros botões mostram o trecho até cada coleta, entrega ou retorno. Fechar o mapa remove o iframe.

A chave Embed é pública no navegador por definição; use uma chave restrita exclusiva, nunca credencial de servidor. A autorização histórica para manter credenciais de cálculo de rotas no servidor continua aplicável a eventual Routes API; esta integração é somente um iframe Embed. Sem chave, nenhuma requisição ao Maps é iniciada e a lista das paradas permanece disponível. O carregamento acontece somente após o clique; Google recebe as coordenadas fictícias, a chave pública, a origem do site e os dados usuais da conexão. O referrer envia apenas a origem, sem caminho da página. Mapas podem mostrar nomes/POIs reais da base cartográfica, que não representam participantes Conexa.

Não há rastreamento/GPS, alteração do status da operação ou cálculo de frete. Distância e tempo no Google são estimativas para automóveis, não roteamento certificado para caminhões; não incluem coleta/descarga nem confirmam pedágios. O mapa não preenche os campos financeiros ou de distância do roteiro manual. Falha do provedor mantém o roteiro e os controles de recarregar/fechar; por ser um iframe de outra origem, a aplicação não consegue detectar todos os erros de chave exibidos dentro do Google. O evento `load` não é tratado como comprovação de rota válida.

Referências: [integração e parâmetros](https://developers.google.com/maps/documentation/embed/embedding-map), [chave e configuração](https://developers.google.com/maps/documentation/embed/get-api-key), [uso e faturamento](https://developers.google.com/maps/documentation/embed/usage-and-billing).

## Frete automático e previsão de entrega — Google Maps Routes

Preparado em `feature/frete-google-maps`, para avaliação. A nova cotação da transportadora oferece **Calcular com Google Maps** e **Usar estimativa na cotação**. Fórmula escolhida: base + km × tarifa por km + adicionais; piso opcional antes dos adicionais. Tarifas/paradas ficam em branco até preenchimento (informe 0 quando não se aplicarem). Retorno acordado entra no preço, mas não no horário de entrega. A previsão soma saída, direção até o destino e paradas informadas, exibindo São Paulo. Sem trânsito em tempo real, pedágio automático ou restrições para caminhão; revisar serviços/prazo antes da confirmação demo.

1. No Google Cloud, habilitar **Routes API**, faturamento e uma chave exclusiva para servidor, restrita à API e ao IP de saída quando disponível. Definir cotas no Google Cloud antes de testar. Não reutilizar a chave Embed pública.
2. Copiar `.env.routes.example` para `.env.routes` (ignorado pelo Git) e preencher `GOOGLE_MAPS_ROUTES_KEY`. O comando lê também `.env`, reutilizando as variáveis Supabase publicáveis existentes. Nunca usar prefixo `VITE_` na chave Routes ou `service_role` para autenticação.
3. Executar `npm run dev:routes` em outro terminal e `npm run dev` para o frontend. Node 24, como no projeto. Porta padrão do broker 8788; proxy Vite aponta para 127.0.0.1:8788. Se mudar a porta, ajustar o proxy. `CONEXA_ROUTES_ORIGIN` precisa corresponder à origem exata do navegador (`http://localhost:5173` por padrão; 127.0.0.1 ou outra porta são origens distintas).
4. Entrar como transportadora conectada e abrir a nova cotação de uma proposta apta. Preencher saída/horário/retorno, tarifas e minutos totais de paradas; conferir lista de locais e calcular. O broker valida Auth e papel carrier. **Usar estimativa** preenche frete/entrega e desmarca a confirmação; a cotação só é gravada pela confirmação existente, com as validações M3.

Para experimentar sem trocar nomes fictícios por negócios reais, a operação de exemplo da transportadora (`/operacoes/exemplo`) oferece o mesmo cálculo com coordenadas inventadas do mapa Botucatu. O resultado não altera o resumo financeiro de exemplo nem grava cotação. Cadastros demo antigos podem conter só nomes fictícios e não gerar trajeto: o cálculo de uma cotação usa exatamente seus locais, sem substituir silenciosamente pelos pontos ilustrativos. Use endereços roteáveis ou coordenadas nos dados de demonstração antes de testar aquela carga.

Sem chave, broker, sessão ou rota completa, continuar com a cotação manual. Consultas exigem clique, sem repetição automática; editar tarifas recalcula localmente. Uma consulta por participante por vez, 20 por participante/hora e 100 totais/hora no processo demo; reiniciar zera contadores. Isso não limita gasto financeiro: cotas Google continuam necessárias, e mais de 10 intermediárias pode mudar cobrança (máximo técnico: 25). Chave nunca sai no bundle/resposta. Distância/tempo/resposta Google não são persistidos; somente frete/horário revisados entram no contrato demo ao confirmar. Sem migration ou mudança nos fluxos de negociação/revisão de cotação confirmada.

Build Vite é estático: hospedar `dist` sozinho não hospeda o broker. Para implantação, fornecer serviço Node e proxy HTTPS de mesma origem, segredo no servidor, quota compartilhada se houver múltiplos processos, termos e privacidade públicos compatíveis com Google e revisão de cobertura/acesso. Nenhuma credencial, API/faturamento ou implantação foi ativada nesta entrega. Consulta Google real e ponta a ponta Auth/broker/Google permanecem pendentes. Roteiro de teste local: `/tests/ui/freight.html` usa mocks explícitos, sem consulta Google/Supabase.

Fontes oficiais consultadas em 13/11/2026: [Compute Routes e distância/duração](https://developers.google.com/maps/documentation/routes/compute_route_directions), [intermediárias](https://developers.google.com/maps/documentation/routes/intermed_waypoints), [configuração da API/chave](https://developers.google.com/maps/documentation/routes/get-api-key), [uso/cotas/cobrança](https://developers.google.com/maps/documentation/routes/usage-and-billing) e [políticas/atribuição](https://developers.google.com/maps/documentation/routes/policies). Contrato e limites específicos em [frete-google-maps.md](Conexa-specs/frete-google-maps.md).

## Voz opcional e WhatsApp

Voz/GPT-Live está no planejamento futuro desde 13/11/2026 (D032), fora do escopo ativo. T39/T40 preservam broker local Node 24 de instância única, WebRTC/sideband, SQLite e cotas; ambos os switches ficam desligados. Respostas da base existente são texto; não há implantação, Auth/provedor/microfone reais verificados. T42 foi adiada, sem conclusão ou teste pago; [roteiro de voz arquivado](Conexa-specs/voz-manual.md) serve apenas para possível retomada. Texto simulado independe de voz.

`npm run demo:whatsapp` é um demonstrador histórico de terminal em memória, sem envio externo ou gravação no site. T30/WhatsApp foi descontinuada por pedido do usuário (D029) e retirada das tarefas; experimentos preservados são históricos. [Escopo](Conexa-specs/t30-whatsapp.md).
