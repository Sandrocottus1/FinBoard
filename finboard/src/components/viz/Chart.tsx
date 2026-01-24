'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getVal } from '@/lib/api';
import { WMap } from '@/lib/types';

interface Props {
  data: any;
  map: WMap;
}

export default function Chart({ data, map }: Props) {
  // Handling CoinGecko (prices array) or standard data
  const chartData = Array.isArray(data) 
    ? data 
    : (getVal(data, 'prices') || getVal(data, 'data') || []);

  if (!chartData.length) return <div className="text-center p-4 text-gray-500">No Chart Data</div>;

  // Formatters to make numbers look like Dates and Money
  const formatDate = (tick: any) => {
    // If it's a timestamp (number), making it a date string
    if (typeof tick === 'number') {
      return new Date(tick).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    return tick;
  };

  const formatPrice = (tick: any) => {
    // Compact currency (e.g., $90k)
    if (typeof tick === 'number') {
      return `$${tick.toLocaleString(undefined, { notation: "compact" })}`;
    }
    return tick;
  };

  return (
    <div className="w-full h-full min-h-[200px] text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
          
          {/* X Axis: Time */}
          <XAxis 
            dataKey={map.x} 
            tickFormatter={formatDate}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />

          {/* Y Axis: Price */}
          <YAxis 
            domain={['auto', 'auto']} 
            tickFormatter={formatPrice}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />

          <Tooltip 
            labelFormatter={formatDate}
            formatter={(value: any) => [`$${typeof value === 'number' ? value.toLocaleString() : value}`, 'Price']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          
          <Line 
            type="monotone" 
            dataKey={map.y} 
            stroke="#2563eb" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}