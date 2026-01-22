import { getVal } from '@/lib/api';

interface Props {
  data: any;
  map: { val?: string; lbl?: string };
}

export default function Card({ data, map }: Props) {
  const val = map.val ? getVal(data, map.val) : 'N/A';
  const lbl = map.lbl ? getVal(data, map.lbl) : '';

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-sm text-gray-500">{lbl}</h3>
      <p className="text-3xl font-bold mt-2">{val}</p>
    </div>
  );
}