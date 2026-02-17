#!/usr/bin/env node
/**
 * Validate which Ollama Cloud API keys work (not rate limited).
 * Run from workspace: node skills/ollama-cloud-rotator/validate-keys.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env
const envPaths = [
  path.join(__dirname, '..', '..', '.env'),
  path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw', 'workspace', '.env')
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    });
    break;
  }
}

const ACCOUNTS = [
  { name: 'glass', env: 'OLLAMA_GLASS_API_KEY' },
  { name: 'glass-2', env: 'OLLAMA_GLASS_API_KEY_2' },
  { name: 'glass-3', env: 'OLLAMA_GLASS_API_KEY_3' },
  { name: 'glass-4', env: 'OLLAMA_GLASS_API_KEY_4' },
  { name: 'glass-5 (tylar)', env: 'OLLAMA_GLASS_API_KEY_5' },
  { name: 'brudda', env: 'OLLAMA_GLASS_API_KEY_6' }
];

function testKey(key, label) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: 'kimi-k2.5:cloud',
      messages: [{ role: 'user', content: 'hi' }],
      stream: false
    });
    const req = https.request(
      {
        hostname: 'ollama.com',
        path: '/api/chat',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      },
      (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve({ ok: true, status: 200 });
          } else if (res.statusCode === 429) {
            let msg = 'rate limited';
            try {
              const j = JSON.parse(data);
              if (j.error) msg = j.error;
            } catch (_) {}
            resolve({ ok: false, status: 429, msg });
          } else {
            let msg = data.slice(0, 100).replace(/\s+/g, ' ');
            try {
              const j = JSON.parse(data);
              if (j.error) msg = j.error;
            } catch (_) {}
            resolve({ ok: false, status: res.statusCode, msg });
          }
        });
      }
    );
    req.on('error', e => resolve({ ok: false, status: 0, msg: e.message }));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ ok: false, status: 0, msg: 'timeout' });
    });
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('\n🔍 Validating Ollama Cloud API keys...\n');
  const results = [];
  for (const acc of ACCOUNTS) {
    const key = process.env[acc.env];
    if (!key) {
      console.log(`   ${acc.name}: ⚠️  no key in .env (${acc.env})`);
      results.push({ name: acc.name, ok: false, reason: 'missing' });
      continue;
    }
    const r = await testKey(key, acc.name);
    const icon = r.ok ? '✅' : '❌';
    const detail = r.ok ? 'OK' : (r.status === 429 ? `429 ${r.msg || 'rate limited'}` : `${r.status} ${r.msg || ''}`);
    console.log(`   ${acc.name}: ${icon}  ${detail}`);
    results.push({ name: acc.name, ok: r.ok, status: r.status, msg: r.msg });
  }
  const working = results.filter(x => x.ok);
  console.log('\n' + '─'.repeat(50));
  if (working.length > 0) {
    console.log(`✅ ${working.length} key(s) working: ${working.map(x => x.name).join(', ')}`);
    console.log('\n   Switch to one:  node skills/ollama-cloud-rotator/switch.js ' + working[0].name);
    console.log('   Or from Telegram: /model ' + working[0].name);
  } else {
    console.log('❌ No keys currently usable (all rate limited or missing).');
    console.log('   Wait for session/weekly reset, or add a new account key.');
  }
  console.log('');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
