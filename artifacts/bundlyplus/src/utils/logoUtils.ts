import { availableLogoSlugs, missingLogoProducts, rasterLogoSlugs } from './logoManifest';

/**
 * Slug overrides — ONLY add an entry when:
 *   (a) the product name belongs to the SAME brand as the target logo, AND
 *   (b) the auto-derived slug from the product name doesn't match the file.
 *
 * Never use this table to "borrow" a different brand's logo. If a product
 * has no logo of its own, leave it out — `getLogoUrl` returns an empty
 * string and the component shows an initials tile, which is correct.
 *
 * Prior versions of this file mapped (e.g.) Claude→ChatGPT and
 * Deezer→Spotify, which produced visibly wrong logos on the shop. That
 * pattern is forbidden.
 */
const slugOverrides: Record<string, string> = {
  // ── Adobe family (all share the rainbow CC mark) ─────────────
  'Adobe Creative Cloud': 'adobe-cc',
  'Adobe Photoshop': 'adobe-cc',
  'Adobe Premiere Pro': 'adobe-cc',
  'Adobe Photography Plan': 'adobe-cc',

  // ── Amazon Prime Video shares the amazon-prime mark ──────────
  'Amazon Prime Video': 'amazon-prime',
  'Amazon Music Unlimited': 'amazon-music',

  // ── Anthropic Claude (new dedicated mark) ────────────────────
  'Claude pro': 'claude',
  'Claude Max': 'claude',

  // ── Apple (only where the target is genuinely the same brand) ─
  'Apple TV+': 'apple-tv',
  'Apple Music': 'apple-music',
  'Apple Music Family': 'apple-music',
  'Apple Arcade': 'apple-arcade',
  'iCloud+ 200GB': 'icloud',
  'iCloud+ 2TB': 'icloud',
  'iTunes / App Store $25': 'itunes',

  // ── Google (same-brand only) ─────────────────────────────────
  'Google Workspace Business Starter': 'google-workspace',
  'Google Gemini Advanced': 'google-gemini',
  'Google One 2TB': 'google-one',
  'Google Play Pass': 'google-play',

  // ── Microsoft (same-brand only) ──────────────────────────────
  'Microsoft 365 Personal': 'microsoft-365',
  'Microsoft 365 Family': 'microsoft-365',
  'Microsoft Copilot Pro': 'microsoft-copilot',
  'Microsoft Teams Essentials': 'microsoft-teams',
  'OneDrive 100GB': 'onedrive',

  // ── AI & developer tools ─────────────────────────────────────
  'Perplexity AI': 'perplexity',
  'Perplexity Pro': 'perplexity',
  'ChatGPT Plus': 'chatgpt',
  'ChatGPT Team': 'chatgpt',
  'Cursor IDE Pro': 'cursor',
  'GitHub Copilot Pro': 'github-copilot',
  'GitHub Pro': 'github',
  'Jasper AI': 'jasper',
  'Runway AI': 'runway',
  'Copy.ai Pro': 'copyai',
  'Notion AI': 'notion',
  'Notion Plus': 'notion',

  // ── Design ────────────────────────────────────────────────────
  'Figma Professional': 'figma',
  'Canva Pro': 'canva',
  'Framer Pro': 'framer',

  // ── Streaming ────────────────────────────────────────────────
  'Netflix Premium': 'netflix',
  'Disney+': 'disney-plus',
  'Disney+ Hulu Bundle': 'disney-plus',
  'Hulu (No Ads)': 'hulu',
  'Max (HBO Max)': 'max-hbo',
  'Paramount+': 'paramount-plus',
  'Crunchyroll Mega Fan': 'crunchyroll',
  'Funimation Premium': 'funimation',
  'StarzPlay Arabia': 'starzplay',
  'TOD / beIN Sports': 'tod-bein',
  'Anghami Plus': 'anghami',
  'YouTube Premium': 'youtube',
  'YouTube Music Premium': 'youtube',

  // ── Music (same-brand only) ──────────────────────────────────
  'Spotify Premium': 'spotify',
  'Spotify Family': 'spotify',
  'Tidal HiFi': 'tidal',

  // ── VPN & Privacy ────────────────────────────────────────────
  'NordVPN Standard': 'nordvpn',

  // ── Gaming (same-brand only) ─────────────────────────────────
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
  'Free Fire 1,080 Diamonds': 'free-fire',
  'PUBG Mobile 660 UC': 'pubg-mobile',

  // ── Productivity ─────────────────────────────────────────────
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

  // ── 2026 additions (Tier 1–3 launch batch) ──────────────────
  // Gaming top-ups
  'Mobile Legends 275 Diamonds': 'mobile-legends',
  'EA FC 25 – 1050 FC Points': 'ea-fc',
  'Genshin Impact 980 Genesis Crystals': 'genshin-impact',
  'Call of Duty Mobile CP': 'call-of-duty-mobile',
  'Valorant 1000 VP': 'valorant',
  'Fortnite 1000 V-Bucks': 'fortnite',
  'Clash of Clans 500 Gems': 'clash-of-clans',
  'Clash Royale 500 Gems': 'clash-royale',
  'Apex Legends 1000 Coins': 'apex-legends',
  'Minecraft 1720 Minecoins': 'minecraft',
  // AI & developer tools
  'Gamma AI': 'gamma-ai',
  'Lovable': 'lovable',
  'Leonardo AI': 'leonardo-ai',
  'Kling AI': 'kling-ai',
  'v0 by Vercel': 'v0-dev',
  'Replit Core': 'replit',
  'Fireflies.ai Pro': 'fireflies-ai',
  'Manus AI': 'manus-ai',
  // Design & creative
  'Envato Elements': 'envato-elements',
  'Freepik Premium': 'freepik',
  'Spline Super': 'spline',
  'Adobe Express Premium': 'adobe-express',
  'Storyblocks': 'storyblocks',
  // Streaming
  'ESPN+': 'espn-plus',
  'Discovery+': 'discovery-plus',
  'Sling TV Orange': 'sling-tv',
  // Productivity
  'Discord Nitro': 'discord',
  'Raycast Pro': 'raycast',
  'Superhuman': 'superhuman',
  'Arc Browser Premium': 'arc-browser',
  'Obsidian Sync': 'obsidian',
  // Education
  'Codecademy Pro': 'codecademy',
  'DataCamp Premium': 'datacamp',
  'Pluralsight Standard': 'pluralsight',
  // Music
  'Amazon Music HD': 'amazon-music',
  'Qobuz Studio': 'qobuz',
  // VPN & Privacy
  'TunnelBear VPN': 'tunnelbear',
  'ProtonMail Plus': 'protonmail',
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
