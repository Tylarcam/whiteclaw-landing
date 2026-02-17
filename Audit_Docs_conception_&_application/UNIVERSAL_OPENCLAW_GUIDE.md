# Universal OpenClaw Audit & Fix Guide

**For White Claw service providers and any OpenClaw operator.**

This guide works for ANY OpenClaw setup -- regardless of OS, provider mix, or hardware. It documents every common failure mode and how to fix it, so you can diagnose and resolve issues for clients with completely different configurations than your own.

---

## Table of Contents

1. [Understanding OpenClaw Architecture](#1-understanding-openclaw-architecture)
2. [Common Setups You'll Encounter](#2-common-setups-youll-encounter)
3. [Universal Audit Checklist](#3-universal-audit-checklist)
4. [Issue-by-Issue Fix Guide](#4-issue-by-issue-fix-guide)
5. [Adapting Scripts for Different Setups](#5-adapting-scripts-for-different-setups)
6. [OS-Specific Notes](#6-os-specific-notes)
7. [Provider Reference](#7-provider-reference)

---

## 1. Understanding OpenClaw Architecture

### File Layout (Same on ALL Platforms)

```
~/.openclaw/
|-- openclaw.json              # Global config (gateway reads this)
|-- .env                       # Environment variables (NOT auto-loaded by OpenClaw)
|-- canvas/                    # Web chat UI assets
|-- agents/
|   |-- main/
|   |   |-- agent/
|   |   |   |-- models.json          # Agent's own provider/model config
|   |   |   |-- auth-profiles.json   # Agent's auth + cooldown state
|   |   |-- sessions/
|   |       |-- sessions.json        # Session history
|   |-- [other-agents]/
|       |-- agent/
|           |-- models.json
|           |-- auth-profiles.json
|-- workspace/
    |-- .env                   # Workspace env (loaded when running from workspace/)
    |-- skills/                # Skills directory
    |-- scripts/               # Custom scripts
```

### The Dual Config Problem

This is the #1 thing to understand:

```
openclaw.json           agents/*/agent/models.json
      |                           |
      |--- Gateway reads this     |--- Each agent reads its own
      |--- Has provider configs   |--- Has provider configs (INDEPENDENT COPY)
      |--- Has model chain        |--- May have different keys
      |                           |
      +------ THESE DO NOT AUTO-SYNC ------+
```

**Key rule:** Changing `openclaw.json` does NOT automatically update agent configs. You must sync them manually or with a script.

### Config Priority

When the gateway processes a request for an agent:
1. Agent's `models.json` defines which providers/keys the agent uses
2. Agent's `auth-profiles.json` defines auth state and cooldowns
3. `openclaw.json` defines gateway-level settings (port, mode, auth token)
4. The fallback chain in `openclaw.json` `agents.defaults.model` is used as default if the agent doesn't override it

### Environment Variables

OpenClaw does NOT auto-load `.env` files. There are three approaches:

| Approach | How | Pros | Cons |
|----------|-----|------|------|
| **Hardcoded in JSON** | `"apiKey": "sk-..."` directly in config | Always works | Keys in plaintext in config |
| **Env reference** | `"apiKey": "${GEMINI_API_KEY}"` | Separation of concerns | Must source .env before starting |
| **Shell sourcing** | Load .env in PowerShell/Bash before running openclaw | Flexible | Manual step or needs wrapper script |

**Recommendation for clients:** Hardcode keys in agent `models.json` (OpenClaw already stores them there). Use `.env` only as a reference/backup for rotation scripts.

---

## 2. Common Setups You'll Encounter

### Setup A: Cloud-Only (No Local Models)
**Profile:** Non-technical user, laptop, no GPU
```
Providers: Google Gemini + Ollama Cloud (or OpenRouter)
Fallback: Gemini -> Ollama Cloud -> OpenRouter
Local Ollama: Not installed
```
**Common issues:** Rate limits on free tiers, no fallback when cloud is down.

### Setup B: Local-First (Self-Hosted)
**Profile:** Developer, gaming PC or homelab
```
Providers: Ollama local (llama3.2, qwen2.5-coder) + Cloud backup
Fallback: Local -> Cloud
Local Ollama: Running with 3-10 models
```
**Common issues:** Model mismatch, Ollama crashes, timeout cooldowns.

### Setup C: Hybrid (Mixed Cloud + Local)
**Profile:** Power user, multiple API keys
```
Providers: Ollama Cloud + Gemini + Kimi + Local Ollama
Fallback: Cloud -> Cloud2 -> Local -> Cloud3
Local Ollama: Running as backup
```
**Common issues:** Config drift, rate limit cascades across providers, cooldown stacking.

### Setup D: Enterprise (VPS/Server)
**Profile:** Agency running OpenClaw on cloud VPS
```
Providers: Anthropic Claude + OpenRouter + Google Gemini
Fallback: Claude -> Gemini -> OpenRouter
Local Ollama: Sometimes running on server
Channels: Telegram + Slack + Discord
```
**Common issues:** Gateway token auth, multi-agent config, service management.

---

## 3. Universal Audit Checklist

Run through these checks for ANY client, regardless of setup:

### Step 1: Gather Information

```bash
# OS and version
uname -a                    # macOS/Linux
systeminfo | findstr OS     # Windows

# OpenClaw version
openclaw --version

# Is gateway running?
openclaw doctor

# What models does Ollama have? (if installed)
ollama list

# Current config
cat ~/.openclaw/openclaw.json

# How many agents?
ls ~/.openclaw/agents/
```

### Step 2: Check Config Integrity

- [ ] `openclaw.json` exists and is valid JSON
- [ ] `gateway.mode` is set (usually `"local"`)
- [ ] `gateway.port` is set (usually `18789`)
- [ ] `gateway.auth.token` exists
- [ ] `models.providers` section exists with at least 1 provider
- [ ] Each provider has `baseUrl`, `apiKey` (if needed), and `models` array
- [ ] `agents.defaults.model.primary` points to a valid model
- [ ] `agents.defaults.model.fallbacks` contains working alternatives

### Step 3: Check Agent Configs

For each agent in `~/.openclaw/agents/*/`:

- [ ] `agent/models.json` exists and is valid JSON
- [ ] Provider API keys match what's in `openclaw.json` (or are intentionally different)
- [ ] Models listed actually exist (Ollama models match `ollama list`)
- [ ] `agent/auth-profiles.json` has no stale cooldowns

### Step 4: Check Provider Health

- [ ] Test each API key (Ollama Cloud, Gemini, OpenRouter, etc.)
- [ ] Verify rate limit status
- [ ] Check if local Ollama is running (`curl http://localhost:11434/api/tags`)
- [ ] Verify Telegram/WhatsApp/Discord connection (if applicable)

### Step 5: Check for Common Misconfigurations

- [ ] No duplicate entries in `.env`
- [ ] No `${VAR_NAME}` references that can't be resolved
- [ ] No models in fallback chain that don't exist in any provider
- [ ] Gateway port not conflicting with other services
- [ ] Firewall not blocking localhost ports

---

## 4. Issue-by-Issue Fix Guide

### "Gateway start blocked: set gateway.mode=local"

**Cause:** Missing `gateway.mode` in openclaw.json.
**Fix:**
```json
"gateway": {
  "mode": "local",
  "port": 18789,
  "auth": { ... }
}
```

### "MissingEnvVarError: Missing env var X"

**Cause:** Config uses `${VAR_NAME}` but env var not loaded.
**Fix options:**
1. Hardcode the key directly in the config
2. Create a launcher script that sources `.env` before running openclaw
3. Set the env var in the system environment

### "All models failed" / "FailoverError"

**Cause:** Every model in the fallback chain is either rate-limited, unreachable, or in cooldown.
**Fix:**
1. Validate which API keys work
2. Switch to a working account
3. Clear stale cooldowns in auth-profiles.json
4. Restart gateway

### "429 you (username) have reached your weekly usage limit"

**Cause:** Ollama Cloud rate limit on specific account.
**Fix:**
1. Switch to different Ollama Cloud account
2. Or add Ollama Cloud to fallback and use different primary
3. Update BOTH openclaw.json AND agent models.json

### "Provider X is in cooldown"

**Cause:** Provider failed too many times, OpenClaw is temporarily skipping it.
**Fix:**
In `agents/*/agent/auth-profiles.json`, find the provider's `usageStats` entry and set:
```json
"cooldownUntil": 0,
"errorCount": 0,
"failureCounts": {}
```

### "JSON5: invalid character" in openclaw.json

**Cause:** Malformed JSON -- usually from a bad edit or script corruption.
**Fix:**
1. Identify the line number from the error
2. Common causes: trailing comma, duplicate key, unclosed brace
3. Validate with `node -e "JSON.parse(require('fs').readFileSync('openclaw.json','utf8'))"`

### Agent uses wrong/old API key after rotation

**Cause:** `openclaw.json` was updated but `agents/*/agent/models.json` still has old key.
**Fix:**
1. Update the key in each agent's `models.json`
2. Or run `sync-all-configs.js` to propagate from openclaw.json
3. Restart gateway

### Local Ollama models in cooldown / timeout

**Cause:** Models listed in config don't match installed models, OR Ollama isn't running.
**Fix:**
1. Run `ollama list` to see installed models
2. Update agent `models.json` to only list installed models
3. Remove or add models with `ollama pull <model>` or `ollama rm <model>`

---

## 5. Adapting Scripts for Different Setups

### sync-all-configs.js

This script works for any setup. It reads `openclaw.json` as source of truth and propagates to all agents. Customization points:

```javascript
// Add new providers to sync
if (models.providers?.['your-provider']?.apiKey) {
  models.providers['your-provider'].apiKey = sourceKey;
}
```

### validate-keys.js

Adapt for different providers:

```javascript
// For OpenRouter
const ACCOUNTS = [
  { name: 'openrouter', env: 'OPENROUTER_KEY', host: 'openrouter.ai', path: '/api/v1/...' }
];

// For Anthropic
const ACCOUNTS = [
  { name: 'anthropic', env: 'ANTHROPIC_API_KEY', host: 'api.anthropic.com', path: '/v1/...' }
];
```

### openclaw-ops (PowerShell vs Bash)

For macOS/Linux clients, translate the PowerShell script to Bash:

```bash
#!/bin/bash
# openclaw-ops.sh - macOS/Linux equivalent

OPENCLAW_ROOT="$HOME/.openclaw"
WORKSPACE="$OPENCLAW_ROOT/workspace"

load_env() {
  if [ -f "$OPENCLAW_ROOT/.env" ]; then
    export $(grep -v '^#' "$OPENCLAW_ROOT/.env" | xargs)
  fi
}

case "$1" in
  status)   load_env; # ... ;;
  validate) load_env; cd "$WORKSPACE"; node skills/ollama-cloud-rotator/validate-keys.js ;;
  switch)   load_env; cd "$WORKSPACE"; node skills/ollama-cloud-rotator/switch.js "$2" ;;
  sync)     load_env; cd "$WORKSPACE"; node scripts/sync-all-configs.js --clear-cooldowns ;;
  restart)  load_env; openclaw gateway stop; sleep 2; openclaw gateway & ;;
  fix)      load_env; # full recovery ;;
  *)        echo "Usage: $0 {status|validate|switch|sync|restart|fix}" ;;
esac
```

### Client-Specific Ollama Cloud Accounts

If client has different Ollama accounts, update `switch.js`:

```javascript
const ACCOUNTS = {
  1: { name: 'Client Account 1', alias: 'acc1', type: 'api_key', envKey: 'OLLAMA_KEY_1' },
  2: { name: 'Client Account 2', alias: 'acc2', type: 'api_key', envKey: 'OLLAMA_KEY_2' },
};
```

---

## 6. OS-Specific Notes

### Windows

- Use PowerShell (not CMD) for all scripts
- Gateway scheduled task: `schtasks /Query /TN "OpenClaw Gateway"`
- Path separator: `\` in file system, but `/` works in Node.js
- npm global installs: `%APPDATA%\npm\`
- OpenClaw home: `C:\Users\<user>\.openclaw\`

### macOS

- Use `launchctl` for gateway service management
- OpenClaw home: `/Users/<user>/.openclaw/`
- Ollama runs as a macOS service
- May need `chmod +x` on bash scripts

### Linux

- Use `systemctl` for gateway service
- OpenClaw home: `/home/<user>/.openclaw/`
- Ollama may need manual service setup
- SELinux/AppArmor may block localhost connections

### Docker / VPS

- Gateway binds to `127.0.0.1` by default -- needs `0.0.0.0` for external access
- Ollama needs GPU passthrough for Docker
- Consider separate Ollama container
- Use environment variables (no `.env` file needed)

---

## 7. Provider Reference

### Free / Generous Providers

| Provider | Free Tier | Rate Limit | Best For |
|----------|-----------|------------|----------|
| **Google Gemini** | 1M tokens/day | 15 RPM (free) | Default backbone |
| **Ollama Cloud** | Weekly quota per account | Session + weekly | High-quality reasoning |
| **OpenRouter** | Some free models | Varies | Fallback diversity |
| **Ollama Local** | Unlimited (your hardware) | Hardware-limited | Privacy, offline |

### Paid Providers

| Provider | Cost | Rate Limit | Best For |
|----------|------|------------|----------|
| **Anthropic Claude** | $3-15/MTok | Generous | Complex tasks |
| **OpenAI GPT** | $0.50-60/MTok | Generous | General purpose |
| **Kimi/Moonshot** | Free tier available | Session limits | Coding tasks |

### Provider Config Templates

**Google Gemini:**
```json
"google": {
  "baseUrl": "https://generativelanguage.googleapis.com/v1beta",
  "apiKey": "AIzaSy...",
  "api": "google-generative-ai",
  "models": [{ "id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash", ... }]
}
```

**Ollama Cloud:**
```json
"ollama-cloud": {
  "baseUrl": "https://ollama.com/v1",
  "apiKey": "your-key-here",
  "api": "openai-responses",
  "models": [{ "id": "kimi-k2.5:cloud", ... }]
}
```

**OpenRouter:**
```json
"openrouter": {
  "baseUrl": "https://openrouter.ai/api/v1",
  "apiKey": "sk-or-v1-...",
  "api": "openai-completions",
  "models": [{ "id": "meta-llama/llama-3.1-8b-instruct:free", ... }]
}
```

**Ollama Local:**
```json
"ollama": {
  "baseUrl": "http://127.0.0.1:11434/v1",
  "models": [{ "id": "llama3.2:latest", ... }]
}
```

---

## Recommended Fallback Chains by Setup Type

### Budget (Free Only)
```json
"primary": "google/gemini-2.0-flash",
"fallbacks": ["ollama-cloud/kimi-k2.5:cloud", "ollama/llama3.2:latest"]
```

### Balanced (Free + Local)
```json
"primary": "ollama-cloud/kimi-k2.5:cloud",
"fallbacks": ["ollama/llama3.2:latest", "ollama/qwen2.5-coder:14b", "google/gemini-2.0-flash"]
```

### Reliability-First (Never Down)
```json
"primary": "ollama-cloud/kimi-k2.5:cloud",
"fallbacks": [
  "ollama-cloud/minimax-m2:cloud",
  "google/gemini-2.0-flash",
  "ollama/llama3.2:latest",
  "ollama/qwen2.5:7b",
  "openrouter/meta-llama/llama-3.1-8b-instruct:free"
]
```

### Enterprise (Quality + Reliability)
```json
"primary": "anthropic/claude-sonnet-4-5",
"fallbacks": [
  "google/gemini-2.0-flash",
  "openrouter/anthropic/claude-3.5-haiku",
  "ollama-cloud/kimi-k2.5:cloud"
]
```

---

*This guide covers the operational patterns we've validated across 14+ days of real debugging. Every issue and fix listed here was encountered in production.*
