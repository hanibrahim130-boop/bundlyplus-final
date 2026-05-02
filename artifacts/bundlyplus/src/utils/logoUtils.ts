import { availableLogoSlugs, missingLogoProducts, rasterLogoSlugs } from './logoManifest';

// Only add an entry here when the auto-derived slug from the product name
// does NOT match the SVG file name in `public/logos/`. For new products,
// prefer naming the SVG to match the auto-slug so no override is needed.
const slugOverrides: Record<string, string> = {
  // Adobe
  'Adobe Creative Cloud': 'adobe-cc',
  'Adobe Photoshop': 'adobe-cc',
  'Adobe Premiere Pro': 'adobe-cc',
  'Adobe Photography Plan': 'adobe-cc',
  // Amazon
  'Amazon Prime Video': 'amazon-prime',
  'Amazon Music Unlimited': 'amazon-prime',
  // Apple
  'Apple TV+': 'apple-tv',
  'Apple Music': 'apple-music',
  'Apple Music Family': 'apple-music',
  'Apple Arcade': 'apple-tv',
  'iTunes / App Store $25': 'apple-music',
  'iCloud+ 200GB': 'apple-tv',
  'iCloud+ 2TB': 'apple-tv',
  // Google
  'Google Workspace Business Starter': 'google-workspace',
  'Google Gemini Advanced': 'google-gemini',
  'Google One 2TB': 'google-workspace',
  'Google Play Pass': 'google-workspace',
  // Microsoft
  'Microsoft 365 Personal': 'microsoft-365',
  'Microsoft 365 Family': 'microsoft-365',
  'Microsoft Copilot Pro': 'microsoft-copilot',
  'Microsoft Teams Essentials': 'microsoft-365',
  'OneDrive 100GB': 'microsoft-365',
  // AI & Dev tools
  'Perplexity AI': 'perplexity',
  'Perplexity Pro': 'perplexity',
  'ChatGPT Plus': 'chatgpt',
  'ChatGPT Team': 'chatgpt',
  'Claude pro': 'chatgpt',
  'Claude Max': 'chatgpt',
  'Cursor IDE Pro': 'cursor',
  'GitHub Copilot Pro': 'github-copilot',
  'GitHub Pro': 'github-copilot',
  'Jasper AI': 'jasper',
  'Runway AI': 'runway',
  'Copy.ai Pro': 'copyai',
  'Notion AI': 'notion',
  'Notion Plus': 'notion',
  // Design
  'Figma Professional': 'figma',
  'Canva Pro': 'canva',
  'Framer Pro': 'framer',
  // Streaming
  'Netflix Premium': 'netflix',
  'Disney+': 'disney-plus',
  'Disney+ Hulu Bundle': 'disney-plus',
  'Hulu (No Ads)': 'hulu',
  'Max (HBO Max)': 'max-hbo',
  'Paramount+': 'paramount-plus',
  'Funimation Premium': 'crunchyroll',
  'Crunchyroll Mega Fan': 'crunchyroll',
  'StarzPlay Arabia': 'starzplay',
  'TOD / beIN Sports': 'tod-bein',
  'Anghami Plus': 'anghami',
  'YouTube Premium': 'youtube',
  'YouTube Music Premium': 'youtube',
  // Music
  'Spotify Premium': 'spotify',
  'Spotify Family': 'spotify',
  'Tidal HiFi': 'tidal',
  'Deezer Premium': 'spotify',
  'SoundCloud Go+': 'spotify',
  // VPN & Privacy
  'NordVPN Standard': 'nordvpn',
  'ExpressVPN': 'expressvpn',
  // Gaming
  'EA Play Pro': 'ea-play',
  'Xbox Game Pass Ultimate': 'xbox',
  'Xbox Gift Card $25': 'xbox',
  'PC Game Pass': 'xbox',
  'PlayStation Plus Essential': 'playstation',
  'PlayStation Plus Extra': 'playstation',
  'PlayStation Plus Premium': 'playstation',
  'PlayStation Wallet $25': 'playstation',
  'Nintendo Switch Online': 'nintendo',
  'Nintendo Switch Online + Expansion': 'nintendo',
  'Roblox – 1,000 Robux': 'roblox',
  'Roblox – 2,200 Robux': 'roblox',
  'Steam Wallet $20': 'steam',
  'Steam Wallet $50': 'steam',
  'Free Fire 1,080 Diamonds': 'ea-play',
  'PUBG Mobile 660 UC': 'ea-play',
  // Productivity
  'Vercel Pro': 'vercel',
  'Slack Pro': 'slack',
  'Linear Business': 'linear',
  'Loom Business': 'loom',
  'Retool Team': 'retool',
  'Grammarly Premium': 'grammarly',
  'Duolingo Super': 'duolingo',
  'IPTV Premium – 4K': 'iptv-premium',
  'Writesonic': 'writesonic',
  'Descript': 'descript',
  'Midjourney': 'midjourney',
  'Synthesia': 'synthesia',
};

const autoSlug = (name: string): string =>
  name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\+/g, '-plus')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getLogoSlug = (name: string): string => slugOverrides[name] ?? autoSlug(name);

export const hasLogo = (name: string): boolean => availableLogoSlugs.has(getLogoSlug(name));

export const getLogoUrl = (name: string): string => {
  const slug = getLogoSlug(name);
  if (!availableLogoSlugs.has(slug)) return '';
  const ext = rasterLogoSlugs.has(slug) ? 'png' : 'svg';
  return `/logos/${slug}.${ext}`;
};

if (import.meta.env.DEV && missingLogoProducts.length > 0) {
  // eslint-disable-next-line no-console
  console.warn(
    `[bundlyplus] ${missingLogoProducts.length} product(s) are missing logos. ` +
      `Drop matching SVGs into public/logos/ or add an override in src/utils/logoUtils.ts:`,
    missingLogoProducts,
  );
}

export const getEmoji = (name: string): string => {
  const mapping: { [key: string]: string } = {
    'Perplexity AI': '🔍',
    'Figma Professional': '🎨',
    'Watchit': '📺',
    'Vercel Pro': '🚀',
    'Microsoft 365 Personal': '📄',
    'Notion AI': '📝',
    'OSN+': '📺',
    'Adobe Creative Cloud': '🎨',
    'Loom Pro': '📹',
    'ChatGPT Plus': '🤖',
    'YouTube Premium': '📺',
    'Apple TV+': '📺',
    'Canva Pro': '🎨',
    'Retool Studio': '🛠️',
    'Google Workspace Business Starter': '📧',
    'Disney+': '📺',
    'GitHub Copilot Pro': '🤖',
    'Framer Pro': '🎨',
    'Roblox – 1000 Robux': '🎮',
    'ExpressVPN': '🔒',
    'Funimation Premium': '📺',
    'Netflix Premium – Private Account': '📺',
    'Amazon Prime Video': '📺',
    'Spotify Premium': '🎵',
    'Microsoft Copilot Pro': '🤖',
    'Duolingo Plus': '🦉',
    'Writesonic': '✍️',
    'Crunchyroll Mega Fan': '📺',
    'PlayStation Plus Essential': '🎮',
    'Copy.ai': '✍️',
    'Grammarly Premium': '✍️',
    'Descript': '📹',
    'Max (HBO Max)': '📺',
    'Slack Professional': '💬',
    'Midjourney': '🎨',
    'Hulu': '📺',
    'Synthesia': '🤖',
    'Paramount+': '📺',
    'Cursor IDE Pro': '🤖',
    'Linear Pro': '🛠️',
    'Runway AI': '📹',
    'StarzPlay Arabia': '📺',
    'Shahid VIP': '📺',
    'Google Gemini Advanced': '🤖',
    'Weyyak': '📺',
    'Nintendo Switch Online': '🎮',
    'Jasper AI': '✍️',
    'DAZN': '📺',
    'Tidal HiFi': '🎵',
    'TOD by beIN': '⚽',
    'Anghami Plus': '🎵',
    'Steam Gift Card $20': '🎮',
    'Apple Music': '🎵',
    'Jawwy TV': '📺',
    'NordVPN': '🔒',
    'IPTV Premium – 4K': '📺',
    'EA Play Pro': '🎮',
    'Xbox Game Pass Ultimate': '🎮',
  };
  return mapping[name] || '📦';
};
