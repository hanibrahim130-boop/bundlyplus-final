/**
 * Product knowledge base for auto-filling admin form when creating new products.
 * Maps product name (or fuzzy match) → suggested fields + logo domain.
 */

export interface ProductSuggestion {
  description: string;
  category: string;
  account_type: 'Private' | 'Shared';
  duration: string;
  features: string[];
  price: number;
  domain: string; // for Clearbit logo fetch
}

const KNOWLEDGE_BASE: Record<string, ProductSuggestion> = {
  netflix: {
    description: 'Stream unlimited movies, shows & Netflix Originals in stunning 4K Ultra HD.',
    category: 'Streaming', account_type: 'Private', duration: '1 Month', price: 4.99,
    features: ['4K Ultra HD streaming', '4 simultaneous screens', 'Offline downloads'],
    domain: 'netflix.com',
  },
  spotify: {
    description: 'Ad-free music streaming with offline playback and premium audio quality.',
    category: 'Music & Others', account_type: 'Shared', duration: '1 Month', price: 1.99,
    features: ['Ad-free music', 'Offline downloads', 'Unlimited skips'],
    domain: 'spotify.com',
  },
  chatgpt: {
    description: 'OpenAI ChatGPT Plus — GPT-4 access, faster responses, and advanced features.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 4.99,
    features: ['GPT-4 access', 'Priority access', 'Advanced data analysis'],
    domain: 'openai.com',
  },
  youtube: {
    description: 'Ad-free YouTube + YouTube Music with background play and offline downloads.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 1.49,
    features: ['Ad-free videos', 'Background play', 'YouTube Music included'],
    domain: 'youtube.com',
  },
  adobe: {
    description: 'Full Adobe Creative Cloud suite: Photoshop, Illustrator, Premiere, and 20+ apps.',
    category: 'Software & AI', account_type: 'Private', duration: '1 Month', price: 3.99,
    features: ['20+ creative apps', '100GB cloud storage', 'Adobe Fonts'],
    domain: 'adobe.com',
  },
  disney: {
    description: 'Disney+, Marvel, Star Wars, Pixar and National Geographic in 4K HDR.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 2.49,
    features: ['4K HDR streaming', '4 simultaneous screens', 'Offline downloads'],
    domain: 'disneyplus.com',
  },
  canva: {
    description: 'Canva Pro — premium templates, brand kit, background remover, and more.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 1.99,
    features: ['100M+ premium assets', 'Background remover', 'Brand kit & magic resize'],
    domain: 'canva.com',
  },
  midjourney: {
    description: 'AI art generator — create stunning images from text prompts at pro tier.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 5.99,
    features: ['Standard plan limits', 'Fast GPU time', 'Commercial use'],
    domain: 'midjourney.com',
  },
  notion: {
    description: 'Notion AI — supercharge your workspace with AI-powered writing & search.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 3.49,
    features: ['Unlimited AI usage', 'AI Q&A on workspace', 'Auto-fill databases'],
    domain: 'notion.so',
  },
  github: {
    description: 'GitHub Copilot Pro — AI pair programmer powered by GPT-4 in your editor.',
    category: 'Software & AI', account_type: 'Private', duration: '1 Month', price: 4.99,
    features: ['Code completions', 'Chat in IDE', 'GPT-4 powered'],
    domain: 'github.com',
  },
  grammarly: {
    description: 'Grammarly Premium — advanced grammar, tone, clarity & plagiarism checks.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 2.49,
    features: ['Advanced grammar checks', 'Tone detection', 'Plagiarism detector'],
    domain: 'grammarly.com',
  },
  perplexity: {
    description: 'AI-powered search with real-time answers, sources & multimodal capabilities.',
    category: 'Software & AI', account_type: 'Private', duration: '1 Month', price: 7.99,
    features: ['Real-time web search', 'Source citations', 'Multimodal search'],
    domain: 'perplexity.ai',
  },
  figma: {
    description: 'Figma Professional — design, prototype & collaborate on UI/UX projects.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 4.99,
    features: ['Unlimited shared projects', 'Version history', 'Advanced sharing'],
    domain: 'figma.com',
  },
  shahid: {
    description: 'MBC Group\'s premium streaming: Arabic series, movies, live TV & sports.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 3.49,
    features: ['Arabic series & movies', 'Live MBC channels', 'Offline downloads'],
    domain: 'shahid.mbc.net',
  },
  osn: {
    description: 'OSN+ premium MENA streaming: HBO, exclusive shows & Arabic originals.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 3.99,
    features: ['HBO content', 'OSN Originals', 'Arabic & English'],
    domain: 'osnplus.com',
  },
  anghami: {
    description: 'MENA\'s top music streaming — Arabic & global music, ad-free with offline.',
    category: 'Music & Others', account_type: 'Shared', duration: '1 Month', price: 1.99,
    features: ['Ad-free music', 'Offline downloads', '50M+ tracks'],
    domain: 'anghami.com',
  },
  starzplay: {
    description: 'Starz Arabia: Hollywood blockbusters, Arabic originals & live events.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 2.99,
    features: ['Hollywood movies', 'Starz Originals', 'Arabic content'],
    domain: 'starzplay.com',
  },
  watchit: {
    description: 'Egyptian streaming with Arabic movies, series & premium content.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 1.99,
    features: ['Arabic movies', 'Egyptian originals', 'HD streaming'],
    domain: 'watchit.com',
  },
  weyyak: {
    description: 'Free & premium Arabic streaming from Zee Alwan — drama, comedy, lifestyle.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 1.49,
    features: ['Arabic drama', 'Turkish dubbed series', 'Offline viewing'],
    domain: 'weyyak.com',
  },
  tod: {
    description: 'TOD by beIN — live football, Champions League, Premier League & more.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 4.99,
    features: ['Live football', 'Champions League', 'Premier League'],
    domain: 'tod.tv',
  },
  apple_music: {
    description: 'Apple Music — 100M+ songs, lossless audio, and spatial audio with Dolby.',
    category: 'Music & Others', account_type: 'Shared', duration: '1 Month', price: 2.49,
    features: ['Lossless audio', 'Spatial with Dolby', 'All music library'],
    domain: 'apple.com',
  },
  apple_tv: {
    description: 'Apple TV+ — Apple Originals, award-winning shows & films in 4K HDR.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 1.99,
    features: ['Apple Originals', '4K HDR', 'Family sharing'],
    domain: 'apple.com',
  },
  amazon: {
    description: 'Amazon Prime Video — Originals, movies, series & live sports in 4K.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 2.99,
    features: ['4K HDR', 'Prime Originals', 'Offline downloads'],
    domain: 'primevideo.com',
  },
  tidal: {
    description: 'Tidal HiFi — lossless audio, master quality & exclusive content.',
    category: 'Music & Others', account_type: 'Shared', duration: '1 Month', price: 2.99,
    features: ['Lossless HiFi', 'Master quality', 'Exclusive content'],
    domain: 'tidal.com',
  },
  expressvpn: {
    description: 'ExpressVPN — fast, secure VPN with servers in 105 countries.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 3.99,
    features: ['105 countries', 'No-log policy', 'Lightning fast'],
    domain: 'expressvpn.com',
  },
  nordvpn: {
    description: 'NordVPN — military-grade encryption, 5500+ servers, threat protection.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 2.99,
    features: ['5500+ servers', 'Threat protection', 'Kill switch'],
    domain: 'nordvpn.com',
  },
  duolingo: {
    description: 'Duolingo Plus — ad-free language learning with offline access.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 1.99,
    features: ['Ad-free', 'Unlimited hearts', 'Offline lessons'],
    domain: 'duolingo.com',
  },
  hulu: {
    description: 'Hulu — current TV shows, originals, movies & live TV.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 2.49,
    features: ['Current TV shows', 'Hulu Originals', 'Movies'],
    domain: 'hulu.com',
  },
  max: {
    description: 'Max (HBO Max) — HBO originals, Warner Bros movies & DC universe.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 2.99,
    features: ['HBO originals', 'Warner Bros movies', '4K HDR'],
    domain: 'max.com',
  },
  paramount: {
    description: 'Paramount+ — Star Trek, MTV, Nickelodeon, CBS Sports & exclusive films.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 2.49,
    features: ['Paramount originals', 'Live sports', 'Kids content'],
    domain: 'paramountplus.com',
  },
  crunchyroll: {
    description: 'Crunchyroll — largest anime library, simulcasts & manga.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 2.49,
    features: ['Anime simulcasts', 'No ads', 'Manga library'],
    domain: 'crunchyroll.com',
  },
  playstation: {
    description: 'PlayStation Plus Essential — online play, free monthly games & cloud saves.',
    category: 'Gaming', account_type: 'Shared', duration: '1 Month', price: 4.99,
    features: ['Online multiplayer', 'Monthly free games', 'Cloud saves'],
    domain: 'playstation.com',
  },
  xbox: {
    description: 'Xbox Game Pass Ultimate — 100s of games, Xbox Live Gold, EA Play included.',
    category: 'Gaming', account_type: 'Shared', duration: '1 Month', price: 7.99,
    features: ['100s of games', 'Day-one releases', 'EA Play included'],
    domain: 'xbox.com',
  },
  nintendo: {
    description: 'Nintendo Switch Online — online play, classic games & cloud saves.',
    category: 'Gaming', account_type: 'Shared', duration: '1 Month', price: 1.49,
    features: ['Online play', 'NES & SNES classics', 'Cloud saves'],
    domain: 'nintendo.com',
  },
  microsoft_365: {
    description: 'Microsoft 365 Personal — Word, Excel, PowerPoint & 1TB OneDrive.',
    category: 'Software & AI', account_type: 'Private', duration: '1 Month', price: 6.99,
    features: ['Office apps', '1TB OneDrive', 'Premium support'],
    domain: 'microsoft.com',
  },
  google_workspace: {
    description: 'Google Workspace Business — custom email, Drive, Meet & Calendar.',
    category: 'Software & AI', account_type: 'Private', duration: '1 Month', price: 5.99,
    features: ['Custom email', '30GB storage', 'Video meetings'],
    domain: 'workspace.google.com',
  },
  google_gemini: {
    description: 'Google Gemini Advanced — Gemini Ultra 1.0 with 2TB storage included.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 4.99,
    features: ['Gemini Ultra access', '2TB Google One', 'Priority access'],
    domain: 'google.com',
  },
  cursor: {
    description: 'Cursor IDE Pro — AI-first code editor with GPT-4 & Claude integration.',
    category: 'Software & AI', account_type: 'Private', duration: '1 Month', price: 4.99,
    features: ['GPT-4 & Claude', 'Codebase chat', 'Fast autocomplete'],
    domain: 'cursor.com',
  },
  vercel: {
    description: 'Vercel Pro — deploy and scale Next.js & JavaScript apps globally.',
    category: 'Software & AI', account_type: 'Private', duration: '1 Month', price: 9.99,
    features: ['Global edge network', 'Pro analytics', 'Team collaboration'],
    domain: 'vercel.com',
  },
  linear: {
    description: 'Linear Pro — modern issue tracking built for high-performance teams.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 3.99,
    features: ['Unlimited members', 'Cycles & roadmaps', 'Advanced workflows'],
    domain: 'linear.app',
  },
  framer: {
    description: 'Framer Pro — design and publish stunning, no-code websites.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 3.99,
    features: ['No-code site builder', 'CMS', 'Custom domain'],
    domain: 'framer.com',
  },
  loom: {
    description: 'Loom Pro — async video messages with AI summaries & transcripts.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 2.49,
    features: ['Unlimited videos', 'AI summaries', 'HD recording'],
    domain: 'loom.com',
  },
  slack: {
    description: 'Slack Professional — team messaging with full message history & integrations.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 4.99,
    features: ['Unlimited message history', 'Apps & integrations', 'Group video calls'],
    domain: 'slack.com',
  },
  dazn: {
    description: 'DAZN — live sports streaming: boxing, MMA, football & more.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 5.99,
    features: ['Live sports', 'Boxing & MMA', 'Multi-device'],
    domain: 'dazn.com',
  },
  jasper: {
    description: 'Jasper AI — enterprise AI copywriting and content generation.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 4.99,
    features: ['AI copywriting', 'Brand voice', '50+ templates'],
    domain: 'jasper.ai',
  },
  copyai: {
    description: 'Copy.ai — AI marketing copy, blog posts & sales emails.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 2.99,
    features: ['Marketing copy', 'Blog post writer', '90+ tools'],
    domain: 'copy.ai',
  },
  writesonic: {
    description: 'Writesonic — AI writing assistant for SEO, ads & long-form content.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 2.99,
    features: ['SEO articles', 'Ad copy', 'Chatsonic AI chat'],
    domain: 'writesonic.com',
  },
  synthesia: {
    description: 'Synthesia — AI video generation with realistic avatars in 120+ languages.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 9.99,
    features: ['AI video avatars', '120+ languages', 'Custom branding'],
    domain: 'synthesia.io',
  },
  descript: {
    description: 'Descript — edit video & audio by editing text, with AI voice cloning.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 3.99,
    features: ['Text-based editing', 'AI voice cloning', 'Screen recording'],
    domain: 'descript.com',
  },
  runway: {
    description: 'Runway AI — generative AI video editor with Gen-3 model.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 4.99,
    features: ['AI video generation', 'Gen-3 model', 'Magic tools'],
    domain: 'runwayml.com',
  },
  microsoft_copilot: {
    description: 'Microsoft Copilot Pro — AI in Word, Excel, PowerPoint & GPT-4 priority.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 5.99,
    features: ['AI in Office apps', 'GPT-4 priority access', 'Image creation'],
    domain: 'microsoft.com',
  },
  retool: {
    description: 'Retool Studio — build internal tools fast with low-code components.',
    category: 'Software & AI', account_type: 'Private', duration: '1 Month', price: 5.99,
    features: ['Low-code builder', 'Database connectors', 'Custom workflows'],
    domain: 'retool.com',
  },
  jawwy: {
    description: 'Jawwy TV — premium MENA streaming with live channels and on-demand.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 3.99,
    features: ['Live channels', 'On-demand library', 'Arabic content'],
    domain: 'jawwy.tv',
  },
  iptv: {
    description: 'IPTV Premium 4K — thousands of live channels, sports, movies & series.',
    category: 'Streaming', account_type: 'Private', duration: '1 Month', price: 5.99,
    features: ['10,000+ channels', '4K quality', 'VOD library'],
    domain: '',
  },
  ea: {
    description: 'EA Play Pro — premium EA games, in-game rewards & early access.',
    category: 'Gaming', account_type: 'Shared', duration: '1 Month', price: 3.99,
    features: ['Premium EA games', 'Early access trials', 'In-game rewards'],
    domain: 'ea.com',
  },
  steam: {
    description: 'Steam Gift Card — credit for any game, DLC or in-game purchase on Steam.',
    category: 'Gaming', account_type: 'Private', duration: 'One-time', price: 19.99,
    features: ['$20 USD credit', 'Works globally', 'Instant delivery'],
    domain: 'steampowered.com',
  },
  roblox: {
    description: 'Roblox Robux — virtual currency for in-game items, avatars & passes.',
    category: 'Gaming', account_type: 'Private', duration: 'One-time', price: 9.99,
    features: ['1000 Robux', 'Avatar items', 'Game passes'],
    domain: 'roblox.com',
  },
};

const CATEGORY_DEFAULTS: Record<string, Omit<ProductSuggestion, 'domain'>> = {
  Streaming: {
    description: 'Premium streaming subscription with HD quality and offline downloads.',
    category: 'Streaming', account_type: 'Shared', duration: '1 Month', price: 2.99,
    features: ['HD quality', 'Offline downloads', 'Multi-device'],
  },
  Music: {
    description: 'Ad-free music streaming with offline playback and high-quality audio.',
    category: 'Music & Others', account_type: 'Shared', duration: '1 Month', price: 1.99,
    features: ['Ad-free', 'Offline playback', 'Hi-Fi audio'],
  },
  Gaming: {
    description: 'Gaming subscription with online play, free games & exclusive perks.',
    category: 'Gaming', account_type: 'Shared', duration: '1 Month', price: 4.99,
    features: ['Online multiplayer', 'Free games', 'Exclusive perks'],
  },
  Software: {
    description: 'Premium software subscription with full access to pro features.',
    category: 'Software & AI', account_type: 'Shared', duration: '1 Month', price: 4.99,
    features: ['Pro features', 'Priority support', 'Advanced tools'],
  },
};

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

export function suggestProductFields(name: string): ProductSuggestion {
  const norm = normalize(name);

  // Direct match
  if (KNOWLEDGE_BASE[norm]) return KNOWLEDGE_BASE[norm];

  // Fuzzy: check if any KB key is contained in name (or vice versa)
  for (const [key, val] of Object.entries(KNOWLEDGE_BASE)) {
    if (norm.includes(key) || key.includes(norm.split('_')[0])) {
      return val;
    }
  }

  // Category guess by keywords
  const lower = name.toLowerCase();
  if (/stream|tv|video|movie|series|watch/.test(lower)) {
    return { ...CATEGORY_DEFAULTS.Streaming, domain: '' };
  }
  if (/music|audio|song|radio/.test(lower)) {
    return { ...CATEGORY_DEFAULTS.Music, domain: '' };
  }
  if (/game|play|xbox|playstation|nintendo|gaming/.test(lower)) {
    return { ...CATEGORY_DEFAULTS.Gaming, domain: '' };
  }

  return { ...CATEGORY_DEFAULTS.Software, domain: '' };
}

/**
 * Build a logo URL guess from product name. Tries Clearbit first.
 */
export function guessLogoUrl(name: string): string {
  const suggestion = suggestProductFields(name);
  if (suggestion.domain) {
    return `https://logo.clearbit.com/${suggestion.domain}`;
  }
  // Fallback: try to derive a domain from first word
  const firstWord = name.toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9]/g, '');
  if (firstWord.length >= 3) {
    return `https://logo.clearbit.com/${firstWord}.com`;
  }
  return '';
}
