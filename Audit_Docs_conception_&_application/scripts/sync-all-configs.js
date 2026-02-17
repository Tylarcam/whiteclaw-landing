#!/usr/bin/env node
/**
 * Sync All OpenClaw Configs
 * 
 * Single script that keeps openclaw.json, agent models.json, and auth-profiles.json
 * all in sync. Run after any key rotation or config change.
 * 
 * Usage: node scripts/sync-all-configs.js [--clear-cooldowns] [--dry-run]
 * 
 * What it does:
 *   1. Reads openclaw.json as source of truth for provider keys
 *   2. Updates ollama-cloud apiKey in ALL agent models.json files
 *   3. Injects gateway URL + token into all agent auth-profiles.json
 *   4. Optionally clears stale cooldowns (--clear-cooldowns)
 *   5. Reports what was changed
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
const clearCooldowns = args.includes('--clear-cooldowns');
const dryRun = args.includes('--dry-run');

const home = os.homedir();
const OPENCLAW_ROOT = path.join(home, '.openclaw');
const GLOBAL_CONFIG = path.join(OPENCLAW_ROOT, 'openclaw.json');
const AGENTS_DIR = path.join(OPENCLAW_ROOT, 'agents');

console.log('\n🔄 OpenClaw Config Sync');
console.log('─'.repeat(50));

if (dryRun) console.log('   [DRY RUN - no files will be modified]\n');

// 1. Read global config
if (!fs.existsSync(GLOBAL_CONFIG)) {
  console.error('❌ Missing:', GLOBAL_CONFIG);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(GLOBAL_CONFIG, 'utf8'));

// Extract key values from global config
const ollamaCloudKey = config.models?.providers?.['ollama-cloud']?.apiKey;
const ollamaCloudBaseUrl = config.models?.providers?.['ollama-cloud']?.baseUrl;
const googleKey = config.models?.providers?.google?.apiKey;
const kimiKey = config.models?.providers?.['kimi-coding']?.apiKey;
const gatewayToken = config.gateway?.auth?.token;
const gatewayPort = config.gateway?.port || 18789;
const gatewayUrl = `http://127.0.0.1:${gatewayPort}`;

console.log('📋 Source of truth: openclaw.json');
console.log(`   ollama-cloud key: ${ollamaCloudKey ? ollamaCloudKey.substring(0, 12) + '...' : '❌ MISSING'}`);
console.log(`   google key: ${googleKey ? googleKey.substring(0, 12) + '...' : '❌ MISSING'}`);
console.log(`   kimi-coding key: ${kimiKey ? kimiKey.substring(0, 12) + '...' : '❌ MISSING'}`);
console.log(`   gateway: ${gatewayUrl} (token: ${gatewayToken ? '✅' : '❌'})`);
console.log('');

// 2. Find all agent directories
if (!fs.existsSync(AGENTS_DIR)) {
  console.log('No agents directory at', AGENTS_DIR);
  process.exit(0);
}

const agentDirs = fs.readdirSync(AGENTS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log(`📂 Found ${agentDirs.length} agent(s): ${agentDirs.join(', ')}\n`);

let changes = 0;

for (const agent of agentDirs) {
  const agentDir = path.join(AGENTS_DIR, agent, 'agent');
  if (!fs.existsSync(agentDir)) continue;

  console.log(`🤖 Agent: ${agent}`);

  // --- Sync models.json ---
  const modelsPath = path.join(agentDir, 'models.json');
  if (fs.existsSync(modelsPath)) {
    try {
      const models = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));
      let modelsChanged = false;

      // Update ollama-cloud provider key
      if (ollamaCloudKey && models.providers?.['ollama-cloud']) {
        const currentKey = models.providers['ollama-cloud'].apiKey;
        if (currentKey !== ollamaCloudKey) {
          console.log(`   models.json: ollama-cloud key ${currentKey?.substring(0, 8)}... → ${ollamaCloudKey.substring(0, 8)}...`);
          models.providers['ollama-cloud'].apiKey = ollamaCloudKey;
          modelsChanged = true;
        } else {
          console.log(`   models.json: ollama-cloud key ✅ already in sync`);
        }
      }

      // Update individual ollama-glass-N providers (cline-style configs)
      for (const [provName, prov] of Object.entries(models.providers || {})) {
        if (provName.startsWith('ollama-glass-') && prov.apiKey) {
          const glassNum = provName.replace('ollama-glass-', '');
          const envKey = `OLLAMA_GLASS_API_KEY${glassNum === '1' ? '' : '_' + glassNum}`;
          const freshKey = process.env[envKey];
          if (freshKey && prov.apiKey !== freshKey) {
            console.log(`   models.json: ${provName} key → updated from .env`);
            models.providers[provName].apiKey = freshKey;
            modelsChanged = true;
          }
        }
      }

      // Update google key if present
      if (googleKey && models.providers?.google) {
        if (models.providers.google.apiKey !== googleKey) {
          console.log(`   models.json: google key → updated`);
          models.providers.google.apiKey = googleKey;
          modelsChanged = true;
        }
      }

      // Update kimi/moonshot keys if present
      for (const provName of ['kimi-coding', 'moonshot', 'kimi']) {
        if (kimiKey && models.providers?.[provName]?.apiKey) {
          if (models.providers[provName].apiKey !== kimiKey) {
            console.log(`   models.json: ${provName} key → updated`);
            models.providers[provName].apiKey = kimiKey;
            modelsChanged = true;
          }
        }
      }

      if (modelsChanged && !dryRun) {
        fs.writeFileSync(modelsPath, JSON.stringify(models, null, 2) + '\n', 'utf8');
        changes++;
      }
    } catch (e) {
      console.log(`   ❌ models.json error: ${e.message}`);
    }
  } else {
    console.log(`   models.json: not found (skipping)`);
  }

  // --- Sync auth-profiles.json ---
  const authPath = path.join(agentDir, 'auth-profiles.json');
  if (fs.existsSync(authPath)) {
    try {
      const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
      let authChanged = false;

      // Inject gateway config
      if (gatewayToken) {
        const newGateway = { url: gatewayUrl, token: gatewayToken };
        if (JSON.stringify(auth.gateway) !== JSON.stringify(newGateway)) {
          console.log(`   auth-profiles.json: gateway → ${gatewayUrl}`);
          auth.gateway = newGateway;
          authChanged = true;
        } else {
          console.log(`   auth-profiles.json: gateway ✅ in sync`);
        }
      }

      // Clear cooldowns if requested
      if (clearCooldowns && auth.usageStats) {
        let cooldownsCleared = 0;
        for (const [profileId, stats] of Object.entries(auth.usageStats)) {
          if (stats.cooldownUntil && stats.cooldownUntil > 0) {
            console.log(`   auth-profiles.json: clearing cooldown on ${profileId}`);
            stats.cooldownUntil = 0;
            stats.errorCount = 0;
            stats.failureCounts = {};
            cooldownsCleared++;
            authChanged = true;
          }
          if (stats.disabledUntil && stats.disabledUntil > 0) {
            console.log(`   auth-profiles.json: clearing disabled on ${profileId}`);
            stats.disabledUntil = 0;
            delete stats.disabledReason;
            cooldownsCleared++;
            authChanged = true;
          }
        }
        if (cooldownsCleared === 0) {
          console.log(`   auth-profiles.json: no stale cooldowns`);
        }
      }

      if (authChanged && !dryRun) {
        fs.writeFileSync(authPath, JSON.stringify(auth, null, 2) + '\n', 'utf8');
        changes++;
      }
    } catch (e) {
      console.log(`   ❌ auth-profiles.json error: ${e.message}`);
    }
  } else {
    console.log(`   auth-profiles.json: not found (skipping)`);
  }

  console.log('');
}

console.log('─'.repeat(50));
if (dryRun) {
  console.log(`🔍 Dry run complete. ${changes} file(s) would be updated.`);
} else {
  console.log(`✅ Sync complete. ${changes} file(s) updated.`);
}
console.log('💡 Restart gateway: openclaw gateway stop && openclaw gateway');
console.log('');
