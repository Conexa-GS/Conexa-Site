# Critérios de aceite e rastreabilidade

Estes cenários são a especificação da verificação futura. Nenhum está marcado como executado neste pacote.

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
