import { getVal } from '@/lib/api';
import { WMap } from '@/lib/types';

interface Props {
  data: any;
  map: WMap;
}

export default function Card({ data, map }: Props) {
  // DEBUG: Check what is actually arriving
  console.log("Card Data:", data);
  console.log("Card Map:", map);

  const val = map.val ? getVal(data, map.val) : 'N/A';
  const lbl = map.lbl ? getVal(data, map.lbl) : '';

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-sm text-gray-500">{lbl}</h3>
      {/* If val is missing, show a warning instead of empty space */}
      <p className="text-3xl font-bold mt-2">{val || 'Start Mapping'}</p>
    </div>
  );
}