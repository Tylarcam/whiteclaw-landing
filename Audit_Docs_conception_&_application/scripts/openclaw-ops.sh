#!/bin/bash
# ============================================
# OpenClaw Operations Script (macOS/Linux)
# Single entry point for all OpenClaw management
# ============================================
#
# Usage:
#   ./openclaw-ops.sh status       - Show current API status + active config
#   ./openclaw-ops.sh validate     - Test all API keys (Ollama + Gemini)
#   ./openclaw-ops.sh switch <alias> - Switch Ollama Cloud account + sync + restart
#   ./openclaw-ops.sh sync         - Sync all configs (openclaw.json -> agent configs)
#   ./openclaw-ops.sh restart      - Stop + start gateway with env loaded
#   ./openclaw-ops.sh fix          - Full recovery: validate -> pick best -> switch -> sync -> restart
#   ./openclaw-ops.sh doctor       - Run openclaw doctor with env loaded

set -e

OPENCLAW_ROOT="$HOME/.openclaw"
WORKSPACE="$OPENCLAW_ROOT/workspace"

# Load .env into current shell
load_env() {
    local env_file="$OPENCLAW_ROOT/.env"
    if [ -f "$env_file" ]; then
        while IFS= read -r line; do
            line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            if [ -n "$line" ] && [[ ! "$line" == \#* ]]; then
                export "$line" 2>/dev/null || true
            fi
        done < "$env_file"
    fi
}

header() {
    echo ""
    echo "  OpenClaw Operations"
    echo "  ==================="
    echo ""
}

show_help() {
    header
    echo "  Usage: ./openclaw-ops.sh <action> [args]"
    echo ""
    echo "  Actions:"
    echo "    status      Show current active config + API key status"
    echo "    validate    Test all API keys (Ollama Cloud + Gemini)"
    echo "    switch <a>  Switch Ollama account (glass, glass-2..4, glass-5, brudda)"
    echo "    sync        Sync openclaw.json to all agent configs"
    echo "    restart     Stop + start gateway with .env loaded"
    echo "    fix         Full auto-recovery: validate, switch, sync, restart"
    echo "    doctor      Run openclaw doctor with .env loaded"
    echo "    help        Show this help"
    echo ""
}

do_status() {
    header
    load_env
    echo "  Current Configuration:"
    echo "  Config: $OPENCLAW_ROOT/openclaw.json"
    echo ""
    if command -v node &>/dev/null; then
        node -e "
const fs = require('fs');
const path = require('path');
const home = require('os').homedir();
const config = JSON.parse(fs.readFileSync(path.join(home, '.openclaw', 'openclaw.json'), 'utf8'));
const key = config.models?.providers?.['ollama-cloud']?.apiKey || 'not set';
const primary = config.agents?.defaults?.model?.primary || 'not set';
const fallbacks = config.agents?.defaults?.model?.fallbacks?.join(', ') || 'none';
const mode = config.gateway?.mode || 'unset';
const port = config.gateway?.port || 'unset';
console.log('  Ollama Cloud key: ' + key.substring(0, 12) + '...');
console.log('  Primary model: ' + primary);
console.log('  Fallbacks: ' + fallbacks);
console.log('  Gateway: mode=' + mode + ' port=' + port);
"
    else
        echo "  (Node.js not found -- install to see config details)"
    fi
    echo ""
}

do_validate() {
    header
    load_env
    echo "  Running API key validation..."
    echo ""
    cd "$WORKSPACE"
    node skills/ollama-cloud-rotator/validate-keys.js 2>/dev/null || echo "  (Ollama validation script not found)"
    echo ""
    node skills/ollama-cloud-rotator/validate-gemini.js 2>/dev/null || echo "  (Gemini validation script not found)"
}

do_switch() {
    local alias="$1"
    if [ -z "$alias" ]; then
        echo "  Usage: ./openclaw-ops.sh switch <alias>"
        echo "  Aliases: glass, glass-2, glass-3, glass-4, glass-5, brudda"
        return 1
    fi

    header
    load_env
    echo "  Switching to: $alias"
    echo ""

    cd "$WORKSPACE"
    node skills/ollama-cloud-rotator/switch.js "$alias"

    echo ""
    node scripts/sync-all-configs.js --clear-cooldowns

    echo ""
    echo "  Restarting gateway..."
    openclaw gateway stop 2>/dev/null || true
    sleep 2
    nohup openclaw gateway >/dev/null 2>&1 &
    sleep 3
    echo "  Gateway restarted (background)."
    echo ""
}

do_sync() {
    header
    load_env
    cd "$WORKSPACE"
    node scripts/sync-all-configs.js --clear-cooldowns
}

do_restart() {
    header
    load_env
    echo "  Stopping gateway..."
    openclaw gateway stop 2>/dev/null || true
    sleep 2
    echo "  Starting gateway..."
    nohup openclaw gateway >/dev/null 2>&1 &
    sleep 3
    echo "  Gateway restarted (background)."
    echo "  Check: openclaw doctor"
    echo ""
}

do_fix() {
    header
    load_env

    echo "  FULL RECOVERY MODE"
    echo "  =================="
    echo ""

    echo "  Step 1/4: Validating API keys..."
    cd "$WORKSPACE"
    local output
    output=$(node skills/ollama-cloud-rotator/validate-keys.js 2>&1)
    echo "$output" | sed 's/^/  /'

    local working
    working=$(echo "$output" | grep -oP '^\s+(glass\S*|brudda):\s+...\s+OK' | head -1 | awk '{print $1}' | tr -d ':')

    echo ""

    if [ -z "$working" ]; then
        echo "  No working Ollama Cloud accounts found!"
        echo "  Falling back to local Ollama models only."
        echo ""
        do_sync
        do_restart
        return
    fi

    echo "  Step 2/4: Switching to $working..."
    node skills/ollama-cloud-rotator/switch.js "$working"
    echo ""

    echo "  Step 3/4: Syncing all configs..."
    node scripts/sync-all-configs.js --clear-cooldowns
    echo ""

    echo "  Step 4/4: Restarting gateway..."
    openclaw gateway stop 2>/dev/null || true
    sleep 2
    nohup openclaw gateway >/dev/null 2>&1 &
    sleep 3

    echo ""
    echo "  RECOVERY COMPLETE"
    echo "  Active account: $working"
    echo "  Gateway: restarting..."
    echo ""
}

do_doctor() {
    header
    load_env
    openclaw doctor
}

# Main dispatch
case "${1:-help}" in
    status)   do_status ;;
    validate) do_validate ;;
    switch)   do_switch "$2" ;;
    sync)     do_sync ;;
    restart)  do_restart ;;
    fix)      do_fix ;;
    doctor)   do_doctor ;;
    help)     show_help ;;
    *)        show_help ;;
esac
