# ============================================
# OpenClaw Operations Script
# Single entry point for all OpenClaw management
# ============================================
#
# Usage:
#   .\openclaw-ops.ps1 status       - Show current API status + active config
#   .\openclaw-ops.ps1 validate     - Test all API keys (Ollama + Gemini)
#   .\openclaw-ops.ps1 switch <alias> - Switch Ollama Cloud account + sync + restart
#   .\openclaw-ops.ps1 sync         - Sync all configs (openclaw.json → agent configs)
#   .\openclaw-ops.ps1 restart      - Stop + start gateway with env loaded
#   .\openclaw-ops.ps1 fix          - Full recovery: validate → pick best → switch → sync → restart
#   .\openclaw-ops.ps1 doctor       - Run openclaw doctor with env loaded

param(
    [Parameter(Position=0)]
    [ValidateSet('status','validate','switch','sync','restart','fix','doctor','help')]
    [string]$Action = 'help',

    [Parameter(Position=1, ValueFromRemainingArguments=$true)]
    [string[]]$ExtraArgs
)

$ErrorActionPreference = "Continue"
$OPENCLAW_ROOT = "$env:USERPROFILE\.openclaw"
$WORKSPACE = "$OPENCLAW_ROOT\workspace"

# Load .env into current process
function Load-Env {
    $envFile = Join-Path $OPENCLAW_ROOT ".env"
    if (Test-Path $envFile) {
        Get-Content $envFile | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith('#')) {
                if ($line -match '^([^=]+)=(.*)$') {
                    $key = $matches[1].Trim()
                    $value = $matches[2].Trim() -replace '^[''"]|[''"]$', ''
                    Set-Item -Path "env:$key" -Value $value
                }
            }
        }
    }
}

function Show-Header {
    Write-Host ""
    Write-Host "  OpenClaw Operations" -ForegroundColor Cyan
    Write-Host "  ===================" -ForegroundColor DarkCyan
    Write-Host ""
}

function Show-Help {
    Show-Header
    Write-Host "  Usage: .\openclaw-ops.ps1 <action> [args]" -ForegroundColor White
    Write-Host ""
    Write-Host "  Actions:" -ForegroundColor Yellow
    Write-Host "    status      Show current active config + API key status"
    Write-Host "    validate    Test all API keys (Ollama Cloud + Gemini)"
    Write-Host "    switch <a>  Switch Ollama account (glass, glass-2..4, glass-5, brudda)"
    Write-Host "    sync        Sync openclaw.json to all agent configs"
    Write-Host "    restart     Stop + start gateway with .env loaded"
    Write-Host "    fix         Full auto-recovery: validate, switch, sync, restart"
    Write-Host "    doctor      Run openclaw doctor with .env loaded"
    Write-Host "    help        Show this help"
    Write-Host ""
    Write-Host "  Examples:" -ForegroundColor Yellow
    Write-Host "    .\openclaw-ops.ps1 fix              # One-command full recovery"
    Write-Host "    .\openclaw-ops.ps1 switch glass-3    # Switch to glass-3 account"
    Write-Host "    .\openclaw-ops.ps1 validate          # Check which keys work"
    Write-Host ""
}

function Do-Status {
    Show-Header
    Load-Env

    Write-Host "  Active Configuration:" -ForegroundColor Yellow

    # Read openclaw.json for active key
    $configPath = Join-Path $OPENCLAW_ROOT "openclaw.json"
    if (Test-Path $configPath) {
        $config = Get-Content $configPath -Raw | ConvertFrom-Json
        $activeKey = $config.models.providers.'ollama-cloud'.apiKey
        $primary = $config.agents.defaults.model.primary
        $fallbacks = $config.agents.defaults.model.fallbacks -join ", "
        $gwMode = $config.gateway.mode
        $gwPort = $config.gateway.port

        # Match active key to account name
        $accounts = @{
            $env:OLLAMA_GLASS_API_KEY = "glass"
            $env:OLLAMA_GLASS_API_KEY_2 = "glass-2"
            $env:OLLAMA_GLASS_API_KEY_3 = "glass-3"
            $env:OLLAMA_GLASS_API_KEY_4 = "glass-4"
            $env:OLLAMA_GLASS_API_KEY_5 = "glass-5"
            $env:OLLAMA_GLASS_API_KEY_6 = "brudda"
        }
        $activeAccount = "unknown"
        foreach ($key in $accounts.Keys) {
            if ($key -eq $activeKey) {
                $activeAccount = $accounts[$key]
                break
            }
        }

        Write-Host "    Ollama Cloud account: $activeAccount" -ForegroundColor Green
        Write-Host "    Active key: $($activeKey.Substring(0,12))..."
        Write-Host "    Primary model: $primary"
        Write-Host "    Fallbacks: $fallbacks"
        Write-Host "    Gateway: mode=$gwMode port=$gwPort"
    }

    Write-Host ""

    # Check agent configs
    Write-Host "  Agent Configs:" -ForegroundColor Yellow
    $agentsDir = Join-Path $OPENCLAW_ROOT "agents"
    if (Test-Path $agentsDir) {
        Get-ChildItem $agentsDir -Directory | ForEach-Object {
            $modelsFile = Join-Path $_.FullName "agent\models.json"
            if (Test-Path $modelsFile) {
                $models = Get-Content $modelsFile -Raw | ConvertFrom-Json
                $agentKey = $models.providers.'ollama-cloud'.apiKey
                if ($agentKey) {
                    $match = if ($agentKey -eq $activeKey) { " (in sync)" } else { " (OUT OF SYNC!)" }
                    $color = if ($agentKey -eq $activeKey) { "Green" } else { "Red" }
                    Write-Host "    $($_.Name): $($agentKey.Substring(0,12))...$match" -ForegroundColor $color
                } else {
                    Write-Host "    $($_.Name): no ollama-cloud provider" -ForegroundColor DarkGray
                }
            }
        }
    }
    Write-Host ""
}

function Do-Validate {
    Show-Header
    Load-Env
    Write-Host "  Running API key validation..." -ForegroundColor Yellow
    Write-Host ""
    Push-Location $WORKSPACE
    node skills/ollama-cloud-rotator/validate-keys.js
    Write-Host ""
    node skills/ollama-cloud-rotator/validate-gemini.js
    Pop-Location
}

function Do-Switch {
    param([string]$Alias)
    if (-not $Alias) {
        Write-Host "  Usage: .\openclaw-ops.ps1 switch <alias>" -ForegroundColor Red
        Write-Host "  Aliases: glass, glass-2, glass-3, glass-4, glass-5, brudda"
        return
    }

    Show-Header
    Load-Env

    Write-Host "  Switching to: $Alias" -ForegroundColor Yellow
    Write-Host ""

    # 1. Switch account (updates openclaw.json + all agent models.json)
    Push-Location $WORKSPACE
    node skills/ollama-cloud-rotator/switch.js $Alias
    Pop-Location

    # 2. Sync all configs
    Write-Host ""
    Push-Location $WORKSPACE
    node scripts/sync-all-configs.js --clear-cooldowns
    Pop-Location

    # 3. Restart gateway
    Write-Host ""
    Write-Host "  Restarting gateway..." -ForegroundColor Yellow
    openclaw gateway stop 2>$null
    Start-Sleep -Seconds 2
    Start-Job -ScriptBlock { openclaw gateway } | Out-Null
    Start-Sleep -Seconds 5
    Write-Host "  Gateway restarted (background job)." -ForegroundColor Green
    Write-Host ""
}

function Do-Sync {
    Show-Header
    Load-Env
    Push-Location $WORKSPACE
    node scripts/sync-all-configs.js --clear-cooldowns
    Pop-Location
}

function Do-Restart {
    Show-Header
    Load-Env
    Write-Host "  Stopping gateway..." -ForegroundColor Yellow
    openclaw gateway stop 2>$null
    Start-Sleep -Seconds 2
    Write-Host "  Starting gateway..." -ForegroundColor Yellow
    # openclaw is an npm script (.ps1 wrapper), so use powershell to launch it in background
    Start-Job -ScriptBlock { openclaw gateway } | Out-Null
    Start-Sleep -Seconds 5
    Write-Host "  Gateway restarted (background job)." -ForegroundColor Green
    Write-Host "  Check: openclaw doctor" -ForegroundColor DarkGray
    Write-Host ""
}

function Do-Fix {
    Show-Header
    Load-Env

    Write-Host "  FULL RECOVERY MODE" -ForegroundColor Red
    Write-Host "  ==================" -ForegroundColor DarkRed
    Write-Host ""

    # 1. Validate all keys
    Write-Host "  Step 1/4: Validating API keys..." -ForegroundColor Yellow
    Push-Location $WORKSPACE

    # Capture validation output to find first working key
    $output = node skills/ollama-cloud-rotator/validate-keys.js 2>&1
    $output | ForEach-Object { Write-Host "  $_" }

    # Parse for first working account
    $workingAccount = $null
    $lines = $output -split "`n"
    foreach ($line in $lines) {
        if ($line -match '^\s+(glass\S*|brudda):\s+...\s+OK') {
            $workingAccount = $matches[1].Trim()
            break
        }
    }

    Pop-Location
    Write-Host ""

    if (-not $workingAccount) {
        Write-Host "  No working Ollama Cloud accounts found!" -ForegroundColor Red
        Write-Host "  Falling back to local Ollama models only." -ForegroundColor Yellow
        Write-Host ""
        # Still sync and restart so local models work
        Do-Sync
        Do-Restart
        return
    }

    # 2. Switch to best account
    Write-Host "  Step 2/4: Switching to $workingAccount..." -ForegroundColor Yellow
    Push-Location $WORKSPACE
    node skills/ollama-cloud-rotator/switch.js $workingAccount
    Pop-Location
    Write-Host ""

    # 3. Sync all configs
    Write-Host "  Step 3/4: Syncing all configs..." -ForegroundColor Yellow
    Push-Location $WORKSPACE
    node scripts/sync-all-configs.js --clear-cooldowns
    Pop-Location
    Write-Host ""

    # 4. Restart gateway
    Write-Host "  Step 4/4: Restarting gateway..." -ForegroundColor Yellow
    openclaw gateway stop 2>$null
    Start-Sleep -Seconds 2
    Start-Job -ScriptBlock { openclaw gateway } | Out-Null
    Start-Sleep -Seconds 5
    Write-Host ""
    Write-Host "  RECOVERY COMPLETE" -ForegroundColor Green
    Write-Host "  Active account: $workingAccount" -ForegroundColor Green
    Write-Host "  Gateway: restarting..." -ForegroundColor Green
    Write-Host ""
}

function Do-Doctor {
    Show-Header
    Load-Env
    openclaw doctor
}

# Main dispatch
switch ($Action) {
    'status'   { Do-Status }
    'validate' { Do-Validate }
    'switch'   { Do-Switch -Alias ($ExtraArgs -join ' ') }
    'sync'     { Do-Sync }
    'restart'  { Do-Restart }
    'fix'      { Do-Fix }
    'doctor'   { Do-Doctor }
    'help'     { Show-Help }
    default    { Show-Help }
}
