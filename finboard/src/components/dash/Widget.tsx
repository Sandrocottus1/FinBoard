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

  useEffect(() => {
    if(cfg.type==='socket')return ;
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      const res = await getApi(cfg.url);
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, (cfg.freq || DEFAULT_REFRESH_RATE) * 1000);
    return () => { mounted = false; clearInterval(interval); };
  }, [cfg.url, cfg.freq ,cfg.type]);

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
        <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing text-gray-400" {...attributes} {...listeners}>
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
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 animate-pulse">
            Loading...
          </div>
        ) : (
          /* ... existing conditions for card, table, chart ... */
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