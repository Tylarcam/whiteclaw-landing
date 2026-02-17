# White Claw Case Study: Full OpenClaw Audit & Recovery

**Client:** Internal (Tylar Cameron)
**Platform:** OpenClaw 2026.2.12 on Windows 10
**Duration:** Single session (2 hours)
**Result:** 7 critical issues identified and resolved, zero-downtime recovery automation delivered

---

## Starting Condition

The OpenClaw installation had been degrading over 14 days. Symptoms included:

- "All models failed" errors killing all agent conversations
- Rate limit errors on multiple providers simultaneously
- Gateway refusing to start after config changes
- Telegram bot going unresponsive for hours
- Manual recovery requiring 10+ steps across multiple files every time

The client had been manually rotating API keys and restarting the gateway, but the fixes never stuck because underlying architectural issues kept causing regressions.

---

## Audit Findings

### Issue 1: `openclaw.json` Completely Stripped (CRITICAL)

**Symptom:** Gateway running on `anthropic/claude-opus-4-6` (expensive paid model) instead of free Ollama Cloud.

**Root cause:** Running `openclaw doctor --fix` had stripped the config from 285 lines down to 34 lines, removing the entire `models.providers` section, `agents.defaults.model` (primary + fallback chain), and all model configurations.

**Impact:** No free cloud models configured. Every request hitting paid Anthropic API.

**Fix:** Rebuilt `openclaw.json` with complete provider configuration:
- 4 providers (Google Gemini, Ollama local, Ollama Cloud, Kimi Coding)
- 10+ models across local and cloud
- Hardware-agnostic fallback chain

---

### Issue 2: Duplicate and Drifting `.env` Files (HIGH)

**Symptom:** `MissingEnvVarError: Missing env var "GEMINI_API_KEY"` when starting gateway.

**Root cause:** Two `.env` files existed:
- `~/.openclaw/.env` (root, 7 lines, minimal)
- `~/.openclaw/workspace/.env` (42 lines, comprehensive)

The root `.env` was missing `GEMINI_API_KEY` and other keys. OpenClaw doesn't auto-load either file -- keys must be hardcoded in JSON configs or manually sourced.

Additionally, root `.env` had duplicate entries (`GEMINI_API_KEY` appeared twice, `NOTION_TOKEN` appeared twice).

**Fix:** Consolidated into single organized `.env` at root. Removed duplicates. Added all 6 Ollama Cloud keys + Gemini + all service keys.

---

### Issue 3: Agent Config Desync (HIGH)

**Symptom:** After switching Ollama Cloud accounts, agent still uses old rate-limited key.

**Root cause:** OpenClaw has a **dual config architecture**:
- `openclaw.json` -- gateway reads this
- `agents/main/agent/models.json` -- each agent reads its own copy

These are **independent**. Updating `openclaw.json` does NOT propagate to agent configs. The switch script only updated `openclaw.json`, leaving agents on stale keys.

**Affected files:**
- `agents/main/agent/models.json` (main agent)
- `agents/cline/agent/models.json` (cline agent)

**Fix:** Updated `switch.js` to discover and update ALL agent `models.json` files. Created `sync-all-configs.js` as a comprehensive sync tool.

---

### Issue 4: `apply-gateway-to-agents.js` Broken (MEDIUM)

**Symptom:** Script errors with "Missing gateway.auth.token or gateway.port".

**Root cause:** The built-in sync script requires `gateway.port` in `openclaw.json`, but this field was never set. The script would fail immediately on every run.

**Fix:** Added `"port": 18789` to `gateway` config in `openclaw.json`. Created replacement `sync-all-configs.js` that handles both model keys AND gateway injection.

---

### Issue 5: `gateway.mode` Not Set (MEDIUM)

**Symptom:** `Gateway start blocked: set gateway.mode=local (current: unset) or pass --allow-unconfigured.`

**Root cause:** After the config was stripped by `doctor --fix`, the `gateway` object lost its `mode` field. OpenClaw requires an explicit `"mode": "local"` to start.

**Fix:** Added `"mode": "local"` to gateway config. Now persists across restarts.

---

### Issue 6: Stale Cooldowns Blocking Providers (MEDIUM)

**Symptom:** Providers that should be available are skipped by the fallback chain.

**Root cause:** `auth-profiles.json` stores `cooldownUntil` timestamps per provider profile. When a provider fails 5+ times, it gets a cooldown period. These cooldowns can outlast the actual issue, causing the system to skip healthy providers.

**Found in:**
- `agents/main/agent/auth-profiles.json`: `ollama:default` had 5 timeout failures with active cooldown
- `agents/cline/agent/auth-profiles.json`: `kimi-coding:default` had 30 rate limit failures + `disabledUntil` set

**Fix:** Added `--clear-cooldowns` flag to `sync-all-configs.js` that resets `cooldownUntil`, `errorCount`, `failureCounts`, and `disabledUntil` across all agent profiles.

---

### Issue 7: Local Model Mismatch (LOW)

**Symptom:** Ollama local provider in cooldown even though Ollama is running.

**Root cause:** Agent config listed models that didn't match what Ollama actually has installed. Config had `llama3.2:latest` and `qwen2.5:7b`, but Ollama actually had `llama3.1:8b` and `qwen2.5-coder:7b`. The agent tried to use missing models, got errors, and put the entire Ollama provider in cooldown.

**Fix:** Synced agent `models.json` with actual Ollama model list (9 models confirmed installed). Verified with `ollama list`.

---

## Solution Delivered

### Immediate Fixes
- Rebuilt `openclaw.json` (full provider/model config)
- Consolidated `.env` (no duplicates, organized by service)
- Synced all agent configs (models.json + auth-profiles.json)
- Cleared stale cooldowns
- Set gateway mode and port
- Restarted gateway on correct config

### Automation Delivered

| Script | Purpose |
|--------|---------|
| `openclaw-ops.ps1` | Master operations script: status, validate, switch, sync, restart, fix |
| `sync-all-configs.js` | Syncs openclaw.json to all agents + clears cooldowns |
| `switch.js` (updated) | Now syncs ALL agent models.json, not just openclaw.json |
| `validate-keys.js` | Tests all 6 Ollama Cloud API keys |
| `validate-gemini.js` | Tests Gemini API key |

### One-Command Recovery

```powershell
.\openclaw-ops.ps1 fix
```

This single command:
1. Validates all API keys
2. Picks the first working account
3. Switches to it
4. Syncs all agent configs
5. Clears cooldowns
6. Restarts gateway

**Time from "all models failed" to working agent: ~60 seconds.**

---

## Before vs After

| Metric | Before | After |
|--------|--------|-------|
| Recovery time | 30-60 min manual | 60 seconds automated |
| Config files to update | 3+ (manual, error-prone) | 1 command syncs all |
| Cooldown clearing | Unknown/manual | Automatic |
| API key validation | Manual testing | `validate` command |
| Account switching | Edit JSON + restart | `switch glass-3` |
| Fallback chain | Broken (missing models) | 7 models across 4 providers |
| Gateway startup | Blocked (missing mode) | Clean start every time |
| Documentation | None | Full audit + scripts + playbook |

---

## Architecture After Fix

```
openclaw.json (source of truth)
    |
    |-- models.providers
    |       |-- google (Gemini 2.0 Flash)
    |       |-- ollama (7 local models)
    |       |-- ollama-cloud (kimi-k2.5, minimax-m2, minimax-m2.1)
    |       |-- kimi-coding (kimi-k2-thinking)
    |
    |-- agents.defaults.model
    |       |-- primary: ollama-cloud/kimi-k2.5:cloud
    |       |-- fallbacks: minimax-m2 -> llama3.2 -> llama3.1 -> qwen2.5-coder:14b -> qwen2.5 -> gemini -> kimi
    |
    |-- gateway
            |-- mode: local
            |-- port: 18789

sync-all-configs.js
    |
    |-- Reads openclaw.json
    |-- Updates agents/main/agent/models.json
    |-- Updates agents/cline/agent/models.json
    |-- Injects gateway URL/token into auth-profiles.json
    |-- Clears stale cooldowns

openclaw-ops.ps1
    |
    |-- fix:      validate -> pick best -> switch -> sync -> restart
    |-- switch:   rotate account -> sync -> restart
    |-- validate: test all API keys
    |-- sync:     propagate config to agents
    |-- status:   show active config + sync status
```

---

## Key Takeaways for White Claw Service

1. **The dual config architecture is the #1 source of pain.** Every client will hit config desync. The sync script is the most valuable deliverable.

2. **Rate limits cascade.** When one provider fails, OpenClaw tries the next. If all fail, the agent marks providers as "in cooldown" and stops trying. Clearing cooldowns is essential.

3. **Local models are unreliable fallbacks.** Unless the client has a strong GPU, local Ollama models will timeout. Always configure cloud-first.

4. **`doctor --fix` can break things.** It may strip custom config. Always backup `openclaw.json` before running it.

5. **One-command recovery is the sell.** Clients don't care about the details. They care that when it breaks, they type one command and it works again.

---

*Case study based on real audit performed February 17, 2026.*
