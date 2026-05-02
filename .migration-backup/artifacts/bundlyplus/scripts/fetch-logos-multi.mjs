import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';

const logoDir = './public/logos';

// Products needing better logos: slug -> domain
const targets = {
  'affinity-universal': 'affinity.serif.com',
  'blinkist-premium': 'blinkist.com',
  'brilliant-premium': 'brilliant.org',
  'character-ai-plus': 'character.ai',
  'cyberghost-vpn': 'cyberghostvpn.com',
  'everand-scribd': 'scribd.com',
  'heygen-creator': 'heygen.com',
  'kindle-unlimited': 'read.amazon.com',
  'linkedin-learning': 'linkedin.com',
  'luma-dream-machine': 'lumalabs.ai',
  'masterclass-plus': 'masterclass.com',
  'monday-com-basic': 'monday.com',
  'pcloud-premium-500gb': 'pcloud.com',
  'peacock-premium': 'peacocktv.com',
  'procreate-plus-pack': 'procreate.com',
  'quillbot-premium': 'quillbot.com',
  'rosetta-stone-unlimited': 'rosettastone.com',
  'vix-plus': 'vix.com',
  'zee5-global': 'zee5.com',
};

// Multiple providers to try, in order of quality
const providers = [
  {
    name: 'unavatar',
    url: (domain) => `https://unavatar.io/${domain}?fallback=false`,
  },
  {
    name: 'icon.horse',
    url: (domain) => `https://icon.horse/icon/${domain}?size=large`,
  },
  {
    name: 'google-hd',
    url: (domain) => `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=256`,
  },
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        resolve({ status: res.statusCode, type: res.headers['content-type'] || '', data: buf });
      });
    }).on('error', reject).on('timeout', () => reject(new Error('timeout')));
  });
}

async function tryProviders(slug, domain) {
  const filePath = path.join(logoDir, `${slug}.png`);
  
  for (const provider of providers) {
    try {
      const url = provider.url(domain);
      const res = await fetchUrl(url);
      
      if (res.status !== 200 || res.data.length < 500) {
        continue;
      }
      
      // Check it's actually an image
      const type = res.type.toLowerCase();
      if (!type.includes('image') && !type.includes('octet')) {
        continue;
      }

      // Determine extension
      let ext = 'png';
      if (type.includes('svg')) ext = 'svg';
      else if (type.includes('jpeg') || type.includes('jpg')) ext = 'png'; // keep as png name
      else if (type.includes('ico')) continue; // skip ico, too small
      
      const outPath = ext === 'svg' 
        ? path.join(logoDir, `${slug}.svg`) 
        : filePath;
      
      fs.writeFileSync(outPath, res.data);
      
      // If we got SVG, remove old PNG
      if (ext === 'svg' && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      console.log(`  OK   ${slug}.${ext} (${res.data.length}b) via ${provider.name}`);
      return true;
    } catch (e) {
      // Try next provider
      continue;
    }
  }
  
  console.log(`  FAIL ${slug} (all providers failed)`);
  return false;
}

async function main() {
  const entries = Object.entries(targets);
  console.log(`Fetching ${entries.length} logos from multiple providers...\n`);
  let ok = 0, fail = 0;
  
  for (const [slug, domain] of entries) {
    const result = await tryProviders(slug, domain);
    if (result) ok++; else fail++;
  }
  
  console.log(`\nDone: ${ok} OK, ${fail} failed`);
}

main();
