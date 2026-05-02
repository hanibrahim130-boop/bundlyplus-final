import fs from 'fs';
import https from 'https';
import path from 'path';

const logoDir = './public/logos';

// Map: slug -> domain for Clearbit logo API
const toFetch = {
  '1password': '1password.com',
  'affinity-universal': 'affinity.serif.com',
  'airtable-plus': 'airtable.com',
  'asana-starter': 'asana.com',
  'audible-premium-plus': 'audible.com',
  'audiomack-premium': 'audiomack.com',
  'babbel-all-languages': 'babbel.com',
  'bitwarden-premium': 'bitwarden.com',
  'blinkist-premium': 'blinkist.com',
  'brilliant-premium': 'brilliant.org',
  'calendly-standard': 'calendly.com',
  'character-ai-plus': 'character.ai',
  'clickup-unlimited': 'clickup.com',
  'coursera-plus': 'coursera.org',
  'cyberghost-vpn': 'cyberghostvpn.com',
  'dashlane-premium': 'dashlane.com',
  'deezer-premium': 'deezer.com',
  'dropbox-plus': 'dropbox.com',
  'elevenlabs-starter': 'elevenlabs.io',
  'everand-scribd': 'everand.com',
  'evernote-personal': 'evernote.com',
  'geforce-now-priority': 'nvidia.com',
  'geforce-now-ultimate': 'nvidia.com',
  'heygen-creator': 'heygen.com',
  'hubspot-marketing-starter': 'hubspot.com',
  'kindle-unlimited': 'amazon.com',
  'linkedin-learning': 'linkedin.com',
  'luma-dream-machine': 'lumalabs.ai',
  'mailchimp-essentials': 'mailchimp.com',
  'malwarebytes-premium': 'malwarebytes.com',
  'masterclass-plus': 'masterclass.com',
  'mega-pro-i-2tb': 'mega.io',
  'monday-com-basic': 'monday.com',
  'mubi': 'mubi.com',
  'mullvad-vpn': 'mullvad.net',
  'osn-plus': 'osn.com',
  'pcloud-premium-500gb': 'pcloud.com',
  'peacock-premium': 'peacocktv.com',
  'pixlr-premium': 'pixlr.com',
  'procreate-plus-pack': 'procreate.com',
  'proton-vpn-plus': 'protonvpn.com',
  'quillbot-premium': 'quillbot.com',
  'rosetta-stone-unlimited': 'rosettastone.com',
  'shahid-vip': 'shahid.mbc.net',
  'sketch-standard': 'sketch.com',
  'skillshare-premium': 'skillshare.com',
  'soundcloud-go-plus': 'soundcloud.com',
  'suno-pro': 'suno.com',
  'surfshark-one': 'surfshark.com',
  'todoist-pro': 'todoist.com',
  'trello-premium': 'trello.com',
  'typeform-basic': 'typeform.com',
  'ubisoft-plus-premium': 'ubisoft.com',
  'udemy-personal-plan': 'udemy.com',
  'upwork-freelancer-plus': 'upwork.com',
  'vix-plus': 'vix.com',
  'watchit': 'watchit.com',
  'jawwy-tv': 'jawwy.tv',
  'weyyak': 'weyyak.com',
  'zee5-global': 'zee5.com',
  'zapier-starter': 'zapier.com',
  'zoom-pro': 'zoom.us',
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

function downloadPng(domain, slug) {
  return new Promise(async (resolve) => {
    const filePath = path.join(logoDir, `${slug}.png`);
    
    if (fs.existsSync(filePath) || fs.existsSync(path.join(logoDir, `${slug}.svg`))) {
      console.log(`  SKIP ${slug} (already exists)`);
      resolve(true);
      return;
    }

    try {
      const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      const res = await followRedirects(url);
      if (res.statusCode !== 200) {
        console.log(`  FAIL ${slug} (${res.statusCode})`);
        res.resume();
        resolve(false);
        return;
      }
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(filePath).size;
        if (size < 200) {
          fs.unlinkSync(filePath);
          console.log(`  TINY ${slug} (${size}b) — skipped`);
          resolve(false);
        } else {
          console.log(`  OK   ${slug}.png (${size}b)`);
          resolve(true);
        }
      });
    } catch (e) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      console.log(`  ERR  ${slug}: ${e.message}`);
      resolve(false);
    }
  });
}

async function main() {
  const entries = Object.entries(toFetch);
  console.log(`Fetching ${entries.length} logos...\n`);
  let ok = 0, fail = 0;
  for (const [slug, domain] of entries) {
    const result = await downloadPng(domain, slug);
    if (result) ok++; else fail++;
  }
  console.log(`\nDone: ${ok} OK, ${fail} failed`);
}

main();
