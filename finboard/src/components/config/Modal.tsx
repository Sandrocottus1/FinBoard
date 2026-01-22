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
  const [url, setUrl] = useState('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=BTC&apikey=XKO8UGM5K3MPSRP3');
  const [type, setType] = useState<WType>('card');
  const [freq, setFreq] = useState(30);
  const [map, setMap] = useState<any>({});

  // Helper: Flatten JSON keys for the dropdown (e.g. "bpi.USD.rate")
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
  const handleTest = async () => {
    setLoading(true);
    const data = await getApi(url);
    setLoading(false);
    
    if (data) {
      // If array (for table/chart), grab the first item to guess keys
      const sample = Array.isArray(data) ? data[0] : (data.data || data);
      setKeys(getKeys(sample));
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="font-bold text-lg">Add Widget</h2>
          <button onClick={close}><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
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
                
                {type === 'card' && (
                  <>
                    <label className="text-xs text-gray-500">Value Field (e.g. price)</label>
                    <select 
                      onChange={e => setMap({ ...map, val: e.target.value })}
                      className="w-full p-2 mb-2 border rounded dark:bg-gray-700"
                    >
                      <option value="">-- Select Field --</option>
                      {keys.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                    
                    <label className="text-xs text-gray-500">Label Field (Optional)</label>
                    <select 
                      onChange={e => setMap({ ...map, lbl: e.target.value })}
                      className="w-full p-2 border rounded dark:bg-gray-700"
                    >
                      <option value="">-- Select Field --</option>
                      {keys.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </>
                )}

                {/* Simplified for brevity - add Chart/Table mapping similarly if needed */}
                {type !== 'card' && (
                   <p className="text-xs text-yellow-600">
                     For Table/Chart, ensure API returns an array. Select "value" or "x/y" keys similarly.
                   </p>
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