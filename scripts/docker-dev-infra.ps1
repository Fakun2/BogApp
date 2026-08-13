$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$tmpRoot = (Resolve-Path "C:\tmp").Path
$target = Join-Path $tmpRoot "bogaap-docker"

if (Test-Path $target) {
  $resolvedTarget = (Resolve-Path $target).Path
  if (-not $resolvedTarget.StartsWith($tmpRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to sync unexpected path: $resolvedTarget"
  }
}

New-Item -ItemType Directory -Force -Path $target | Out-Null

$excludeDirs = @(
  ".git",
  "node_modules",
  ".turbo",
  ".next",
  "dist",
  "coverage"
)

$excludeFiles = @(
  ".env",
  "*.log"
)

$robocopyArgs = @(
  $repoRoot,
  $target,
  "/MIR",
  "/XD"
) + $excludeDirs + @("/XF") + $excludeFiles + @("/NFL", "/NDL", "/NJH", "/NJS", "/NP")

& robocopy @robocopyArgs | Out-Null
$robocopyExitCode = $LASTEXITCODE
if ($robocopyExitCode -gt 7) {
  throw "robocopy failed with exit code $robocopyExitCode"
}

$env:COMPOSE_BAKE = "false"
Set-Location $target

docker compose up -d postgres redis
docker compose stop api web nginx
