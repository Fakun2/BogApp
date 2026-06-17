param(
  [switch]$DryRun,
  [string]$Repo = "Fakun2/BogApp",
  [string]$SeedPath = "docs/github/scripts/issues.seed.json"
)

$ErrorActionPreference = "Stop"
$Report = [System.Collections.Generic.List[string]]::new()
$IssueMap = @{}

function Write-Step([string]$Message) {
  $prefix = if ($DryRun) { "[DRYRUN]" } else { "[RUN]" }
  Write-Host "$prefix $Message"
  $Report.Add("$prefix $Message") | Out-Null
}

function Invoke-Gh([string[]]$Args, [switch]$AllowFail) {
  $cmd = "gh " + ($Args -join " ")
  if ($DryRun) {
    Write-Step $cmd
    return ""
  }
  Write-Step $cmd
  $output = & gh @Args 2>&1
  if ($LASTEXITCODE -ne 0 -and -not $AllowFail) {
    throw ($output -join "`n")
  }
  return ($output -join "`n")
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI 'gh' no está instalado o no está en PATH."
}
Write-Step "GitHub CLI detectado."

$auth = & gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  throw "gh auth status falló. Ejecutá gh auth login antes de continuar."
}
Write-Step "Autenticación gh validada. Si GitHub Project falla por permisos, ejecutá: gh auth refresh -s project"

if (-not (Test-Path $SeedPath)) {
  throw "No existe seed JSON: $SeedPath"
}
$Seed = Get-Content $SeedPath -Raw | ConvertFrom-Json
$Issues = @($Seed.issues)
if ($Issues.Count -ne 80) {
  throw "El seed debe contener exactamente 80 issues; contiene $($Issues.Count)."
}
Write-Step "Seed cargado con exactamente 80 issues."

$priorities = @("P0","P1","P2","P3")
$phases = @("M0","M1","M2","M3","M4","M5","M6","M7","M8","M9","M10")
$areas = $Issues | Select-Object -ExpandProperty area -Unique
$types = $Issues | Select-Object -ExpandProperty type -Unique
$sizes = @("S","M","L")

foreach ($p in $priorities) { Invoke-Gh @("label","create","priority:$p","--repo",$Repo,"--color","B60205","--description","Priority $p") -AllowFail }
foreach ($p in $phases) { Invoke-Gh @("label","create","phase:$p","--repo",$Repo,"--color","1D76DB","--description","Phase $p") -AllowFail }
foreach ($a in $areas) { Invoke-Gh @("label","create","area:$a","--repo",$Repo,"--color","0E8A16","--description","Area $a") -AllowFail }
foreach ($t in $types) { Invoke-Gh @("label","create","type:$t","--repo",$Repo,"--color","5319E7","--description","Type $t") -AllowFail }
foreach ($s in $sizes) { Invoke-Gh @("label","create","size:$s","--repo",$Repo,"--color","FBCA04","--description","Size $s") -AllowFail }

$milestones = $Issues | Select-Object milestone,startDate,targetDate -Unique
foreach ($m in $milestones) {
  Invoke-Gh @("api","repos/$Repo/milestones","-f","title=$($m.milestone)","-f","due_on=$($m.targetDate)T23:59:59Z") -AllowFail
}

foreach ($issue in $Issues) {
  $code = $issue.code
  $existing = Invoke-Gh @("issue","list","--repo",$Repo,"--search",$code,"--state","all","--json","number,title","--jq",".[0].number") -AllowFail
  if ($existing -and $existing.Trim()) {
    $IssueMap[$code] = [int]$existing.Trim()
    Write-Step "$code ya existe como issue #$($IssueMap[$code]); se evita duplicado."
    continue
  }

  $bodyPath = "docs/github/issues/$code.md"
  $labels = @("priority:$($issue.priority)","phase:$($issue.phase)","area:$($issue.area)","type:$($issue.type)","size:$($issue.size)") -join ","
  $created = Invoke-Gh @("issue","create","--repo",$Repo,"--title","$code — $($issue.title)","--body-file",$bodyPath,"--milestone","$($issue.milestone)","--label",$labels,"--json","number","--jq",".number") -AllowFail
  if ($created -and $created.Trim()) { $IssueMap[$code] = [int]$created.Trim() }
}

Write-Step "Mapa BOG a issue real:"
foreach ($key in ($IssueMap.Keys | Sort-Object)) { Write-Step "$key -> #$($IssueMap[$key])" }

foreach ($issue in $Issues) {
  if (-not $IssueMap.ContainsKey($issue.code)) { continue }
  $depNumbers = @($issue.dependsOn | ForEach-Object { if ($IssueMap.ContainsKey($_)) { "#" + $IssueMap[$_] } else { $_ } })
  $blockNumbers = @($issue.blocks | ForEach-Object { if ($IssueMap.ContainsKey($_)) { "#" + $IssueMap[$_] } else { $_ } })
  $comment = "Dependencias reales: " + (($depNumbers -join ", ") -replace "^$","Ninguna") + "`nBloquea: " + (($blockNumbers -join ", ") -replace "^$","Ninguna")
  Invoke-Gh @("issue","comment","$($IssueMap[$issue.code])","--repo",$Repo,"--body",$comment) -AllowFail
}

$reportPath = "docs/github/scripts/setup-github-management.report.md"
$Report | Set-Content -Path $reportPath -Encoding UTF8
Write-Step "Reporte final generado en $reportPath"
