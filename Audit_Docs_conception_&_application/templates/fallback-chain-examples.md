# Fallback Chain Examples

Choose the right model priority based on your client's situation.

---

## Budget: Free Only (No Credit Card)

Best for: Students, hobbyists, anyone who won't pay for API access.

```json
"primary": "google/gemini-2.0-flash",
"fallbacks": [
  "ollama-cloud/kimi-k2.5:cloud",
  "openrouter/meta-llama/llama-3.1-8b-instruct:free"
]
```

**Pros:** Zero cost. Gemini has generous free tier (1M tokens/day).
**Cons:** Rate limits on all three. If all fail, agent stops.

---

## Budget + Local: Free with Ollama Backup

Best for: Developer with decent hardware (16GB+ RAM, optional GPU).

```json
"primary": "google/gemini-2.0-flash",
"fallbacks": [
  "ollama-cloud/kimi-k2.5:cloud",
  "ollama/llama3.2:latest",
  "ollama/qwen2.5-coder:7b"
]
```

**Pros:** Never fully down -- local Ollama always available.
**Cons:** Local models are slower and less capable.

---

## Balanced: Cloud-First with Local Safety Net

Best for: Power users who want quality but don't want to pay much.

```json
"primary": "ollama-cloud/kimi-k2.5:cloud",
"fallbacks": [
  "ollama-cloud/minimax-m2:cloud",
  "google/gemini-2.0-flash",
  "ollama/llama3.2:latest",
  "ollama/qwen2.5-coder:14b",
  "ollama/qwen2.5:7b"
]
```

**Pros:** Best free model first, multiple fallbacks, local as last resort.
**Cons:** Cloud models may all rate-limit in same window.

---

## Reliability: Never Down (Multiple Clouds + Local)

Best for: Business-critical agents, Telegram bots that must always respond.

```json
"primary": "ollama-cloud/kimi-k2.5:cloud",
"fallbacks": [
  "ollama-cloud/minimax-m2:cloud",
  "google/gemini-2.0-flash",
  "openrouter/meta-llama/llama-3.1-8b-instruct:free",
  "ollama/llama3.2:latest",
  "ollama/qwen2.5:7b",
  "kimi-coding/kimi-k2-thinking"
]
```

**Pros:** 7 models across 5 providers. Virtually impossible for all to fail.
**Cons:** Quality degrades as you go down the chain.

---

## Quality-First: Best Models, Will Pay

Best for: Agencies, professionals who value quality over cost.

```json
"primary": "anthropic/claude-sonnet-4-5",
"fallbacks": [
  "google/gemini-2.0-flash",
  "openrouter/anthropic/claude-3.5-haiku",
  "ollama-cloud/kimi-k2.5:cloud"
]
```

**Pros:** Best quality models first.
**Cons:** Claude costs $3-15/MTok. Could get expensive with heavy use.

---

## Coding-Focused: Developer Agent

Best for: Developers using OpenClaw for coding assistance.

```json
"primary": "ollama-cloud/kimi-k2.5:cloud",
"fallbacks": [
  "kimi-coding/kimi-k2-thinking",
  "ollama/qwen2.5-coder:14b",
  "ollama/qwen2.5-coder:32b",
  "google/gemini-2.0-flash"
]
```

**Pros:** Kimi K2.5 and Qwen Coder are strong for code.
**Cons:** Local coder models need 16GB+ RAM (14b) or 32GB+ (32b).

---

## Offline / Privacy-First: Local Only

Best for: Users who can't or won't send data to cloud APIs.

```json
"primary": "ollama/qwen2.5-coder:14b",
"fallbacks": [
  "ollama/llama3.2:latest",
  "ollama/qwen2.5:7b"
]
```

**Pros:** All data stays on device. No API keys needed.
**Cons:** Requires strong hardware. No cloud fallback.

---

## Multi-Account Rotation: Rate Limit Buster

Best for: Heavy users of free Ollama Cloud with multiple accounts.

```json
"primary": "ollama-cloud/kimi-k2.5:cloud",
"fallbacks": [
  "ollama-cloud/minimax-m2:cloud",
  "google/gemini-2.0-flash",
  "ollama/llama3.2:latest"
]
```

Combined with `switch.js` rotation script and multiple Ollama Cloud accounts:
- When account 1 hits rate limit: `./openclaw-ops switch glass-2`
- When account 2 hits rate limit: `./openclaw-ops switch glass-3`
- Rinse and repeat across all accounts.

---

## How to Choose

| Question | If Yes | If No |
|----------|--------|-------|
| Do they have a GPU? | Include local models high in chain | Cloud-only |
| Will they pay for APIs? | Use Claude/GPT as primary | Free models only |
| Is uptime critical? | 5+ models across 3+ providers | 2-3 models is fine |
| Do they need coding help? | Include Qwen Coder / Kimi | General models fine |
| Privacy concerns? | Local-only or self-hosted | Cloud is fine |
| Multiple Ollama accounts? | Set up rotation script | Single account |
