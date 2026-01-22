'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripHorizontal } from 'lucide-react';
import { WCfg } from '@/lib/types';
import { getApi } from '@/lib/api';
import { useStore } from '@/lib/store';
import Card from '../viz/Card';
import Chart from '../viz/Chart';
import Table from '../viz/Table';

interface Props {
  cfg: WCfg;
}

export default function Widget({ cfg }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const remove = useStore((state) => state.del);

  // Drag and Drop Hooks
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cfg.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  // Data Fetching Logic
  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getApi(cfg.url);
    if (res) setData(res);
    setLoading(false);
  }, [cfg.url]);

  useEffect(() => {
    fetchData();
    if (cfg.freq > 0) {
      const interval = setInterval(fetchData, cfg.freq * 1000);
      return () => clearInterval(interval);
    }
  }, [fetchData, cfg.freq]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-sm flex flex-col h-64 overflow-hidden relative"
    >
      {/* Header (Drag Handle) */}
      <div className="flex items-center justify-between p-2 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-move p-1 text-gray-400 hover:text-gray-600"
        >
          <GripHorizontal size={16} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 truncate px-2">
          {cfg.name}
        </span>
        <button 
          onClick={() => remove(cfg.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-hidden relative">
        {loading && !data && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 z-10">
            <span className="text-xs animate-pulse">Loading...</span>
          </div>
        )}
        
        {data ? (
          <>
            {cfg.type === 'card' && <Card data={data} map={cfg.map} />}
            {cfg.type === 'chart' && <Chart data={data} map={cfg.map} />}
            {cfg.type === 'table' && <Table data={data} map={cfg.map} />}
          </>
        ) : (
          !loading && <div className="text-xs text-gray-400 text-center mt-10">No Data</div>
        )}
      </div>
    </div>
  );
}