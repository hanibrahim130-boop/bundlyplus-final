import fs from 'fs';
import https from 'https';
import path from 'path';

const logoDir = './public/logos';

// Round 2: fix the 404s with correct slugs from simpleicons.org
const iconMap = {
  'cyberghost-vpn': 'cyberghostvpn',
  'linkedin-learning': 'linkedin',
  'monday-com-basic': 'mondaydotcom',
  'mullvad-vpn': 'mullvad',
  'peacock-premium': 'peacock',
  'pcloud-premium-500gb': 'pcloud',
  'affinity-universal': 'affinitydesigner2',
  'character-ai-plus': 'characterai',
  'everand-scribd': 'scribd',
  'kindle-unlimited': 'kindle',
  'quillbot-premium': 'quillbot',
  'adobe-cc': 'adobe',
  'amazon-prime': 'primevideo',
  'canva': 'canva',
  'chatgpt': 'openai',
  'disney-plus': 'disney',
  'descript': 'descript',
  'hulu': 'hulu',
  'jasper': 'jasper',
  'microsoft-365': 'microsoft',
  'microsoft-copilot': 'microsoft',
  'midjourney': 'midjourney',
  'nintendo': 'nintendo',
  'paramount-plus': 'paramountplus',
  'runway': 'runwayml',
  'slack': 'slack',
  'synthesia': 'synthesia',
  'writesonic': 'writesonic',
  'xbox': 'xbox',
  'blinkist-premium': 'blinkist',
  'brilliant-premium': 'brilliant',
  'masterclass-plus': 'masterclass',
  'rosetta-stone-unlimited': 'rosettastone',
  'zee5-global': 'zee5',
};

function followRedirects(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        followRedirects(res.headers.location).then(resolve).catch(reject);
      } else {
        resolve(res);
      }
    }).on('error', reject);
  });
}

async function downloadSvg(simpleSlug, ourSlug) {
  const filePath = path.join(logoDir, `${ourSlug}.svg`);
  
  // Skip if we already have an SVG from round 1
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('<svg') && content.length > 200) {
      console.log(`  SKIP ${ourSlug} (already good)`);
      return true;
    }
  }

  try {
    const url = `https://cdn.simpleicons.org/${simpleSlug}`;
    const res = await followRedirects(url);
    
    if (res.statusCode !== 200) {
      console.log(`  FAIL ${ourSlug} <- ${simpleSlug} (${res.statusCode})`);
      res.resume();
      return false;
    }
    
    const chunks = [];
    for await (const chunk of res) chunks.push(chunk);
    const svg = Buffer.concat(chunks).toString('utf8');
    
    if (!svg.includes('<svg')) {
      console.log(`  FAIL ${ourSlug} (not SVG content)`);
      return false;
    }
    
    fs.writeFileSync(filePath, svg);
    const pngPath = path.join(logoDir, `${ourSlug}.png`);
    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
    console.log(`  OK   ${ourSlug}.svg`);
    return true;
  } catch (e) {
    console.log(`  ERR  ${ourSlug}: ${e.message}`);
    return false;
  }
}

async function main() {
  const entries = Object.entries(iconMap);
  console.log(`Round 2: Fetching ${entries.length} logos...\n`);
  let ok = 0, fail = 0;
  for (const [ourSlug, simpleSlug] of entries) {
    const result = await downloadSvg(simpleSlug, ourSlug);
    if (result) ok++; else fail++;
  }
  console.log(`\nDone: ${ok} OK, ${fail} failed`);
}

main();
