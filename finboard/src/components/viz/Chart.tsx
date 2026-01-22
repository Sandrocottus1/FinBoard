'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { getVal } from '@/lib/api';
import { WMap } from '@/lib/types'; // Import this

interface Props {
  data: any;
  map: WMap; // Use the shared type
}

export default function Chart({ data, map }: Props) {
  const chartData = Array.isArray(data) ? data : (getVal(data, 'data') || []);

  if (!chartData.length) return <div className="text-center p-4">No Chart Data</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <XAxis dataKey={map.x} hide />
        <YAxis domain={['auto', 'auto']} hide />
        <Tooltip />
        <Line type="monotone" dataKey={map.y} stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}