#!/usr/bin/env node
/**
 * Validate Gemini API key by making a test request
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env from workspace root
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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in .env');
  process.exit(1);
}

console.log('\n🔍 Validating Gemini API key...\n');

function testGeminiKey(apiKey) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{
        parts: [{ text: 'Hi' }]
      }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ status: 'OK', statusCode: 200 });
        } else if (res.statusCode === 429) {
          try {
            const json = JSON.parse(data);
            const msg = json.error?.message || 'Rate limit reached';
            resolve({ status: 'RATE_LIMITED', statusCode: 429, message: msg });
          } catch {
            resolve({ status: 'RATE_LIMITED', statusCode: 429, message: 'Rate limit' });
          }
        } else {
          try {
            const json = JSON.parse(data);
            const msg = json.error?.message || data.substring(0, 100);
            resolve({ status: 'ERROR', statusCode: res.statusCode, message: msg });
          } catch {
            resolve({ status: 'ERROR', statusCode: res.statusCode, message: data.substring(0, 100) });
          }
        }
      });
    });

    req.on('error', (error) => {
      resolve({ status: 'ERROR', message: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ status: 'TIMEOUT', message: 'Request timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  const result = await testGeminiKey(GEMINI_API_KEY);
  
  if (result.status === 'OK') {
    console.log('   Gemini (gemini-2.0-flash): ✅  OK');
  } else if (result.status === 'RATE_LIMITED') {
    console.log(`   Gemini (gemini-2.0-flash): ❌  ${result.statusCode} ${result.message}`);
  } else {
    console.log(`   Gemini (gemini-2.0-flash): ❌  ${result.statusCode || 'ERROR'} ${result.message}`);
  }
  
  console.log('\n──────────────────────────────────────────────────');
  
  if (result.status === 'OK') {
    console.log('✅ Gemini API key is working\n');
  } else {
    console.log('❌ Gemini API key is not working\n');
  }
}

main();
