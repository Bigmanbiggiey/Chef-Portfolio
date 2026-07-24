import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

let cachedPromise = null;

function fetchSiteSettings() {
  if (!cachedPromise) {
    cachedPromise = supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => data);
  }
  return cachedPromise;
}

// Shared by any component that needs the site_settings row (Hero, About, ...)
// so the row is only fetched once per page load instead of once per consumer.
export function useSiteSettings() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
