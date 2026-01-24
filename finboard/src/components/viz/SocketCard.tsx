'use client';
import { useEffect, useState, useRef } from 'react';
import { Activity, WifiOff } from 'lucide-react';

interface Props {
  coin: string;
}

export default function SocketCard({ coin }: Props) {
  const [price, setPrice] = useState<string>('Connecting...');
  const [color, setColor] = useState<string>('text-gray-900 dark:text-gray-100');
  const [error, setError] = useState<boolean>(false);
  
  const ws = useRef<WebSocket | null>(null);

  // Mapping common names to Binance tickers
  const getTicker = (name: string) => {
    const map: Record<string, string> = {
      'bitcoin': 'btcusdt',
      'ethereum': 'ethusdt',
      'dogecoin': 'dogeusdt',
      'solana': 'solusdt',
      'ripple': 'xrpusdt',
      'cardano': 'adausdt'
    };
    return map[name.toLowerCase()] || `${name.toLowerCase()}usdt`;
  };

  const ticker = getTicker(coin);

  useEffect(() => {
    // Connect to Binance Public Stream (No API Key needed)
    ws.current = new WebSocket(`wss://stream.binance.com:9443/ws/${ticker}@trade`);

    ws.current.onopen = () => {
      setError(false);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Binance Format: { p: "0.1234" }
        if (data.p) {
          const val = parseFloat(data.p);
          
          setPrice((prevStr) => {
             const prev = parseFloat(prevStr.replace(/[^0-9.]/g, '')) || 0;
             setColor(val > prev ? 'text-green-500' : 'text-red-500');
             return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
          });

          setTimeout(() => setColor('text-gray-900 dark:text-gray-100'), 300);
        }
      } catch (err) {
        console.error(err);
      }
    };

    ws.current.onerror = () => {
      setError(true);
      setPrice('Connection Failed');
    };

    return () => {
      ws.current?.close();
    };
  }, [ticker]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 relative group">
      <div className="flex items-center gap-2 mb-2">
        {error ? (
           <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
        ) : (
           <span className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
           </span>
        )}
        <h3 className="text-sm font-semibold uppercase text-gray-500">{ticker.replace('usdt','')}</h3>
      </div>
      
      <div className={`text-3xl font-bold transition-colors duration-300 ${color} break-all text-center`}>
        {price}
      </div>
      
      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1 opacity-50">
        {error ? <WifiOff size={12}/> : <Activity size={12} />} 
        {error ? 'Socket Error' : 'Binance Live'}
      </p>
    </div>
  );
}