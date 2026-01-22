import { getVal } from '@/lib/api';
import { WMap } from '@/lib/types';

interface Props {
  data: any;
  map: WMap;
}

export default function Table({ data, map }: Props) {
  const list = Array.isArray(data) ? data : (data.data || []);
  const cols = map.cols || [];

  if (!list.length) return <div className="text-center p-4 text-gray-500">No Data</div>;

  return (
    <div className="overflow-x-auto w-full h-full text-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
          <tr>
            {cols.map((c: string) => (
              <th key={c} className="p-2 font-semibold text-gray-600 dark:text-gray-300 capitalize border-b dark:border-gray-700">
                {c.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {list.map((row: any, i: number) => (
            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              {cols.map((c: string) => (
                <td key={c} className="p-2 text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                  {typeof getVal(row, c) === 'number' 
                    ? Number(getVal(row, c)).toLocaleString() 
                    : getVal(row, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}