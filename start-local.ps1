# Royal Guest Garden — démarrage local complet (Docker Desktop requis)
#
#   .\start-local.ps1            base Supabase + site
#   .\start-local.ps1 -Rebuild   reconstruit aussi l'image du site
#
# Base de données : Supabase local (supabase start)  → API :54321, Studio :54323
# Site            : conteneur nginx (docker compose) → http://localhost:3003
# Back-office     : conteneur nginx (docker compose) → http://localhost:3004
param([switch]$Rebuild)

# Les commandes natives écrivent sur stderr : on se fie aux codes de sortie.
Set-Location $PSScriptRoot

docker info --format '{{.ServerVersion}}' *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Docker Desktop ne répond pas : lancez-le puis relancez ce script.' -ForegroundColor Red
    exit 1
}

Write-Host '1/2  Supabase (base de données)...' -ForegroundColor Cyan
supabase start | Out-Null   # (clés locales : supabase status)
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '2/2  Site (nginx)...' -ForegroundColor Cyan
if ($Rebuild) { docker compose up -d --build } else { docker compose up -d }
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ''
Write-Host 'Prêt :' -ForegroundColor Green
Write-Host '  Site        http://localhost:3003'
Write-Host '  Back-office http://localhost:3004'
Write-Host '  Studio  http://127.0.0.1:54323   (contenu, tables)'
Write-Host '  E-mails http://127.0.0.1:54324   (Mailpit : e-mails locaux)'
Write-Host 'Premier compte admin : node tools/create-admin.js prenom.nom@exemple.cm'
