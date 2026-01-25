'use client';

import { useEffect, useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  DragEndEvent,
  useSensor,    
  useSensors,   
  MouseSensor,  
  TouchSensor   
} from '@dnd-kit/core';

import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '@/lib/store';
import Widget from './Widget';
import { LayoutDashboard, Loader2 } from 'lucide-react'; 

export default function Board() {
  const { ws, reorder, add } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, 
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = ws.findIndex((w) => w.id === active.id);
      const newIndex = ws.findIndex((w) => w.id === over.id);
      reorder(arrayMove(ws, oldIndex, newIndex));
    }
  };

  const loadTemplate = () => {
    const t = Date.now();
    add({ id: `${t}-1`, name: 'Live Bitcoin', type: 'socket', url: 'bitcoin', freq: 0, map: {} });
    add({ 
        id: `${t}-2`, 
        name: 'Market Leaderboard', 
        type: 'table', 
        url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano&order=market_cap_desc', 
        freq: 120, 
        map: { cols: ['name', 'current_price', 'price_change_percentage_24h'] } 
    });
    add({ 
        id: `${t}-3`, 
        name: 'BTC Trend (30 Days)', 
        type: 'chart', 
        url: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily', 
        freq: 300, 
        map: { x: '0', y: '1' } 
    });
  };

  if (!mounted) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-gray-500"/></div>;

  return (
    <div className="w-full bg-white dark:bg-black transition-colors duration-300 min-h-[50vh]">
      <DndContext 
        sensors={sensors}  
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ws} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ws.map((w) => (
              <Widget key={w.id} cfg={w} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {ws.length === 0 && (
        <div className="max-w-md mx-auto mt-20 p-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-full mb-4">
             <LayoutDashboard size={48} className="text-gray-400 dark:text-gray-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">No widgets yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
            Start tracking your assets by adding a widget or loading our default crypto layout.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button 
              onClick={loadTemplate}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
            >
              Load Crypto Template
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest font-bold">Or click "Add Widget" below</p>
        </div>
      )}
    </div>
  );
}