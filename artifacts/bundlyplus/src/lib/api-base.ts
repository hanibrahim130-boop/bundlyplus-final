const RAW_API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

const NORMALIZED_API_BASE = RAW_API_BASE.replace(/\/+$/, '');

const FALLBACK_BASE = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

export function getApiBase(): string {
  return NORMALIZED_API_BASE || FALLBACK_BASE;
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBase()}${normalizedPath}`;
}
