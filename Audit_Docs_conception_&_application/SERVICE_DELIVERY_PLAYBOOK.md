# White Claw Service Delivery Playbook

**How to deliver a White Claw audit and fix to a paying client.**

---

## Overview

White Claw is a done-for-you service. The client pays, fills out an intake form, gets on a 15-minute call, and receives a working OpenClaw setup within 24-48 hours. No debugging on their end.

---

## Service Tiers

| Tier | Price | Deliverables | Timeline |
|------|-------|-------------|----------|
| **Lite** | $49 (first 25), $100 after | 1 integration, 1 automation, 7-day support | 24-48 hours |
| **Pro** | $99 (first 25), $199 after | 3 integrations, 2 automations, 30-day support | 3-5 days |
| **Enterprise** | Custom ($500+) | Full setup, custom agents, ongoing support | 1-2 weeks |

---

## Delivery Process

### Phase 1: Intake (15 minutes)

**1. Client fills out intake form** (see `intake/CLIENT_INTAKE_FORM.md`)

Key questions:
- What OS are you on? (Windows/macOS/Linux)
- Is OpenClaw already installed? What version?
- What are you trying to automate? (Telegram bot, email, calendar, etc.)
- What API keys do you have? (Gemini, OpenRouter, Anthropic, etc.)
- Do you have Ollama installed locally?
- What's your hardware? (RAM, GPU -- determines local model options)
- What's broken right now? (specific error messages if any)

**2. 15-minute kickoff call**

Purpose: Understand their goal, not their technical setup. Ask:
- "What do you want your AI to DO for you?"
- "What apps do you use daily?" (determines integrations)
- "When it breaks, what happens? What do you see?"

### Phase 2: Audit (30-60 minutes)

**1. Get remote access** (AnyDesk, Parsec, or terminal share)

Or have them run diagnostic commands and paste output:
```bash
openclaw --version
openclaw doctor
ollama list 2>/dev/null || echo "Ollama not installed"
cat ~/.openclaw/openclaw.json
ls ~/.openclaw/agents/
```

**2. Run the Universal Audit Checklist** (see `UNIVERSAL_OPENCLAW_GUIDE.md` Section 3)

Document every finding in a client audit report.

**3. Classify issues by severity:**
- CRITICAL: Gateway won't start, all models failed
- HIGH: Config drift, missing keys, wrong fallback chain
- MEDIUM: Stale cooldowns, missing gateway port
- LOW: Suboptimal model order, unused providers

### Phase 3: Fix (1-2 hours)

**1. Backup current config**
```bash
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup
```

**2. Apply fixes in order:**
1. Fix `openclaw.json` structure (gateway mode, port, providers)
2. Configure correct fallback chain for their use case
3. Sync agent configs
4. Clear cooldowns
5. Set up their integrations (Telegram bot token, Notion, Gmail, etc.)
6. Build custom skill(s) if included in tier
7. Test end-to-end

**3. Install automation scripts:**
- `sync-all-configs.js` adapted for their setup
- `validate-keys.js` adapted for their providers
- `openclaw-ops.ps1` (Windows) or `openclaw-ops.sh` (macOS/Linux)

**4. Test the one-command recovery:**
```bash
./openclaw-ops.ps1 fix  # or ./openclaw-ops.sh fix
```

### Phase 4: Handoff (15-30 minutes)

**1. Record Loom walkthrough** (5-10 minutes)
- Show them how the system works
- Demo the `openclaw-ops` commands
- Show how to switch accounts when rate limits hit
- Show Telegram commands if applicable

**2. Send deliverables email:**

```
Subject: Your White Claw Setup is Ready

Hi [Name],

Your OpenClaw setup is complete. Here's what was done:

AUDIT FINDINGS:
- [List issues found]

FIXES APPLIED:
- [List fixes]

YOUR SETUP:
- Primary model: [model]
- Fallback chain: [list]
- Integrations: [list]
- Custom automations: [list]

COMMANDS YOU'LL USE:
- When things break: .\openclaw-ops.ps1 fix
- Check status: .\openclaw-ops.ps1 status
- Switch accounts: .\openclaw-ops.ps1 switch [alias]

SUPPORT:
- Reply to this email for 7-day support (Lite) / 30-day support (Pro)
- Watch the Loom walkthrough: [link]

Enjoy your working AI agent!
- Tylar
```

**3. Set calendar reminder** for support follow-up (Day 3 and Day 7)

---

## Handling Common Client Situations

### "I don't have any API keys"

Walk them through getting free keys:
1. Google AI Studio (Gemini) - https://aistudio.google.com/apikey
2. Ollama Cloud - https://ollama.com/ (create account)
3. OpenRouter - https://openrouter.ai/ (free models available)

### "I don't have Ollama installed"

Two options:
1. **Skip local**: Configure cloud-only (Setup A in Universal Guide)
2. **Install Ollama**: `curl -fsSL https://ollama.com/install.sh | sh` then `ollama pull llama3.2:latest`

### "I'm on a Raspberry Pi / low-end hardware"

Cloud-only config. No local models. Use:
```json
"primary": "google/gemini-2.0-flash",
"fallbacks": ["ollama-cloud/kimi-k2.5:cloud"]
```

### "I want it to work with my company Slack/Teams"

Check if OpenClaw supports their channel:
- Telegram, WhatsApp, Discord, Slack, Teams, Twitch, Google Chat
- Configure the channel plugin in `openclaw.json`
- Ensure bot tokens are set up

### "It was working yesterday and now it's broken"

90% of the time: rate limit cascade. Run:
```bash
./openclaw-ops.ps1 fix
```

### "I want to use Claude/GPT but don't want to pay much"

Set up OpenRouter with free or cheap models as primary, paid as manual override:
```json
"primary": "openrouter/meta-llama/llama-3.1-8b-instruct:free",
"fallbacks": ["google/gemini-2.0-flash", "anthropic/claude-sonnet-4-5"]
```

---

## Quality Checklist Before Handoff

- [ ] Gateway starts clean (`openclaw doctor` shows no errors)
- [ ] Primary model responds (test via Telegram/chat)
- [ ] Fallback chain works (temporarily break primary, verify fallback kicks in)
- [ ] One-command recovery works (`openclaw-ops fix`)
- [ ] Config files backed up
- [ ] Loom walkthrough recorded
- [ ] Deliverables email sent
- [ ] Support follow-up scheduled

---

## Metrics to Track

| Metric | Target |
|--------|--------|
| Time to complete Lite | < 2 hours |
| Time to complete Pro | < 6 hours |
| Client satisfaction (follow-up) | > 4.5/5 |
| Support tickets per client | < 3 in support period |
| Repeat/referral rate | > 30% |

---

## Scaling Notes

### First 25 Clients (Manual)
- You do everything yourself
- Document patterns and edge cases
- Build reusable templates per setup type
- Collect testimonials

### 25-100 Clients (Semi-Automated)
- Config wizard generates `openclaw.json` from intake form
- Pre-built templates per setup type
- VA handles intake and Loom recording
- You handle complex fixes

### 100+ Clients (Productized)
- Self-serve wizard on website
- Automated config generation
- Stripe checkout -> automated onboarding email sequence
- Support community (Discord)
- You handle enterprise tier only

---

*This playbook is a living document. Update it after every client delivery with new patterns and edge cases.*
