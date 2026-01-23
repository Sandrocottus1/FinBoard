'use client';
import { useState } from 'react';
import { X, Play, Save } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getApi } from '@/lib/api';
import { WCfg, WType } from '@/lib/types';

interface Props {
  close: () => void;
}

export default function Modal({ close }: Props) {
  const add = useStore((s) => s.add);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<WType>('card');
  const [freq, setFreq] = useState(30);
  const [map, setMap] = useState<any>({});

  // Helper: Flatten JSON keys for the dropdown
  const getKeys = (obj: any, prefix = ''): string[] => {
    if (!obj || typeof obj !== 'object') return [];
    return Object.keys(obj).reduce((acc: string[], k) => {
      const pre = prefix ? `${prefix}.${k}` : k;
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        return [...acc, ...getKeys(obj[k], pre)];
      }
      return [...acc, pre];
    }, []);
  };

  // Step 1: Fetch API & Parse Keys
  // Step 1: Fetch API & Parse Keys
  const handleTest = async () => {
    setLoading(true);
    const data = await getApi(url);
    setLoading(false);
    
    if (data) {
      let sample = data;

      // SMARTER UNWRAPPING LOGIC:
      // 1. If it's CoinGecko (has 'prices'), grab that array
      if (Array.isArray(data.prices)) {
        sample = data.prices;
      } 
      // 2. If it's a standard API (has 'data' array), grab that
      else if (data.data && Array.isArray(data.data)) {
        sample = data.data;
      }
      // 3. If it's already an array, use it directly
      else if (Array.isArray(data)) {
        sample = data;
      }

      // Grab the first item from the array to guess the keys (or indices)
      const finalSample = Array.isArray(sample) ? sample[0] : sample;
      
      setKeys(getKeys(finalSample));
      setStep(2);
    } else {
      alert('API Failed. Check URL or CORS.');
    }
  };

  const handleSave = () => {
    const id = Date.now().toString();
    add({ id, name, type, url, freq, map });
    close();
  };

  // Helper for Table Multi-Select
  const toggleCol = (k: string) => {
    const current = map.cols || [];
    const newCols = current.includes(k) 
      ? current.filter((c: string) => c !== k)
      : [...current, k];
    setMap({ ...map, cols: newCols });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="font-bold text-lg">Add Widget</h2>
          <button onClick={close}><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Common Fields */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Widget Name</label>
            <input 
              value={name} onChange={e => setName(e.target.value)} 
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700" 
              placeholder="e.g. Bitcoin Price"
            />
          </div>

          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">API URL</label>
                <div className="flex gap-2">
                  <input 
                    value={url} onChange={e => setUrl(e.target.value)} 
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 text-sm font-mono"
                    placeholder="https://api..."
                  />
                  <button 
                    onClick={handleTest} disabled={loading}
                    className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                   {loading ? '...' : <><Play size={16} /> Test</>}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Click Test to load available fields.</p>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Type</label>
                  <select 
                    value={type} onChange={e => setType(e.target.value as WType)}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="card">Card (Single Metric)</option>
                    <option value="table">Table (List)</option>
                    <option value="chart">Chart (Graph)</option>
                    <option value="socket">Socket (Live Real-time)</option>
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Refresh (s)</label>
                  <input 
                    type="number" value={freq} onChange={e => setFreq(Number(e.target.value))}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>

              {/* Dynamic Mappers based on Type */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
                <h3 className="text-sm font-bold mb-3">Map Data Fields</h3>
                
                {/* CARD CONFIG */}
                {type === 'card' && (
                  <>
                    <label className="text-xs text-gray-500">Value Field</label>
                    <select 
                      onChange={e => setMap({ ...map, val: e.target.value })}
                      className="w-full p-2 mb-2 border rounded dark:bg-gray-700"
                    >
                      <option value="">-- Select Field --</option>
                      {keys.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                    
                    <label className="text-xs text-gray-500">Label Field</label>
                    <select 
                      onChange={e => setMap({ ...map, lbl: e.target.value })}
                      className="w-full p-2 border rounded dark:bg-gray-700"
                    >
                      <option value="">-- Select Field --</option>
                      {keys.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </>
                )}

                {/* TABLE CONFIG */}
                {type === 'table' && (
                  <>
                    <label className="text-xs text-gray-500 mb-2 block">Select Columns to Display:</label>
                    <div className="max-h-32 overflow-y-auto border rounded dark:border-gray-700 p-2 space-y-1 bg-white dark:bg-gray-900">
                      {keys.map(k => (
                        <label key={k} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded">
                          <input 
                            type="checkbox" 
                            checked={(map.cols || []).includes(k)}
                            onChange={() => toggleCol(k)}
                          />
                          {k}
                        </label>
                      ))}
                    </div>
                  </>
                )}

                {/* CHART CONFIG */}
                {type === 'chart' && (
                  <>
                    <label className="text-xs text-gray-500">X Axis (Time/Label)</label>
                    <select 
                      onChange={e => setMap({ ...map, x: e.target.value })}
                      className="w-full p-2 mb-2 border rounded dark:bg-gray-700"
                    >
                      <option value="">-- Select Field --</option>
                      {keys.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>

                    <label className="text-xs text-gray-500">Y Axis (Value)</label>
                    <select 
                      onChange={e => setMap({ ...map, y: e.target.value })}
                      className="w-full p-2 border rounded dark:bg-gray-700"
                    >
                      <option value="">-- Select Field --</option>
                      {keys.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </>
                )}
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 flex justify-center items-center gap-2"
              >
                <Save size={18} /> Create Widget
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}