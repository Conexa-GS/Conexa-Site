# Entrega para avaliação — T32/T33/T43

Escopo atualizado em **13/11/2026 (D032)**: voz/GPT-Live guardada no planejamento futuro, sem prazo; T42 adiada e fora da avaliação atual de texto/DM em T43/M6. Base opcional e evidências preservadas. As referências anteriores a voz pendente descrevem a entrega original; esta revisão documental não regenerou o ZIP.

Preparada em **12/11/2026**, pelo Codex, na `feature/t32-t33-t43-entrega`, criada da `dev` em `17d2684`. Este pacote apresenta o checkout para avaliação; não registra aprovação, deploy ou envio acadêmico.

| Artefato | Finalidade |
| --- | --- |
| [README reproduzível](../../README.md) | Instalação limpa, configuração opcional, comandos e modos de demonstração |
| [Matriz de verificações](matriz-verificacoes.md) | Critérios, procedimentos, responsáveis, ambientes, resultados e limites; aceite humano separado |
| [Limitações e pendências](limitacoes.md) | O que continua sem prova ou depende de decisão/ação humana |
| [Roteiro de demonstração](roteiro-demonstracao.md) | Percurso local sem segredos e percurso conectado opcional, com efeitos explícitos |
| [Empacotador](../../scripts/package-delivery.ps1) | Seleção de fontes, inspeção de credenciais, manifesto e releitura do ZIP |
| [Registro desta verificação](../validation.md#t32t33t43--artefatos-para-avaliação--12112026) | Resultados efetivamente obtidos nesta preparação |

## Gerar e conferir o ZIP

Pré-requisitos: Git e PowerShell **7.2+**. Na raiz do checkout ou da cópia Git:

```powershell
pwsh -NoProfile -File ./scripts/package-delivery.ps1
Get-FileHash ./artifacts/entrega/conexa-t32-t33-t43.zip -Algorithm SHA256
Get-Content ./artifacts/entrega/conexa-t32-t33-t43.zip.sha256
```

Saídas locais, ignoradas pelo Git: `artifacts/entrega/conexa-t32-t33-t43.zip`, seu `.sha256` e `auditoria.json`. O ZIP contém uma pasta `Conexa-Site/` com fontes, lockfile, assets locais, exemplos vazios, testes, migrations e documentação; `ENTREGA.json` identifica Git HEAD/branch e pendências, e `MANIFEST.sha256` identifica todos os outros arquivos. O manifesto não inclui o próprio hash, para evitar circularidade. O checkout pode ter alterações locais: os hashes, e não somente o commit base, definem o conteúdo entregue.

O script seleciona arquivos Git rastreados e novos não ignorados, limitados a caminhos/extensões permitidos; exclui `.git`, configurações `.env` preenchidas, `node_modules`, builds, relatórios/capturas locais, caches e banco de cotas de voz. Verifica exemplos com campos de credenciais vazios, padrões de tokens/chaves privadas/URLs com senha e correspondências com credenciais de arquivos `.env*` locais da raiz com pelo menos oito caracteres. Há uma única exceção literal para a URL sintética `user:pass` do teste negativo de configuração, restrita ao seu arquivo de teste; os demais padrões continuam bloqueados. Interrompe ao encontrar suspeita, sem imprimir valores. Binários locais permitidos são imagens do projeto; não recebem inspeção semântica de metadados ou esteganografia. É uma verificação delimitada, não certificação de ausência universal de segredos.

Antes de substituir a saída fixa, relê cada entrada do novo ZIP e compara hashes/contagem/caminhos com a seleção. Mesmos arquivos, branch e Git HEAD produzem bytes iguais no ambiente verificado; alterar documentos/commits exige gerar novamente. O script não depende de npm, não inicia o site, não acessa o Supabase nem chama API paga. O ZIP extraído permite instalar/executar, mas regenerá-lo exige uma cópia Git, pois o histórico é deliberadamente excluído.

## Avaliação e aceite a registrar

T32 fica **parcial**: README e pacote local preparados; privacidade/acesso de escrita dos professores, deploy e links finais não foram comprovados. T33 tem a matriz entregue para avaliação, sem transformar critérios com ressalva em aceites. T43 tem a consolidação e o roteiro preparados; avaliação/aceite M6 de texto/DM e rede física/T41 permanecem abertos. Voz/T42 adiada para uma etapa futura (D032), sem bloquear esse aceite. O aceite M5 é independente.

O avaliador pode registrar sua decisão neste formato, sem preencher como resultado antes de executar:

| Data / avaliador | Escopo avaliado | Ambiente / evidência | Resultado observado | Aceite explícito / ressalvas |
| --- | --- | --- | --- | --- |
| Pendente | T32/T33/T43, texto/DM, M5 ou M6 — indicar qual | Pendente | Pendente | Pendente |

Publicar a feature e integrá-la na `dev` depende de autorização após esta avaliação, conforme [workflow.md](../workflow.md#branches-e-avaliação). Essa autorização não significa promoção à `main`, deploy ou aceite M5/M6. Voz está fora do escopo ativo (D032); não declarar AC32 real aprovado.
