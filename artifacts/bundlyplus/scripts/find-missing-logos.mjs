import fs from 'fs';
import path from 'path';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));
const logoDir = './public/logos';
const logos = fs.readdirSync(logoDir).map(f => f.replace(/\.(svg|png)$/, ''));

const slugOverrides = {
  'Perplexity AI': 'perplexity', 'Figma Professional': 'figma', 'Vercel Pro': 'vercel',
  'Microsoft 365 Personal': 'microsoft-365', 'Microsoft 365 Family': 'microsoft-365',
  'Notion AI': 'notion', 'Notion Plus': 'notion',
  'Adobe Creative Cloud': 'adobe-cc', 'Adobe Photoshop': 'adobe-cc', 'Adobe Premiere Pro': 'adobe-cc', 'Adobe Photography Plan': 'adobe-cc',
  'Loom Business': 'loom', 'ChatGPT Plus': 'chatgpt', 'ChatGPT Team': 'chatgpt',
  'YouTube Premium': 'youtube', 'YouTube Music Premium': 'youtube',
  'Apple TV+': 'apple-tv', 'Apple Music': 'apple-music', 'Apple Music Family': 'apple-music', 'Apple Arcade': 'apple-tv',
  'Canva Pro': 'canva', 'Google Workspace Business Starter': 'google-workspace',
  'GitHub Copilot Pro': 'github-copilot', 'GitHub Pro': 'github-copilot',
  'Framer Pro': 'framer', 'Funimation Premium': 'crunchyroll', 'Crunchyroll Mega Fan': 'crunchyroll',
  'Netflix Premium': 'netflix', 'Amazon Prime Video': 'amazon-prime',
  'Spotify Premium': 'spotify', 'Spotify Family': 'spotify',
  'Microsoft Copilot Pro': 'microsoft-copilot', 'Microsoft Teams Essentials': 'microsoft-365',
  'Duolingo Super': 'duolingo', 'PlayStation Plus Essential': 'playstation',
  'PlayStation Plus Extra': 'playstation', 'PlayStation Plus Premium': 'playstation',
  'Copy.ai Pro': 'copyai', 'Grammarly Premium': 'grammarly', 'Max (HBO Max)': 'max-hbo',
  'Slack Pro': 'slack', 'Cursor IDE Pro': 'cursor', 'Linear Business': 'linear',
  'Runway AI': 'runway', 'StarzPlay Arabia': 'starzplay',
  'Google Gemini Advanced': 'google-gemini', 'Google One 2TB': 'google-workspace', 'Google Play Pass': 'google-workspace',
  'Nintendo Switch Online': 'nintendo', 'Nintendo Switch Online + Expansion': 'nintendo',
  'Jasper AI': 'jasper', 'Tidal HiFi': 'tidal', 'TOD / beIN Sports': 'tod-bein',
  'Anghami Plus': 'anghami', 'Steam Wallet $20': 'steam', 'Steam Wallet $50': 'steam',
  'IPTV Premium – 4K': 'iptv-premium', 'EA Play Pro': 'ea-play',
  'Xbox Game Pass Ultimate': 'xbox', 'Xbox Gift Card $25': 'xbox',
  'Roblox – 1,000 Robux': 'roblox', 'Roblox – 2,200 Robux': 'roblox',
  'Disney+ Hulu Bundle': 'disney-plus', 'Disney+': 'disney-plus',
  'Hulu (No Ads)': 'hulu', 'Claude pro': 'chatgpt', 'Claude Max': 'chatgpt',
  'PlayStation Wallet $25': 'playstation',
  'iTunes / App Store $25': 'apple-music',
  'Free Fire 1,080 Diamonds': 'ea-play',
  'PUBG Mobile 660 UC': 'ea-play',
  'PC Game Pass': 'xbox', 'Paramount+': 'paramount-plus',
  'NordVPN Standard': 'nordvpn', 'ExpressVPN': 'expressvpn',
};

const autoSlug = n => n.toLowerCase().normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').replace(/\+/g, '-plus')
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const getSlug = n => slugOverrides[n] || autoSlug(n);

const missing = products.filter(x => !logos.includes(getSlug(x.name)));
const covered = products.filter(x => logos.includes(getSlug(x.name)));

console.log(`Covered: ${covered.length} / ${products.length}`);
console.log(`Missing: ${missing.length}`);
missing.forEach(x => console.log(`  ${x.name} => ${getSlug(x.name)}`));
