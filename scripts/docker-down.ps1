$ErrorActionPreference = "Stop"

$tmpRoot = (Resolve-Path "C:\tmp").Path
$target = Join-Path $tmpRoot "bogaap-docker"

if (-not (Test-Path $target)) {
  Write-Host "No staged Docker project found at $target"
  exit 0
}

$resolvedTarget = (Resolve-Path $target).Path
if (-not $resolvedTarget.StartsWith($tmpRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to use unexpected path: $resolvedTarget"
}

$env:COMPOSE_BAKE = "false"
Set-Location $resolvedTarget
docker compose stop
