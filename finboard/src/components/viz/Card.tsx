'use client';
import { getVal } from '@/lib/api';
import { WMap } from '@/lib/types';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  data: any;
  map: WMap;
}

export default function Card({ data: d, map: m }: Props) {
  const rawVal = m.val ? getVal(d, m.val) : null;
  
  // If the API returns a number (like -1.5), this prevents the crash.
  const rawLabel = m.lbl ? getVal(d, m.lbl) : 'Select Data';
  const label = String(rawLabel ?? ''); 

  // Smart Formatting Logic
  const formatVal = (v: any) => {
    if (typeof v === 'number') {
      // Checking if it's a percentage (change) or price
      if (label.toLowerCase().includes('change') || label.toLowerCase().includes('percent')) {
         return `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
      }
      
      // Default: Formatting as Currency
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
  
  // Determining Colors
  // We check if the Label *or* the Value indicates a "Change"
  const isChange = label.toLowerCase().includes('change') || label.toLowerCase().includes('percent');
  const isPositive = typeof rawVal === 'number' && rawVal >= 0;
  
  const textColor = isChange 
    ? (isPositive ? 'text-green-500' : 'text-red-500')
    : 'text-gray-900 dark:text-gray-100';

  return (
    <div className="relative h-full w-full flex flex-col justify-center overflow-hidden pl-4 group">
      {/* Decorative Background Icon */}
      <div className="absolute -right-6 -bottom-6 text-gray-100 dark:text-gray-800 opacity-50 rotate-[-12deg] group-hover:scale-110 transition-transform duration-500">
        {isChange ? (isPositive ? <TrendingUp size={100} strokeWidth={1}/> : <TrendingDown size={100} strokeWidth={1}/>) : <Activity size={100} strokeWidth={1} />}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-2">
          <span className={`w-1 h-4 rounded-full ${isChange ? (isPositive ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-500'}`}></span>
          {label}
        </h4>
        
        <span className={`text-4xl sm:text-5xl font-black tracking-tighter transition-colors duration-300 ${textColor}`}>
          {formattedVal || '--'}
        </span>
      </div>
    </div>
  );
}