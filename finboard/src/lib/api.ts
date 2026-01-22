import axios from 'axios';

const cache = new Map<string, { d: any; t: number }>();

export const getApi = async (url: string) => {
  const now = Date.now();
  if (cache.has(url)) {
    const c = cache.get(url)!;
    if (now - c.t < 5000) return c.d; // 5s cache
  }

  try {
    const res = await axios.get(url);
    cache.set(url, { d: res.data, t: now });
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// Helper to find nested value (e.g. "data.price")
export const getVal = (obj: any, path: string) => {
  if (!path) return null;
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
};