import fs from 'fs';
import https from 'https';
import path from 'path';

const logoDir = './public/logos';

// Map: slug (our file name) -> Simple Icons slug
// See https://simpleicons.org for available icons
const iconMap = {
  '1password': '1password',
  'airtable-plus': 'airtable',
  'asana-starter': 'asana',
  'audible-premium-plus': 'audible',
  'bitwarden-premium': 'bitwarden',
  'blinkist-premium': 'blinkist',
  'brilliant-premium': 'brilliant',
  'calendly-standard': 'calendly',
  'clickup-unlimited': 'clickup',
  'coursera-plus': 'coursera',
  'cyberghost-vpn': 'cyberghostvpn',
  'dashlane-premium': 'dashlane',
  'deezer-premium': 'deezer',
  'dropbox-plus': 'dropbox',
  'elevenlabs-starter': 'elevenlabs',
  'evernote-personal': 'evernote',
  'hubspot-marketing-starter': 'hubspot',
  'linkedin-learning': 'linkedin',
  'mailchimp-essentials': 'mailchimp',
  'malwarebytes-premium': 'malwarebytes',
  'masterclass-plus': 'masterclass',
  'mega-pro-i-2tb': 'mega',
  'monday-com-basic': 'monday',
  'mubi': 'mubi',
  'mullvad-vpn': 'mullvadvpn',
  'peacock-premium': 'peacock',
  'pcloud-premium-500gb': 'pcloud',
  'proton-vpn-plus': 'protonvpn',
  'sketch-standard': 'sketch',
  'skillshare-premium': 'skillshare',
  'soundcloud-go-plus': 'soundcloud',
  'surfshark-one': 'surfshark',
  'todoist-pro': 'todoist',
  'trello-premium': 'trello',
  'typeform-basic': 'typeform',
  'ubisoft-plus-premium': 'ubisoft',
  'udemy-personal-plan': 'udemy',
  'upwork-freelancer-plus': 'upwork',
  'zapier-starter': 'zapier',
  'zee5-global': 'zee5',
  'zoom-pro': 'zoom',
  // Also replace the Google favicon ones that look bad
  'affinity-universal': 'affinitydesigner',
  'audiomack-premium': 'audiomack',
  'babbel-all-languages': 'babel',
  'character-ai-plus': 'character.ai',  
  'everand-scribd': 'scribd',
  'geforce-now-priority': 'nvidia',
  'geforce-now-ultimate': 'nvidia',
  'kindle-unlimited': 'amazonkindle',
  'pixlr-premium': 'pixlr',
  'quillbot-premium': 'quillbot',
  'rosetta-stone-unlimited': 'rosettastone',
  'suno-pro': 'suno',
  // Existing ones that might be improved
  'adobe-cc': 'adobecreativecloud',
  'amazon-prime': 'amazonprime',
  'apple-tv': 'appletv',
  'apple-music': 'applemusic',
  'canva': 'canva',
  'chatgpt': 'openai',
  'crunchyroll': 'crunchyroll',
  'cursor': 'cursor',
  'dazn': 'dazn',
  'descript': 'descript',
  'disney-plus': 'disneyplus',
  'duolingo': 'duolingo',
  'ea-play': 'ea',
  'expressvpn': 'expressvpn',
  'figma': 'figma',
  'framer': 'framer',
  'github-copilot': 'githubcopilot',
  'google-gemini': 'googlegemini',
  'google-workspace': 'google',
  'grammarly': 'grammarly',
  'hulu': 'hulu',
  'jasper': 'jasper',
  'linear': 'linear',
  'loom': 'loom',
  'max-hbo': 'max',
  'microsoft-365': 'microsoft365',
  'microsoft-copilot': 'microsoftcopilot',  
  'midjourney': 'midjourney',
  'netflix': 'netflix',
  'nintendo': 'nintendoswitch',
  'nordvpn': 'nordvpn',
  'notion': 'notion',
  'paramount-plus': 'paramount',
  'perplexity': 'perplexity',
  'playstation': 'playstation',
  'roblox': 'roblox',
  'runway': 'runway',
  'slack': 'slack',
  'spotify': 'spotify',
  'steam': 'steam',
  'synthesia': 'synthesia',
  'tidal': 'tidal',
  'vercel': 'vercel',
  'writesonic': 'writesonic',
  'xbox': 'xbox',
  'youtube': 'youtube',
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
  // Remove old png if we're replacing with svg
  const pngPath = path.join(logoDir, `${ourSlug}.png`);
  
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
      console.log(`  FAIL ${ourSlug} <- ${simpleSlug} (not SVG)`);
      return false;
    }
    
    fs.writeFileSync(filePath, svg);
    // Remove old png now that we have svg
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
  console.log(`Fetching ${entries.length} SVG logos from Simple Icons...\n`);
  let ok = 0, fail = 0;
  for (const [ourSlug, simpleSlug] of entries) {
    const result = await downloadSvg(simpleSlug, ourSlug);
    if (result) ok++; else fail++;
  }
  console.log(`\nDone: ${ok} OK, ${fail} failed`);
}

main();
