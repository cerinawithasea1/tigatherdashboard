/**
 * useApi — generic hook for fetching from the Sanctuary Dashboard API.
 * Uses same-origin (the server serves both frontend and API).
 */

import { useState, useEffect, useCallback } from 'react';

export function useApi<T>(endpoint: string, fallback: T, intervalMs = 30000) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (err) {
      console.warn(`[Dashboard] API fetch failed for ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, intervalMs);
    return () => clearInterval(id);
  }, [fetch_, intervalMs]);

  return { data, loading, lastUpdated, refetch: fetch_ };
}
