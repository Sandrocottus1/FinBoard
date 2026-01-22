import { getVal } from '@/lib/api';
import { WMap } from '@/lib/types'; // Import this

interface Props {
  data: any;
  map: WMap; // Use the shared type
}

export default function Table({ data, map }: Props) {
  const list = Array.isArray(data) ? data : (getVal(data, 'items') || getVal(data, 'data') || []);
  const cols = map.cols || [];

  if (!Array.isArray(list)) return <div className="p-4">Invalid Table Data</div>;

  return (
    <div className="overflow-auto h-full w-full">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
          <tr>
            {cols.map((c) => (
              <th key={c} className="p-2 border-b font-medium">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((row: any, i: number) => (
            <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
              {cols.map((c) => (
                <td key={c} className="p-2 truncate max-w-[100px]" title={getVal(row, c)}>
                  {getVal(row, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}