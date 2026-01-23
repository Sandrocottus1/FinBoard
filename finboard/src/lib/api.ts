const cache = new Map<string, { data: any; ts: number }>();

// 1. Define "Cooldown" rules (in milliseconds)
const RATE_LIMITS: Record<string, number> = {
  'binance.com': 500,    // Wait 500ms between Binance calls
  'coingecko.com': 5000, // CoinGecko Free Tier is strict (wait 5s)
  'coincap.io': 1000,    // Wait 1s
};

// Track the timestamp of the last request per domain
const lastReqTime: Record<string, number> = {};

// Helper: Sleep function
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getApi = async (url: string) => {
  const now = Date.now();

  // 2. Check Cache First (Don't fetch if we have fresh data)
  if (cache.has(url)) {
    const c = cache.get(url)!;
    // Return cached data if it's less than 30 seconds old
    if (now - c.ts < 30 * 1000) {
      return c.data;
    }
  }

  // 3. Rate Limiting Logic
  try {
    // Identify the domain (e.g., "api.binance.com")
    const domain = Object.keys(RATE_LIMITS).find((d) => url.includes(d));
    
    if (domain) {
      const cooldown = RATE_LIMITS[domain];
      const last = lastReqTime[domain] || 0;
      const timeSinceLast = now - last;

      // If we are too fast, wait the remaining time
      if (timeSinceLast < cooldown) {
        const waitTime = cooldown - timeSinceLast;
        console.log(`[Throttling] Waiting ${waitTime}ms for ${domain}...`);
        
        // Update the "last request" time *now* to reserve the slot for this request
        lastReqTime[domain] = now + waitTime; 
        
        await delay(waitTime);
      } else {
        lastReqTime[domain] = now;
      }
    }

    // 4. Actual Fetch (via your Proxy)
    const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    
    const data = await res.json();

    // 5. Save to Cache
    cache.set(url, { data, ts: Date.now() });
    
    return data;
  } catch (err) {
    console.error(`Fetch Error (${url}):`, err);
    // If fetch fails, return cached data if available (even if old) to prevent white screen
    return cache.get(url)?.data || null;
  }
};

// Helper function to dig into JSON (e.g. "bitcoin.usd")
export const getVal = (obj: any, path: string) => {
  if (!path) return '';
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};