import { TMDB_IMAGE_BASE } from '../config/constants';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const STORAGE_KEY = 'tmdb_image_cache';
const REQUEST_TIMEOUT_MS = 5000;

// Hydrate from localStorage on module load
const cache = new Map<string, string | null>(loadFromStorage());
const pending = new Map<string, Promise<string | null>>();

function loadFromStorage(): [string, string | null][] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return Object.entries(JSON.parse(raw));
  } catch {
    return [];
  }
}

function saveToStorage() {
  try {
    const obj: Record<string, string | null> = {};
    cache.forEach((v, k) => { obj[k] = v; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // Storage full or unavailable — not critical
  }
}

export async function fetchTmdbImage(
  name: string,
  type: 'person' | 'film'
): Promise<string | null> {
  if (!API_KEY) return null;

  const cacheKey = `${type}:${name}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;
  if (pending.has(cacheKey)) return pending.get(cacheKey)!;

  const promise = (async () => {
    try {
      const endpoint = type === 'person' ? 'search/person' : 'search/movie';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const res = await fetch(
        `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(name)}&page=1`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!res.ok) { cache.set(cacheKey, null); saveToStorage(); return null; }

      const data = await res.json();
      const result = data.results?.[0];
      if (!result) { cache.set(cacheKey, null); saveToStorage(); return null; }

      const path = type === 'person' ? result.profile_path : result.poster_path;
      const url = path ? `${TMDB_IMAGE_BASE}${path}` : null;
      cache.set(cacheKey, url);
      saveToStorage();
      return url;
    } catch {
      // Timeout, network error, etc. — don't cache failures from transient errors
      return null;
    } finally {
      pending.delete(cacheKey);
    }
  })();

  pending.set(cacheKey, promise);
  return promise;
}

/**
 * Prefetch all nominee images so they're cached before the ceremony.
 * Call this once on app load. Runs in the background, non-blocking.
 */
export function prefetchAllImages(
  categories: { type: 'person' | 'film'; nominees: { name: string; film?: string }[] }[]
) {
  if (!API_KEY) return;

  // Collect unique search queries
  const queries = new Set<string>();
  const jobs: { name: string; type: 'person' | 'film' }[] = [];

  for (const cat of categories) {
    for (const nom of cat.nominees) {
      const searchName = cat.type === 'person' ? nom.name : (nom.film || nom.name);
      const key = `${cat.type}:${searchName}`;
      if (!queries.has(key) && !cache.has(key)) {
        queries.add(key);
        jobs.push({ name: searchName, type: cat.type });
      }
    }
  }

  // Fetch in small batches to avoid overwhelming the browser
  const BATCH_SIZE = 8;
  let i = 0;

  function nextBatch() {
    const batch = jobs.slice(i, i + BATCH_SIZE);
    if (batch.length === 0) return;
    i += BATCH_SIZE;
    Promise.all(batch.map((j) => fetchTmdbImage(j.name, j.type))).then(nextBatch);
  }

  nextBatch();
}
