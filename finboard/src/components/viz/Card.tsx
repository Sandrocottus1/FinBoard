'use client';
import { getVal } from '@/lib/api';
import { WMap } from '@/lib/types';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  data: any;
  map: WMap;
}

export default function Card({ data: d, map: m }: Props) {
  
  // 1. SMART DATA EXTRACTION
  // If 'map.val' is set, use it. Otherwise, check if data has a direct '.value' property.
  // This ensures it works for both generic APIs and our custom Stock/Crypto logic.
  let rawVal = m.val ? getVal(d, m.val) : d?.value;
  if (rawVal === undefined && d?.value !== undefined) {
    rawVal = d.value;
  }
  // If data is just a number (simple API), treat the whole thing as the value
  if (typeof d === 'number') rawVal = d;

  // 2. EXTRACT PERCENTAGE CHANGE
  // specific check for our "finalData" structure { value: ..., change: ... }
  const changeVal = d?.change; 
  const hasChange = typeof changeVal === 'number';

  // 3. GET LABEL
  const rawLabel = m.lbl ? getVal(d, m.lbl) : 'Price';
  const label = String(rawLabel ?? '');

  // 4. FORMATTING LOGIC (Currency vs Number)
  const formatVal = (v: any) => {
    if (typeof v === 'number') {
      // If it looks like a price (big number), format as currency
      // But if the label explicitly says "Percent", treat it as such
      if (label.toLowerCase().includes('percent')) {
         return `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
      }
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(v);
    }
    return v;
  };

  const formattedVal = formatVal(rawVal);

  // 5. DETERMINE COLORS (Based on the CHANGE, not the price)
  // If we have a change value, green/red depends on that.
  // If no change value, we default to blue.
  const isPositive = hasChange ? changeVal >= 0 : true;
  
  const statusColor = hasChange 
    ? (isPositive ? 'text-emerald-400' : 'text-rose-500') 
    : 'text-blue-500';

  const bgIconColor = hasChange 
    ? (isPositive ? 'text-emerald-500' : 'text-rose-500') 
    : 'text-gray-100 dark:text-gray-800';

  const Icon = hasChange ? (isPositive ? TrendingUp : TrendingDown) : Activity;

  return (
    <div className="relative h-full w-full flex flex-col justify-center overflow-hidden pl-4 group">
      
      {/* Decorative Background Icon */}
      <div className={`absolute -right-1 bottom-0 opacity-20 rotate-[-12deg] group-hover:scale-110 transition-transform duration-500 ${bgIconColor}`}>
        <Icon size={100} strokeWidth={1} />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col">
        
        {/* Label (Top) */}
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2">
          <span className={`w-1 h-4 rounded-full ${hasChange ? (isPositive ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-blue-500'}`}></span>
          {label}
        </h4>
        
        {/* BIG PRICE (Neutral White/Gray) */}
        <span className="text-4xl sm:text-5xl font-black tracking-tighter text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {formattedVal || '--'}
        </span>

        {/* SMALL CHANGE % (Colored) */}
        {hasChange && (
          <div className={`flex items-center gap-1 text-sm font-bold mt-1 ${statusColor}`}>
            {isPositive ? '+' : ''}{changeVal}%
            <Icon size={16} strokeWidth={2} />
          </div>
        )}

      </div>
    </div>
  );
}