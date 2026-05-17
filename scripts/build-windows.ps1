Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Push-Location (Split-Path -Parent $PSScriptRoot)
try {
    go build -o speedband.exe ./cmd/speedband
    Write-Host "Built speedband.exe"
}
finally {
    Pop-Location
}
