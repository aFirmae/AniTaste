import { useState, useEffect, useRef } from 'react';

const API_BASE = 'http://localhost:8000';
const cache = new Map();

export function useApi(endpoint, params = {}, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    );
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = `${API_BASE}${endpoint}${queryString ? '?' + queryString : ''}`;

    // Check cache
    if (cache.has(url)) {
      setData(cache.get(url));
      setLoading(false);
      return;
    }

    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (res.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment.');
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const media = json?.data?.Page?.media || [];
        cache.set(url, media);
        setData(media);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [endpoint, JSON.stringify(params), enabled]);

  return { data, loading, error };
}
