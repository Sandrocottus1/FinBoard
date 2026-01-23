'use client';
import { useEffect, useState, useRef } from 'react';
import { Activity } from 'lucide-react';

interface Props {
  coin: string; // e.g., "bitcoin"
}

export default function SocketCard({ coin }: Props) {
  const [price, setPrice] = useState<string>('Connecting...');
  const [prev, setPrev] = useState<number>(0);
  const [color, setColor] = useState<string>('text-gray-900 dark:text-gray-100');
  
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. Open Connection
    ws.current = new WebSocket(`wss://ws.coincap.io/prices?assets=${coin}`);

    // 2. Listen for Messages
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data[coin]) {
        const val = parseFloat(data[coin]);
        
        // Flash Green/Red based on price movement
        setColor(val > prev ? 'text-green-500' : 'text-red-500');
        setPrev(val);
        setPrice(`$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
        
        // Reset color after 300ms
        setTimeout(() => setColor('text-gray-900 dark:text-gray-100'), 300);
      }
    };

    return () => { ws.current?.close(); };
  }, [coin]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <h3 className="text-sm font-semibold uppercase text-gray-500">{coin} (Live)</h3>
      </div>
      
      <div className={`text-3xl font-bold transition-colors duration-300 ${color}`}>
        {price}
      </div>
      
      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
        <Activity size={12} /> WebSocket
      </p>
    </div>
  );
}