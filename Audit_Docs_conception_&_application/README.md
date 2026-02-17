# White Claw -- OpenClaw Audit & Done-For-You Service

**"AI Agent Setup. Done. No Debugging."**

This is the complete documentation, tooling, and delivery playbook for **White Claw** -- a white-glove service that audits, fixes, and optimizes OpenClaw installations for clients who want working AI agents without touching configs.

---

## What Is This?

White Claw is a service built from real experience. Over 14+ days of debugging OpenClaw rate limits, config drift, API key rotation, fallback chain failures, and gateway crashes, we identified every way OpenClaw can break -- and built the automation to fix it all in under 2 hours.

This documentation package contains:

1. **The Problem** -- Why OpenClaw breaks and what the common pain points are
2. **The Solution** -- Battle-tested fixes, automation scripts, and config templates
3. **The Service** -- How to deliver this as a paid service to others
4. **Universal Adaptation** -- How to apply this to ANY OpenClaw setup, not just ours

---

## Directory Structure

```
Audit_Docs_conception_&_application/
|
|-- README.md                          # You are here
|-- CASE_STUDY.md                      # Real audit: 7 issues found, 7 fixed in one session
|-- UNIVERSAL_OPENCLAW_GUIDE.md        # Adaptation guide for any client's setup
|-- SERVICE_DELIVERY_PLAYBOOK.md       # Step-by-step White Claw service delivery
|-- WHITE_CLAW_2DAY_AUDIT.md           # Original 2-day audit + mind map + offer design
|-- REPLIT_PREMISE.md                  # Philosophy: cloud-first, hardware-agnostic
|
|-- templates/
|   |-- openclaw.json.template         # Starter config for new clients
|   |-- env.template                   # .env template with all common providers
|   |-- fallback-chain-examples.md     # Model priority examples for different use cases
|
|-- scripts/
|   |-- sync-all-configs.js            # Syncs openclaw.json to all agent configs
|   |-- validate-keys.js               # Tests all Ollama Cloud API keys
|   |-- validate-gemini.js             # Tests Gemini API key
|   |-- switch.js                      # Rotates Ollama Cloud accounts
|   |-- openclaw-ops.ps1               # Master operations script (Windows)
|   |-- openclaw-ops.sh                # Master operations script (macOS/Linux)
|
|-- intake/
|   |-- CLIENT_INTAKE_FORM.md          # Questions to ask before starting
|   |-- AUDIT_CHECKLIST.md             # Systematic audit checklist
```

---

## The Problem We Solve

OpenClaw is powerful but has a steep operational cost. The most common issues:

| Problem | Frequency | Impact |
|---------|-----------|--------|
| **Rate limit cascades** | Every few days | All models fail, agent goes silent |
| **Config drift** | After any change | Agent uses stale keys, fails silently |
| **Missing env vars** | First run | Gateway won't start |
| **Gateway mode unset** | After fresh install | "Gateway start blocked" error |
| **Local model mismatch** | After Ollama updates | Cooldown errors on models that don't exist |
| **No single recovery command** | Always | Manual multi-step recovery each time |
| **Dual config architecture** | By design | `openclaw.json` and `agents/*/models.json` desync |

**The result:** Users spend days or weeks debugging instead of using their AI agents.

**Our result:** One command (`openclaw-ops.ps1 fix`) recovers from any of these issues in under 60 seconds.

---

## Who This Is For

### As a Service (White Claw Clients)

- **Solopreneurs** who installed OpenClaw but can't get it to stay running
- **Small agencies** (2-10 people) that need reliable AI automation
- **Content creators** who want agents working across Telegram/WhatsApp/Discord
- **Non-technical founders** who hit "All models failed" and don't know what it means
- **Anyone** who values their time more than learning OpenClaw internals

### As a Reference (Other Developers)

- OpenClaw contributors looking for operational patterns
- DevOps engineers setting up OpenClaw for organizations
- Anyone building services on top of OpenClaw

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [Case Study](./CASE_STUDY.md) | Real audit walkthrough with 7 issues found/fixed |
| [Universal Guide](./UNIVERSAL_OPENCLAW_GUIDE.md) | How to adapt this for ANY OpenClaw setup |
| [Service Playbook](./SERVICE_DELIVERY_PLAYBOOK.md) | Delivering White Claw as a paid service |
| [Audit + Offer Design](./WHITE_CLAW_2DAY_AUDIT.md) | Original business case and offer structure |
| [Replit Premise](./REPLIT_PREMISE.md) | Cloud-first philosophy for hardware-agnostic configs |
| [Client Intake](./intake/CLIENT_INTAKE_FORM.md) | Pre-audit questionnaire |
| [Audit Checklist](./intake/AUDIT_CHECKLIST.md) | Systematic audit procedure |

---

## The One-Command Solution

After a White Claw setup, clients get a single command that handles everything:

### Windows (PowerShell)
```powershell
cd ~\.openclaw
.\openclaw-ops.ps1 fix
```

### macOS/Linux (Bash)
```bash
cd ~/.openclaw
./openclaw-ops.sh fix
```

**What `fix` does automatically:**
1. Validates all API keys (Ollama Cloud accounts + Gemini + others)
2. Picks the first working account
3. Switches to it (updates openclaw.json + all agent configs)
4. Clears stale cooldowns
5. Restarts the gateway

**Other commands:**
```
status    - Show current active config + sync status
validate  - Test all API keys
switch X  - Switch to specific account
sync      - Sync configs without restart
restart   - Stop + start gateway
doctor    - Run openclaw doctor
```

---

## How We Got Here

### Timeline

| Date | Event | Outcome |
|------|-------|---------|
| Feb 14 | Started debugging Kimi 403 errors | Identified rate limit as root cause |
| Feb 15 | Discovered config drift between openclaw.json and agent configs | Built sync scripts |
| Feb 16 | Full audit: 14 days of logs analyzed | Created White Claw business concept |
| Feb 16 | Built key validation, rotation, Telegram switching | Operational automation |
| Feb 17 | Gateway mode missing, stripped config, env var issues | Fixed all 7 issues |
| Feb 17 | Created openclaw-ops.ps1 master script | One-command recovery |
| Feb 17 | Documented everything in this package | White Claw service ready |

### Key Insight (Replit Premise)

> "Don't fight the constraint. Move the work to where you have access."

Applied to OpenClaw: Don't depend on strong local hardware or a single paid API. Make the default configuration **cloud-first and hardware-agnostic**. Local models are an enhancement, not the backbone.

---

## License

This documentation and the associated scripts are part of the White Claw service offering by Tylar Cameron. The scripts are provided as-is for educational and operational purposes.

---

*Built from 14 days of real debugging. Every fix in this package solves a problem we actually hit.*
