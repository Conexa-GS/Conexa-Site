#requires -Version 7.2
<#
Empacota somente fontes selecionados, sem carregar .env ou executar serviços.
Saída fixa ignorada pelo Git: artifacts/entrega/. Execute na cópia do projeto.
#>
$ErrorActionPreference = 'Stop'
$repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$outputDir = Join-Path $repoRoot 'artifacts/entrega'
$archivePath = Join-Path $outputDir 'conexa-t32-t33-t43.zip'
$temporaryPath = "$archivePath.partial"
$utf8 = [Text.UTF8Encoding]::new($false)
function Get-Digest([byte[]] $Bytes) {
    return [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($Bytes)).ToLowerInvariant()
}
function Assert-NoLink([string] $FullPath) {
    $current = Get-Item -LiteralPath $FullPath -Force
    while ($current.FullName -ne $repoRoot) {
        if ($current.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Link/reparse point rejeitado no pacote.' }
        $current = if ($current -is [IO.FileInfo]) { $current.Directory } else { $current.Parent }
        if (-not $current) { throw 'Caminho fora do projeto.' }
    }
}

Push-Location $repoRoot
try {
    $head = git rev-parse HEAD
    if ($LASTEXITCODE -ne 0) { throw 'Git HEAD indisponível.' }
    $branch = git branch --show-current
    if ($LASTEXITCODE -ne 0) { throw 'Branch indisponível.' }
    # Inclui arquivos novos permitidos; nunca copia diretórios inteiros ou o histórico Git.
    $candidates = @(git -c core.quotepath=false ls-files --cached --others --exclude-standard)
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao inventariar fontes.' }
    $rootFiles = @('.env.example', '.env.voice.example', '.gitignore', 'AGENTS.md', 'AI.md', 'IA.md', 'README.md', 'package.json', 'package-lock.json', 'eslint.config.js', 'vite.config.js', 'index.html')
    $examples = @('.env.example', '.env.voice.example', 'server/whatsapp/.env.example')
    $textExtensions = @('.md', '.js', '.jsx', '.mjs', '.css', '.html', '.sql', '.json', '.svg', '.ps1')
    $mediaExtensions = @('.png', '.gif', '.webp')
    $files = [Collections.Generic.SortedDictionary[string, byte[]]]::new([StringComparer]::Ordinal)
    $excluded = 0
    $secretValues = [Collections.Generic.List[string]]::new()
    # Defesa adicional: procura valores de credenciais locais sem imprimi-los/copiar o ambiente.
    foreach ($config in Get-ChildItem -LiteralPath $repoRoot -Force -File -Filter '.env*') {
        if ($config.Name.EndsWith('.example')) { continue }
        foreach ($line in [IO.File]::ReadAllLines($config.FullName)) {
            if ($line -match '^\s*(?:export\s+)?[A-Z0-9_]*(?:PASSWORD|TOKEN|SECRET|KEY)\s*=\s*(.*?)\s*$') {
                $value = $Matches[1].Trim().Trim('"', "'")
                if ($value.Length -ge 8) { $secretValues.Add($value) }
            }
        }
    }
    $tokenPattern = '(?i)(?:sk-(?:proj-|svcacct-)?[a-z0-9_-]{20,}|sb_secret_[a-z0-9_-]{12,}|(?:gh[pousr]_|github_pat_)[a-z0-9_]{20,}|eyJ[a-z0-9_-]{12,}\.[a-z0-9_-]{12,}\.[a-z0-9_-]{12,}|-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----|https?://[^\s/:@]+:[^\s/@]+@)'
    foreach ($relative in $candidates) {
        if ($relative -match '(^|/)(?:\.git|node_modules|dist|dist-ssr|artifacts|\.cache|\.voice-data|\.temp)(/|$)' -or $relative -match '(?:\.local(?:\.|$)|\.(?:log|zip|sqlite|db|pem|pfx|key)$)' -or ($relative -match '(^|/)\.env(?:\.|$)' -and $relative -notin $examples)) { $excluded++; continue }
        $extension = [IO.Path]::GetExtension($relative)
        $allowed = $relative -in $rootFiles -or $relative -in $examples -or ($relative -match '^(?:Conexa-specs|src|public|server|supabase|tests|scripts)/' -and ($extension -in $textExtensions -or ($relative -match '^(?:public|src/assets)/' -and $extension -in $mediaExtensions)))
        if (-not $allowed) { $excluded++; continue }
        $full = [IO.Path]::GetFullPath((Join-Path $repoRoot $relative))
        if (-not $full.StartsWith($repoRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Caminho fora do projeto.' }
        Assert-NoLink $full
        $bytes = [IO.File]::ReadAllBytes($full)
        if ($extension -in $textExtensions -or $relative -in $examples -or $relative -eq '.gitignore') {
            $content = $utf8.GetString($bytes)
            foreach ($match in [regex]::Matches($content, $tokenPattern)) {
                # Única exceção: URL literal sintética do teste negativo de configuração.
                if ($relative -eq 'tests/conversations-demo-config.test.js' -and $match.Value -ceq ('https://' + 'user:pass@')) { continue }
                throw "Possível segredo em $relative; pacote não publicado. Nenhum valor foi impresso."
            }
            foreach ($value in $secretValues) {
                if ($content.Contains($value)) { throw "Credencial local encontrada em $relative; pacote não publicado. Nenhum valor foi impresso." }
            }
            if ($relative -in $examples) {
                foreach ($line in $content -split '\r?\n') {
                    if ($line -match '^\s*([A-Z0-9_]*(?:PASSWORD|TOKEN|SECRET|KEY))\s*=\s*(.*)$' -and $Matches[2].Trim()) { throw "Exemplo com credencial preenchida: $relative." }
                }
            }
        }
        $files.Add($relative, $bytes)
    }
    foreach ($required in @('README.md', 'IA.md', 'AI.md', 'package.json', 'package-lock.json', '.env.example', '.env.voice.example', 'scripts/package-delivery.ps1', 'Conexa-specs/entrega/README.md', 'Conexa-specs/entrega/matriz-verificacoes.md', 'Conexa-specs/entrega/limitacoes.md', 'Conexa-specs/entrega/roteiro-demonstracao.md')) {
        if (-not $files.ContainsKey($required)) { throw "Arquivo obrigatório ausente: $required" }
    }
    $snapshot = [ordered]@{ format = 1; git_head = "$head"; branch = "$branch"; source = 'checkout selecionado, incluindo alterações locais; hashes identificam o conteúdo'; pending = @('aceite humano M5/M6 e entrega', 'T41 rede física', 'T42 voz real', 'repo/permissões/deploy/envios acadêmicos', 'saneamento histórico IA.md'); source_files = $files.Count }
    $files.Add('ENTREGA.json', $utf8.GetBytes(($snapshot | ConvertTo-Json -Depth 4) + "`n"))
    $manifest = ($files.GetEnumerator() | ForEach-Object { "$(Get-Digest $_.Value)  $($_.Key)" }) -join "`n"
    $files.Add('MANIFEST.sha256', $utf8.GetBytes($manifest + "`n"))
    # Sem timestamp de execução: mesmos bytes, Git HEAD e branch geram o mesmo ZIP.
    [IO.Directory]::CreateDirectory($outputDir) | Out-Null
    Assert-NoLink $outputDir
    foreach ($target in @($archivePath, $temporaryPath, "$archivePath.sha256", (Join-Path $outputDir 'auditoria.json'))) {
        if (Test-Path -LiteralPath $target) { Assert-NoLink $target }
    }
    $stream = [IO.File]::Open($temporaryPath, [IO.FileMode]::Create, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
    try {
        $zip = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create, $true)
        try {
            foreach ($file in $files.GetEnumerator()) {
                $entry = $zip.CreateEntry("Conexa-Site/$($file.Key)", [IO.Compression.CompressionLevel]::Optimal)
                $entry.LastWriteTime = [DateTimeOffset]::new(1980, 1, 1, 0, 0, 0, [TimeSpan]::Zero)
                $entryStream = $entry.Open()
                try { $entryStream.Write($file.Value, 0, $file.Value.Length) } finally { $entryStream.Dispose() }
            }
        } finally { $zip.Dispose() }
    } finally { $stream.Dispose() }
    $zip = [IO.Compression.ZipFile]::OpenRead($temporaryPath)
    try {
        if ($zip.Entries.Count -ne $files.Count) { throw 'Contagem do ZIP divergente.' }
        $seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
        foreach ($entry in $zip.Entries) {
            $relative = $entry.FullName.Substring('Conexa-Site/'.Length)
            if (-not $entry.FullName.StartsWith('Conexa-Site/') -or -not $files.ContainsKey($relative) -or -not $seen.Add($relative)) { throw 'Entrada inesperada ou duplicada no ZIP.' }
            $entryStream = $entry.Open()
            $buffer = [IO.MemoryStream]::new()
            try { $entryStream.CopyTo($buffer); $digest = Get-Digest $buffer.ToArray() } finally { $entryStream.Dispose(); $buffer.Dispose() }
            if ($digest -ne (Get-Digest $files[$relative])) { throw "Hash divergente: $relative" }
        }
    } finally { $zip.Dispose() }
    [IO.File]::Move($temporaryPath, $archivePath, $true)
    $archiveHash = Get-Digest ([IO.File]::ReadAllBytes($archivePath))
    [IO.File]::WriteAllText("$archivePath.sha256", "$archiveHash  conexa-t32-t33-t43.zip`n", $utf8)
    $audit = [ordered]@{ status = 'passed'; entries = $files.Count; excluded_candidates = $excluded; zip_sha256 = $archiveHash; zip_bytes = (Get-Item -LiteralPath $archivePath).Length; secret_scan = 'seleção de caminhos, exemplos vazios, padrões de tokens e comparação com credenciais locais >=8 caracteres; sem garantia de detecção universal'; archive_readback = 'todas as entradas relidas e hashes comparados'; git_head = "$head"; branch = "$branch" }
    [IO.File]::WriteAllText((Join-Path $outputDir 'auditoria.json'), ($audit | ConvertTo-Json) + "`n", $utf8)
    Write-Output ($audit | ConvertTo-Json)
} finally { Pop-Location }
