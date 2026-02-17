# White Claw Audit Checklist

**Use this checklist for every client audit. Check off items as you verify them.**

---

## Client: ___________
## Date: ___________
## Tier: Lite / Pro / Enterprise

---

## 1. Environment

- [ ] OS identified: ___________
- [ ] OpenClaw version: ___________
- [ ] Node.js version: ___________
- [ ] Ollama installed: Yes / No
- [ ] Ollama version: ___________
- [ ] Ollama models: ___________

## 2. Config Structure

- [ ] `~/.openclaw/openclaw.json` exists
- [ ] Valid JSON (no parse errors)
- [ ] `gateway.mode` set to `"local"`
- [ ] `gateway.port` set (default: 18789)
- [ ] `gateway.auth.token` exists
- [ ] `models.providers` section exists
- [ ] At least 1 provider configured
- [ ] `agents.defaults.model.primary` set
- [ ] `agents.defaults.model.fallbacks` has 2+ models
- [ ] All referenced models exist in provider configs

## 3. Agent Configs

List agents found:

| Agent | models.json | auth-profiles.json | Keys in sync? | Cooldowns? |
|-------|-------------|---------------------|---------------|------------|
| _____ | [ ] Valid   | [ ] Valid           | [ ] Yes       | [ ] Clean  |
| _____ | [ ] Valid   | [ ] Valid           | [ ] Yes       | [ ] Clean  |
| _____ | [ ] Valid   | [ ] Valid           | [ ] Yes       | [ ] Clean  |

## 4. Provider Health

| Provider | API Key Present | Key Valid | Rate Limited? | Notes |
|----------|----------------|-----------|---------------|-------|
| Google Gemini | [ ] | [ ] | [ ] | |
| Ollama Cloud | [ ] | [ ] | [ ] | Account: _____ |
| Ollama Local | N/A | N/A | [ ] Cooldown | Models: _____ |
| OpenRouter | [ ] | [ ] | [ ] | |
| Anthropic | [ ] | [ ] | [ ] | |
| Kimi/Moonshot | [ ] | [ ] | [ ] | |
| Other: _____ | [ ] | [ ] | [ ] | |

## 5. Channel/Integration Health

| Channel | Configured | Token Valid | Connected | Notes |
|---------|-----------|-------------|-----------|-------|
| Telegram | [ ] | [ ] | [ ] | Bot: @_____ |
| WhatsApp | [ ] | [ ] | [ ] | |
| Discord | [ ] | [ ] | [ ] | |
| Slack | [ ] | [ ] | [ ] | |
| Web Chat | [ ] | N/A | [ ] | |

## 6. Common Issues Check

- [ ] No duplicate keys in `.env`
- [ ] No `${VAR_NAME}` references that can't resolve
- [ ] No stale cooldowns in auth-profiles.json
- [ ] Gateway port not conflicting (test: `curl http://localhost:18789`)
- [ ] Models in fallback chain match actual installed models
- [ ] No models referencing non-existent providers
- [ ] `doctor --fix` has not stripped the config

## 7. Fixes Applied

| # | Issue | Severity | Fix | Verified |
|---|-------|----------|-----|----------|
| 1 | | | | [ ] |
| 2 | | | | [ ] |
| 3 | | | | [ ] |
| 4 | | | | [ ] |
| 5 | | | | [ ] |

## 8. Deliverables

- [ ] `openclaw.json` rebuilt/fixed
- [ ] Agent configs synced
- [ ] Cooldowns cleared
- [ ] Fallback chain optimized for client's setup
- [ ] Integration(s) configured: ___________
- [ ] Custom automation(s) built: ___________
- [ ] `openclaw-ops` script installed (PS1 / SH)
- [ ] `sync-all-configs.js` installed
- [ ] Gateway starts clean
- [ ] Primary model responds
- [ ] Fallback chain tested
- [ ] One-command recovery tested
- [ ] Config backed up
- [ ] Loom walkthrough recorded
- [ ] Deliverables email sent
- [ ] Support follow-up scheduled: Day ___ and Day ___

## 9. Notes

```

```

---

**Time spent:** _____ hours
**Issues found:** _____
**Client satisfaction:** ___/5
