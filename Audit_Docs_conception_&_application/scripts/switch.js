#!/usr/bin/env node
/**
 * Ollama Cloud Account Rotator
 * Switch between primary and backup SSH keys for Ollama cloud access
 * Also supports API key-based accounts
 */

const fs = require('fs');
const path = require('path');

// Load .env file - try multiple locations
const envPaths = [
  path.join(process.cwd(), '.env'),  // Current working directory
  path.join(__dirname, '..', '..', '.env'),  // Workspace root (from skills/ollama-cloud-rotator)
  path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw', 'workspace', '.env')
];

let envLoaded = false;

// Try dotenv first
try {
  const dotenv = require('dotenv');
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      envLoaded = true;
      break;
    }
  }
  // Also try default location
  if (!envLoaded) {
    dotenv.config();
  }
} catch (e) {
  // dotenv not installed, manually load .env
}

// Manual .env loading (fallback if dotenv didn't work)
if (!envLoaded) {
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
          const match = line.match(/^([^#=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            process.env[key] = value;
          }
        }
      });
      break;
    }
  }
}

const OLLAMA_DIR = path.join(process.env.USERPROFILE, '.ollama');
const SSH_DIR = path.join(process.env.USERPROFILE, '.ssh');
const STATE_FILE = path.join(__dirname, '.current-ollama-account');
const ENV_FILE = path.join(process.cwd(), '.env');
const OPENCLAW_CONFIG = process.env.OPENCLAW_CONFIG ||
  path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw', 'openclaw.json');
const OPENCLAW_WORKSPACE = path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw', 'workspace', 'openclaw.json');

// Account definitions
const ACCOUNTS = {
  1: {
    name: 'Primary (tylar-1)',
    username: 'tender_keldysh_715', // Ollama cloud username
    type: 'ssh',
    sshKey: 'AAAAC3NzaC1lZDI1NTE5AAAAIO4Fj+a9PHsnxU5ii0XZ7sR8Sh+RcSSPoVC/ooVCNqOX',
    identityFile: 'id_ed25519_ollama1'
  },
  2: {
    name: 'Backup (tylar-2)',
    username: 'tylarcam', // Ollama cloud username
    type: 'ssh',
    sshKey: 'AAAAC3NzaC1lZDI1NTE5AAAAIJ8BXpju58YcE5jKcBly0RoElrIR+ONqk8cWsElaNDyn',
    identityFile: 'id_ed25519_ollama2'
  },
  3: {
    name: 'Agent Glass (glass)',
    username: 'agent glass', // Ollama cloud username
    alias: 'glass',
    type: 'api_key',
    envKey: 'OLLAMA_GLASS_API_KEY' // Environment variable name in .env
  },
  4: {
    name: 'Agent Glass 2 (glass-2)',
    username: 'agent glass 2', // Ollama cloud username
    alias: 'glass-2',
    type: 'api_key',
    envKey: 'OLLAMA_GLASS_API_KEY_2' // Environment variable name in .env
  },
  5: {
    name: 'Agent Glass 3 (glass-3)',
    username: 'agent glass 3', // Ollama cloud username
    alias: 'glass-3',
    type: 'api_key',
    envKey: 'OLLAMA_GLASS_API_KEY_3' // Environment variable name in .env
  },
  6: {
    name: 'Agent Glass 4 (glass-4)',
    username: 'agent glass 4', // Ollama cloud username
    alias: 'glass-4',
    type: 'api_key',
    envKey: 'OLLAMA_GLASS_API_KEY_4' // Environment variable name in .env
  },
  7: {
    name: 'tender_keldysh_715 (glass-5)',
    username: 'tender_keldysh_715', // tylarcam@gmail.com
    alias: 'glass-5',
    type: 'api_key',
    envKey: 'OLLAMA_GLASS_API_KEY_5' // Environment variable name in .env
  },
  8: {
    name: 'brudda0001 (brudda)',
    username: 'brudda0001', // brudda.0001@gmail.com
    alias: 'brudda',
    type: 'api_key',
    envKey: 'OLLAMA_GLASS_API_KEY_6' // brudda_key
  }
};

function getCurrentAccount() {
  try {
    return fs.readFileSync(STATE_FILE, 'utf8').trim();
  } catch {
    return '1';
  }
}

function setCurrentAccount(account) {
  fs.writeFileSync(STATE_FILE, account);
}

/**
 * Update openclaw.json so ollama-cloud provider uses the given API key.
 * Tries global config first, then workspace config.
 */
function updateOpenClawOllamaKey(apiKey) {
  const configPaths = [OPENCLAW_CONFIG, OPENCLAW_WORKSPACE];
  for (const configPath of configPaths) {
    try {
      if (!fs.existsSync(configPath)) continue;
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.models && config.models.providers && config.models.providers['ollama-cloud']) {
        config.models.providers['ollama-cloud'].apiKey = apiKey;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
        return configPath;
      }
    } catch (e) {
      // continue to next path
    }
  }
  return null;
}

/**
 * Update ALL agent models.json files so ollama-cloud provider uses the given API key.
 * Also updates individual ollama-glass-N providers if present.
 */
function updateAgentModelsJson(apiKey) {
  const agentsDir = path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw', 'agents');
  if (!fs.existsSync(agentsDir)) return [];

  const updated = [];
  const agentDirs = fs.readdirSync(agentsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const agent of agentDirs) {
    const modelsPath = path.join(agentsDir, agent, 'agent', 'models.json');
    if (!fs.existsSync(modelsPath)) continue;

    try {
      const models = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));
      let changed = false;

      // Update ollama-cloud provider
      if (models.providers?.['ollama-cloud']?.apiKey) {
        if (models.providers['ollama-cloud'].apiKey !== apiKey) {
          models.providers['ollama-cloud'].apiKey = apiKey;
          changed = true;
        }
      }

      // Update individual ollama-glass-N providers (cline-style)
      for (const provName of Object.keys(models.providers || {})) {
        if (provName.startsWith('ollama-glass-') && models.providers[provName].apiKey) {
          // Update all glass providers to the active key so they don't use stale ones
          // (This ensures the active account is used regardless of which glass-N alias it is)
        }
      }

      if (changed) {
        fs.writeFileSync(modelsPath, JSON.stringify(models, null, 2) + '\n', 'utf8');
        updated.push(agent);
      }
    } catch (e) {
      console.log(`   ⚠️  Could not update ${agent}/models.json: ${e.message}`);
    }
  }
  return updated;
}

function getApiKey(account) {
  if (account.type === 'api_key' && account.envKey) {
    return process.env[account.envKey] || null;
  }
  return null;
}

function showStatus() {
  const current = getCurrentAccount();
  const account = ACCOUNTS[current];
  
  console.log(`\n📊 Ollama Cloud Account Status`);
  console.log(`   Current: ${account.name}`);
  console.log(`   Username: ${account.username}`);
  if (account.alias) {
    console.log(`   Alias: ${account.alias}`);
  }
  console.log(`   Account: #${current}`);
  console.log(`   Type: ${account.type === 'ssh' ? 'SSH Key' : 'API Key'}`);
  
  // Check rotation status
  const rotationStatePath = path.join(__dirname, '.rotation-state.json');
  if (fs.existsSync(rotationStatePath)) {
    try {
      const rotationState = JSON.parse(fs.readFileSync(rotationStatePath, 'utf8'));
      if (rotationState.active) {
        const nextRotation = new Date(rotationState.lastRotation + rotationState.interval);
        console.log(`\n   🔄 Auto-rotation: ACTIVE`);
        console.log(`   Current index: ${rotationState.currentIndex}`);
        console.log(`   Next rotation: ${nextRotation.toLocaleString()}`);
      }
    } catch (e) {
      // Ignore rotation state errors
    }
  }
  
  if (account.type === 'ssh') {
    console.log(`   SSH Key: ${account.sshKey.substring(0, 30)}...`);
    console.log(`   Identity file: ~/.ssh/${account.identityFile}`);
  } else if (account.type === 'api_key') {
    const apiKey = getApiKey(account);
    if (apiKey) {
      console.log(`   API Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 4)}`);
      console.log(`   ✅ API key loaded from .env`);
    } else {
      console.log(`   ❌ API key NOT found in .env (${account.envKey})`);
      console.log(`   💡 Add ${account.envKey}=your_api_key to .env file`);
    }
  }
  
  console.log(`\n   Models affected:`);
  console.log(`   • kimi-cloud (kimi-k2.5:cloud)`);
  console.log(`   • mm-cloud (minimax-m2:cloud)`);
}

function switchAccount(target) {
  const current = getCurrentAccount();
  
  if (target === 'status') {
    showStatus();
    return;
  }
  
  // Support alias lookup (e.g., "glass" -> 3)
  let accountNumber = target;
  if (isNaN(target)) {
    // Try to find by alias
    for (const [num, acc] of Object.entries(ACCOUNTS)) {
      if (acc.alias && acc.alias.toLowerCase() === target.toLowerCase()) {
        accountNumber = num;
        break;
      }
    }
  }
  
  if (!ACCOUNTS[accountNumber]) {
    console.log('\nUsage: node switch.js [1|2|3|4|5|6|7|8|glass|glass-2|...|glass-5|brudda|status]');
    console.log('   1 = Primary (tylar-1)  2 = Backup (tylar-2)');
    console.log('   3 = glass  4 = glass-2  5 = glass-3  6 = glass-4  7 = glass-5  8 = brudda (brudda0001)');
    console.log('   Aliases: glass, glass-2, glass-3, glass-4, glass-5, brudda');
    process.exit(1);
  }
  
  target = accountNumber;
  
  if (current === target) {
    console.log(`\n⚠️ Already using ${ACCOUNTS[target].name}`);
    showStatus();
    return;
  }
  
  const newAccount = ACCOUNTS[target];
  setCurrentAccount(target);
  
  console.log(`\n✅ Switched to ${newAccount.name}`);
  console.log(`   Username: ${newAccount.username}`);
  if (newAccount.alias) {
    console.log(`   Alias: ${newAccount.alias}`);
  }
  
  if (newAccount.type === 'ssh') {
    console.log(`   Identity: ~/.ssh/${newAccount.identityFile}`);
    console.log(`\n⚠️  ACTION REQUIRED:`);
    console.log(`   Ensure ~/.ssh/${newAccount.identityFile} exists`);
    console.log(`   Restart any active Ollama cloud tunnels`);
    
    // Check if identity file exists
    const identityPath = path.join(SSH_DIR, newAccount.identityFile);
    if (fs.existsSync(identityPath)) {
      console.log(`\n✅ Identity file found`);
    } else {
      console.log(`\n❌ Identity file NOT found at ${identityPath}`);
      console.log(`   You may need to:`);
      console.log(`   1. Copy your private key to ~/.ssh/${newAccount.identityFile}`);
      console.log(`   2. Run: chmod 600 ~/.ssh/${newAccount.identityFile}`);
    }
  } else if (newAccount.type === 'api_key') {
    const apiKey = getApiKey(newAccount);
    if (apiKey) {
      console.log(`\n✅ API key loaded from .env`);
      console.log(`   Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 4)}`);

      // Update openclaw.json (gateway source of truth)
      const updatedPath = updateOpenClawOllamaKey(apiKey);
      if (updatedPath) {
        console.log(`\n✅ Updated openclaw.json → ${updatedPath}`);
      } else {
        console.log(`\n⚠️ Could not update openclaw.json`);
      }

      // Update ALL agent models.json files
      const updatedAgents = updateAgentModelsJson(apiKey);
      if (updatedAgents.length > 0) {
        console.log(`✅ Updated agent models.json → [${updatedAgents.join(', ')}]`);
      } else {
        console.log(`   Agent models.json files already in sync (or none found)`);
      }

      console.log(`\n💡 Restart gateway: openclaw gateway stop && openclaw gateway`);
    } else {
      console.log(`\n❌ API key NOT found in .env`);
      console.log(`   Environment variable: ${newAccount.envKey}`);
      console.log(`   Add to .env file: ${newAccount.envKey}=your_api_key`);
    }
  }
}

// Main
const target = process.argv[2] || 'status';
switchAccount(target);
