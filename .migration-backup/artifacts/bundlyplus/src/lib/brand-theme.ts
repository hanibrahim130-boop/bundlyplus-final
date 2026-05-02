export const brandGradients: Record<string, string> = {
  'Netflix': 'from-red-500 to-red-700',
  'Spotify': 'from-green-400 to-green-600',
  'ChatGPT': 'from-emerald-400 to-teal-600',
  'YouTube': 'from-red-500 to-red-600',
  'Figma': 'from-purple-500 to-pink-500',
  'Adobe': 'from-red-600 to-red-800',
  'Canva': 'from-cyan-400 to-blue-500',
  'Notion': 'from-slate-700 to-slate-900',
  'Midjourney': 'from-indigo-500 to-purple-600',
  'Perplexity': 'from-teal-400 to-cyan-600',
  'Duolingo': 'from-green-400 to-lime-500',
  'Grammarly': 'from-green-500 to-emerald-600',
};

const fallbackGradients = [
  'from-pink-400 to-rose-500',
  'from-violet-400 to-purple-600',
  'from-blue-400 to-indigo-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-600',
  'from-fuchsia-400 to-pink-600',
];

export const indexedGradients = [
  'from-pink-500 to-purple-500',
  'from-orange-400 to-rose-500',
  'from-violet-500 to-indigo-500',
  'from-cyan-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
];

export function getBrandGradient(name: string): string {
  for (const [brand, gradient] of Object.entries(brandGradients)) {
    if (name.toLowerCase().includes(brand.toLowerCase())) return gradient;
  }
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return fallbackGradients[hash % fallbackGradients.length];
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}
