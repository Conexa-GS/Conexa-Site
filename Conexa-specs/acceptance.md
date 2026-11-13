# Critérios de aceite e rastreabilidade

Estes cenários definem resultados esperados; execução técnica e aceite humano são registrados separadamente em [validation.md](validation.md) e [estado-atual.md](estado-atual.md). A existência de um critério não comprova sua execução completa.

| ID | Cenário e resultado esperado | Requisito / regras | Marco |
| --- | --- | --- | --- |
| AC01 | Produtor cria oferta válida; após recarregar e trocar para comprador, oferta permanece visível | RF01 / RN01–04 | M1 |
| AC02 | Quantidade zero/negativa, preço abaixo do mínimo, campo ausente e datas invertidas impedem gravação e explicam correção | RF01 / RN02–05 | M1 |
| AC03 | Editar oferta muda a lista; excluir oferta sem vínculos remove do banco; outro participante não pode alterar via requisição direta | RF01 / RN01,06; RNF04 | M1 |
| AC04 | Banco indisponível mostra erro e preserva formulário; não informa sucesso falso; lista vazia tem orientação | RNF03 | M1 |
| AC05 | Demanda 50 kg encontra 30 kg Ana + 25 kg João, mesma unidade e prazo; seleciona 30+20 e deixa 5 livres | RF02–04 / RN07–14 | M2 |
| AC06 | Oferta de 10 caixas sem peso/conversão não atende automaticamente demanda de 50 kg; insuficiência é explícita | RF03 / RN05,09 | M2 |
| AC07 | Duas propostas simultâneas para o último saldo não conseguem ambas reservar; falha não deixa reservas parciais | RF04 / RN12–14 | M2 |
| AC08 | Recusa/expiração/cancelamento libera reserva; estoque nunca é descontado duas vezes na conversão para compromisso | RF04 / RN13–14 | M2/M5 |
| AC09 | Editar cadastro vinculado preserva preços acordados; excluir orienta arquivar | RF01 / RN06,36 | M2 |
| AC10 | Produtor indica amigo e preço; só perfil desse transportador confirma a cotação | RF05–06 / RN20–21 | M3 |
| AC11 | Veículo insuficiente, peso desconhecido ou conservação incompatível impede aprovação; cotação vencida não confirma | RF06–08 / RN21–24,33 | M3 |
| AC12 | Ana R$150 + João R$100 + frete R$80 = comprador R$330; mínimos R$120/R$90 preservados; taxa zero | RF07 / RN29–35 | M3 |
| AC13 | Desconto hipotético que deixa João abaixo do mínimo bloqueia; resultado favorável de Ana não compensa | RF07 / RN31–35 | M3 |
| AC14 | Adicionar coleta invalida cotação/aceites anteriores e solicita revisão; sem alterações silenciosas | RF08 / RN23,36 | M3/M4 |
| AC15 | Composição inclusiva mostra produtor menos atendido e diferença real de custo; sem cotação não alega menor frete | RF07 / RN15–19 | M4 |
| AC16 | Rota inclui todas as paradas; pedágio desconhecido fica “a confirmar”; frete fechado não soma pedágio novamente | RF07 / RN25–28 | M4 |
| AC17 | Falha de rotas permite cotação manual, mas não inventa km/tempo; simulação explícita se ativada | RNF07 / RN28 | M4 |
| AC18 | Pagamento recusado/pendente não agenda; aprovado agenda uma vez; repetição não duplica pagamento/compromisso | RF09 / RN38,43 | M5 |
| AC19 | Cancelar antes do transporte libera estoque e gera no máximo um estorno; após início abre ocorrência | RF10 / RN40 | M5 |
| AC20 | Entrega com divergência segura repasses; recebimento resolvido produz uma parcela por beneficiário, uma única vez | RF10 / RN41–44 | M5 |
| AC21 | Ações fora de ordem e por perfil indevido são rejeitadas pelo banco/servidor; status permanece consistente | RF08–10 / RN36–44 | M2+ |
| AC22 | Chat mostra prévia e pede confirmação; sem confirmação não grava; mesmos controles do formulário | RF11 / RN45 | M6 |
| AC23 | Fluxos principais usáveis por teclado e em 360 px; erro não depende só de cor; simulações identificadas | RNF01–03,07 | Todos |

## Estratégia de verificação

### Conversas no site — critérios e evidências

Estado vigente em 12/11: AC24–AC30 têm evidências técnicas de texto/DM locais e remotas somadas nas rodadas autorizadas e D025; rede física ainda aberta em T41. AC23 tem revisão dirigida de Conversas, sem auditoria completa/global; AC31 é parcial e AC32 só simulado, com execução real em T42. T43/aceite M6 continua pendente.

Histórico da primeira fatia de 11/11/2026: AC24/AC23 verificados no escopo da bancada local de Conversas; mensagens/isolamento/reenvio têm evidências parciais de componente e PGlite para AC25/26/29/30. Critérios remotos, comandos do bot e voz continuam pendentes; não ampliam o aceite de T29 nem encerram M6. Detalhes e limites em [validation.md](validation.md) e [conversas-site.md](conversas-site.md).

| ID | Cenário e resultado esperado | Requisito / regras | Tarefas |
| --- | --- | --- | --- |
| AC24 | Produtor e comprador abrem Conversas, distinguem bot de pessoas e navegam lista/conversa em 360 px/desktop por teclado, sem sugerir WhatsApp conectado | RF11–12 / RNF01–03,07 | T34, T41 |
| AC25 | Mensagem chega a outra sessão membro, persiste após F5, reenvio/reconexão não duplica e não lidas/leitura se reconciliam | RF12 / RNF03–04 | T35, T38, T41 |
| AC26 | Terceiro/anônimo não lê/envia mensagens, forja remetente, entra em conversa alheia ou recebe eventos privados; troca de conta limpa histórico/assinaturas/voz. Contas demo não recebem dados pessoais reais | RF11–12 / RN01,45–46; RNF04 | T35, T38, T40–T41 |
| AC27 | Produtor cria/edita/arquiva oferta própria pelo bot; perguntas resolvem oferta/quantidade ambíguas; prévia mostra antes/depois; cancelar/não confirmar não muda catálogo; confirmar mostra dado persistido também ao comprador | RF01,11 / RN01–06,45 | T36–T37, T41 |
| AC28 | Comprador/outro produtor não altera oferta alheia; mínimo, unidades, coleta, datas, reservas/compromissos e snapshots mantêm as regras do formulário/banco. Modelo não contorna permissão nem confirma por fala incidental | RF01,11 / RN01–06,13–14,29,36,45 | T36–T37, T39, T41 |
| AC29 | Correção/edição concorrente invalida prévia antiga; confirmação duplicada ou timeout com reconciliação aplica comando no máximo uma vez. Falha preserva rascunho e não anuncia sucesso | RF11 / RN45; RNF03,05 | T35–T37, T41 |
| AC30 | Produtor conversa com produtor/comprador sobre acordo; mensagem humana não chama bot nem muda oferta/estoque/preço/reserva/aceite. Formalização é orientada ao fluxo atual | RF12 / RN04,12–14,33,36,45 | T38, T41 |
| AC31 | Modo simulado funciona sem chave/API paga. Modo OpenAI exige ação/configuração explícitas, endpoint autenticado e limites no servidor; chave permanente ausente do bundle/logs. Abrir aba/CI/reconectar não inicia consumo | RF11 / RN45; RNF04 | T39–T42 |
| AC32 — adiado, planejamento futuro (D032) | Critério preservado para eventual retomada: usuário testa voz real com microfone consentido, transcrição corrigível, prévia/confirmar/cancelar e encerramento ao sair/trocar conta/atingir limite; falhas mantêm alternativa por texto. Resultado real só por relato/evidência do usuário. Fora do aceite atual de texto/DM | RF11 / RN45; RNF02–04,07 | T40/T42 arquivadas como escopo de voz; sem conclusão real |

Atualização de escopo em **13/11/2026 (D032)**: voz/GPT-Live guardada no planejamento futuro. AC31 conserva como requisito ativo o funcionamento por texto sem chave/API paga; sua parte de integração paga e AC32 ficam adiadas, fora do aceite atual de texto/DM em T43/M6. T42 não foi concluída e não bloqueia esse aceite. Texto/DM e voz têm evidências separadas; mocks não comprovam custo, áudio ou sessão real. O schema de texto/DM já foi aplicado com autorização em 11/11; não reaplicá-lo. Os relatos de voz abaixo são históricos.

Evidência local adicional — 11/11/2026, D021/T39/T40: configuração desligada, endpoint autenticado simulado, cotas SQLite duráveis, controle de duração/respostas, cleanup/tardios e proposta sem escrita exercitados em testes; painel revisto em desktop/360 px/teclado. AC31 tem evidência local, AC32 somente comportamento simulado. Nenhuma sessão OpenAI, permissão de microfone ou teste de voz real pelo agente. Supabase Auth do broker e sideband/hangup reais dependem de configuração/testes do usuário; T42 e rede física de T41 continuam pendentes; T35/T38 foram verificadas tecnicamente nas rodadas posteriores de texto/DM. Roteiro em [voz-manual.md](voz-manual.md), resultados em validation.md.

### Métodos

- Testes unitários para cálculos monetários, mínimo individual, compatibilidade e transições relevantes.
- Testes de integração do banco para RLS, reserva concorrente e idempotência antes de concluir os marcos respectivos.
- Verificação de interface do fluxo principal com Supabase real de demonstração; não tratar mocks como prova de persistência remota.
- Smoke test do deploy com usuário fictício, sem expor segredos em logs ou screenshots.
- Registrar comando/procedimento, resultado real e limitações no README/relatório de implementação.

## Conferência acadêmica antes da entrega

- Oito componentes úteis, useState/useEffect e dois hooks personalizados reais.
- CRUD remoto executado; lógica e acesso separados da apresentação.
- 15 commits significativos produzidos durante o desenvolvimento.
- README, AI.md, ZIP, repo privado, acesso de escrita aos professores e deploy.
- Envios separados para Web e Front-end, com links testados.
