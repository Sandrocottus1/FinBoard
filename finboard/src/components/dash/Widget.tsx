'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import { useStore } from '@/lib/store';
import { WCfg } from '@/lib/types';
import Card from '@/components/viz/Card';
import Table from '@/components/viz/Table';
import Chart from '@/components/viz/Chart';
import { useEffect, useState } from 'react';
import { getApi } from '@/lib/api';
import SocketCard from '../viz/SocketCard';


interface Props {
  cfg: WCfg;
}

const DEFAULT_REFRESH_RATE = 30

export default function Widget({ cfg }: Props) {
  const remove = useStore((s) => s.remove);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Drag and Drop hooks
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: cfg.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [error, setError] = useState(false);

  useEffect(() => {
    if (cfg.type === 'socket') return;
    
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await getApi(cfg.url);
        if (!res) {
          console.warn("API returned no data, retrying...");
          return;
        }

        let finalData = res;

        // 1. Finnhub Charts
        if (res.c && res.t && Array.isArray(res.c)) {
             finalData = res.t.map((t: number, i: number) => ({
                 x: new Date(t * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                 y: res.c[i] 
             }));
        }
        if(typeof res.c === 'number'  && !Array.isArray(res.c)){
          finalData = {
            value: res.c, //curr price
            change: res.dp //percent change
          };
        }
        // 2. Alpha Vantage Stock Card (NEW)
        if (res["Global Quote"]) {
          const q = res["Global Quote"];
          finalData = {
            value: parseFloat(q["05. price"]),
            change: parseFloat(q["10. change percent"].replace('%', ''))
          };
        }

        // 3. Alpha Vantage Crypto Chart
        const avCrypto = res['Time Series (Digital Currency Daily)'];
        if (avCrypto) {
            finalData = Object.keys(avCrypto).slice(0, 30).map(d => ({
                x: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                y: parseFloat(avCrypto[d]['4a. close (USD)'])
            })).reverse();
        }

        if (mounted) {
          setData(finalData); 
        }

      } catch (err) {
        console.error(err);
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    // Default to 60s if freq is missing
    const interval = setInterval(fetchData, (cfg.freq || 60) * 1000); 

    return () => { 
      mounted = false;
      clearInterval(interval);
    };
  }, [cfg.url, cfg.freq, cfg.type]);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="
        relative rounded-xl flex flex-col h-64 overflow-hidden group
        bg-white dark:bg-gray-900 
        border border-gray-200 dark:border-gray-800
        shadow-sm dark:shadow-none
        transition-colors duration-300
      "
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing text-gray-400 touch-none" {...attributes} {...listeners}>
          <GripVertical size={16} />
          <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
            {cfg.name}
          </h3>
        </div>
        <button onClick={() => remove(cfg.id)} className="text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden relative">
        {cfg.type === 'socket' ? (
           <SocketCard coin={cfg.url} /> 
        ) : loading ? (
          <div className="animate-pulse flex flex-col justify-center h-full space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
            <span className="text-xs">Connection Failed</span>
            <button 
              onClick={() => window.location.reload()} // Simple reload or call fetchData if accessible
              className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {!data && <div className="text-center text-gray-500 text-xs mt-10">No Data</div>}
            {data && cfg.type === 'card' && <Card data={data} map={cfg.map} />}
            {data && cfg.type === 'table' && <Table data={data} map={cfg.map} />}
            {data && cfg.type === 'chart' && <Chart data={data} map={cfg.map} />}
          </>
        )}
      </div>
    </div>
  );
}