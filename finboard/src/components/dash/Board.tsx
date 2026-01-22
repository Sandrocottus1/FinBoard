'use client';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '@/lib/store';
import Widget from './Widget';
import { WCfg } from '@/lib/types';

export default function Board() {
  const { ws, reorder, add } = useStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = ws.findIndex((w) => w.id === active.id);
      const newIndex = ws.findIndex((w) => w.id === over.id);
      reorder(arrayMove(ws, oldIndex, newIndex));
    }
  };
  const loadTemplate = () => {
    const timestamp = Date.now();
    
    // 1. Bitcoin Price Card
    add({
      id: `${timestamp}-1`,
      name: 'Bitcoin Price',
      type: 'card',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
      freq: 60,
      map: { val: 'bitcoin.usd', lbl: 'bitcoin.usd_24h_change' }
    });

    // 2. Crypto Leaderboard Table
    add({
      id: `${timestamp}-2`,
      name: 'Market Leaderboard',
      type: 'table',
      url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,ripple&order=market_cap_desc',
      freq: 120,
      map: { cols: ['name', 'current_price', 'price_change_percentage_24h'] }
    });

    // 3. Bitcoin Chart
    add({
      id: `${timestamp}-3`,
      name: 'BTC Trend (30 Days)',
      type: 'chart',
      url: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily',
      freq: 300,
      map: { x: '0', y: '1' }
    });
  };
  return (
    <div className="w-full bg-white dark:bg-black transition-colors duration-300">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ws} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ws.map((w) => (
              <Widget key={w.id} cfg={w} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {ws.length === 0 && (
        <div className="text-center mt-20 p-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <p className="text-gray-500 mb-4">No widgets yet.</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={loadTemplate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Load Crypto Template
            </button>
            <p className="self-center text-sm text-gray-400">or click "Add Widget"</p>
          </div>
        </div>
      )}
    </div>
  );
}