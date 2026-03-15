import { useEffect, useState } from 'react';
import { fetchTmdbImage } from '../utils/tmdb';

export function useTmdbImage(name: string, type: 'person' | 'film'): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTmdbImage(name, type).then((result) => {
      if (!cancelled) setUrl(result);
    });
    return () => { cancelled = true; };
  }, [name, type]);

  return url;
}
