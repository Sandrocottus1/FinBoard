import axios from 'axios';

const cache = new Map<string, { d: any; t: number }>();

export const getApi = async (url: string) => {
  const now = Date.now();
  
  // 1. CHECK CACHE
  if (cache.has(url)) {
    const c = cache.get(url)!;
    // CRITICAL: Cache for 60 seconds (60000ms) to respect Alpha Vantage limits
    if (now - c.t < 80000) { 
      return c.d; 
    }
  }

  try {
    // 2. CALL PROXY
    // We append the API key in the URL itself in the frontend for simplicity
    const res = await axios.get(`/api/proxy?url=${encodeURIComponent(url)}`);
    
    // 3. HANDLE API LIMIT ERRORS
    // Alpha Vantage sends a 200 OK even on error, but with a specific message
    if (res.data.Note || res.data.Information) {
      // Return old cache if available, otherwise null
      return cache.has(url) ? cache.get(url)!.d : null;
    }

    cache.set(url, { d: res.data, t: now });
    return res.data;
  } catch (e) {
    return null;
  }
};

// IMPROVED HELPER: Handles keys with spaces or dots (common in Alpha Vantage)
// Helper to extract nested keys, specifically fixing Alpha Vantage's "05. price" issue
export const getVal = (obj: any, path: string) => {
  if (!path) return null;
  
  // 1. Try standard dot notation first (Works for CoinGecko, etc.)
  let res = path.split('.').reduce((o, k) => (o || {})[k], obj);
  if (res !== undefined) return res;

  // 2. Fallback for Alpha Vantage (Keys like "Global Quote.05. price")
  // We try to access "Global Quote" first, then look for the weird key
  if (path.includes('Global Quote')) {
    const root = obj['Global Quote'];
    if (root) {
      // Extract the part after "Global Quote."
      const key = path.replace('Global Quote.', '');
      return root[key];
    }
  }

  return null;
};