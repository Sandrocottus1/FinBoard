'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { WCfg } from '@/lib/types';
import { X, Play, Plus, Loader2 } from 'lucide-react';
import { getApi } from '@/lib/api';

interface Props {
  close: () => void;
  onSuccess?: (name: string) => void;
}

const STORAGE_KEY = 'finboard-add-widget-draft';

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

const saveWidgetDraft = (widget: Partial<WCfg>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widget));
  } catch (e) {
    console.error('Failed to save widget draft:', e);
  }
};

const getWidgetDraft = (): Partial<WCfg> | null => {
  try {
    const draft = localStorage.getItem(STORAGE_KEY);
    return draft ? JSON.parse(draft) : null;
  } catch (e) {
    console.error('Failed to get widget draft:', e);
    return null;
  }
};

const clearWidgetDraft = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear widget draft:', e);
  }
};

export default function Modal({ close, onSuccess }: Props) {
  const add = useStore((s) => s.add);
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);
  
  const [widget, setWidget] = useState<Partial<WCfg>>({
    name: '',
    type: 'card',
    url: '',
    freq: 30,
    map: {}
  });

  // Restore draft on mount
  useEffect(() => {
    const draft = getWidgetDraft();
    if (draft) {
      setWidget(draft);
    }
  }, []);

  const isSocket = widget.type === 'socket';

  const handleTest = async () => {
    if (!widget.name ||!widget.url) return alert('Name and URL required');;
    setLoading(true);
    
    if (isSocket) {
        setLoading(false);
        return;
    }

    const data = await getApi(widget.url);
    setLoading(false);
    
    if (data) {
      let sample = data;
      if (Array.isArray(data.prices)) sample = data.prices; 
      else if (data.data && Array.isArray(data.data)) sample = data.data;
      else if (Array.isArray(data)) sample = data;

      const finalSample = Array.isArray(sample) ? sample[0] : sample;
      setKeys(getKeys(finalSample));
    } else {
      alert('API Failed. Check URL.');
    }
  };

  const handleCreate = () => {
    if (!widget.name || !widget.url) return alert('Name and URL required');
    
    add({
      id: Date.now().toString(),
      name: widget.name,
      type: widget.type as any,
      url: widget.url,
      freq: widget.freq || 30,
      map: widget.map || {}
    });
    clearWidgetDraft();
    if(onSuccess) onSuccess(widget.name);
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900">
          <h2 className="text-lg font-bold text-white">Add Widget</h2>
          <button onClick={close} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Widget Name</label>
            <input 
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g. Market Leaderboard"
              value={widget.name}
              onChange={(e) => {
                const updated = { ...widget, name: e.target.value };
                setWidget(updated);
                saveWidgetDraft(updated);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                <select 
                  className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white outline-none"
                  value={widget.type}
                  onChange={(e) => {
                    const updated = { ...widget, type: e.target.value as any, map: {} };
                    setWidget(updated);
                    saveWidgetDraft(updated);
                  }}
                >
                  <option value="card">Card (Single Metric)</option>
                  <option value="table">Table (List)</option>
                  <option value="chart">Chart (Graph)</option>
                  <option value="socket">Socket (Real-time)</option>
                </select>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Refresh (Sec)</label>
                <input 
                  type="number"
                  className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white disabled:opacity-50"
                  value={isSocket ? 0 : widget.freq}
                  disabled={isSocket}
                  onChange={(e) => {
                    const updated = { ...widget, freq: Number(e.target.value) };
                    setWidget(updated);
                    saveWidgetDraft(updated);
                  }}
                />
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
               {isSocket ? 'Coin ID' : 'API URL'}
            </label>
            <div className="flex gap-2">
              <input 
                className="flex-1 p-3 bg-gray-950 border border-gray-800 rounded-lg text-white font-mono text-sm outline-none"
                placeholder={isSocket ? "bitcoin" : "https://api..."}
                value={widget.url}
                onChange={(e) => {
                  const updated = { ...widget, url: e.target.value };
                  setWidget(updated);
                  saveWidgetDraft(updated);
                }}
              />
              {!isSocket && (
                  <button 
                    onClick={handleTest}
                    disabled={loading || !widget.url}
                    className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin"/> : <Play size={18} />}
                    Test
                  </button>
              )}
            </div>
          </div>

          {!isSocket && keys.length > 0 && (
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-4">
               <h3 className="text-sm font-semibold text-white border-b border-gray-800 pb-2">Map Data Fields</h3>
               
               {widget.type === 'card' && (
                 <>
                   <div>
                     <label className="text-xs text-gray-500 uppercase">Label Field</label>
                     <select 
                       className="w-full p-2 bg-gray-900 rounded border border-gray-800 text-sm text-gray-300" 
                       value={widget.map?.lbl || ''}
                       onChange={(e) => {
                         const updated = {...widget, map: {...widget.map, lbl: e.target.value}};
                         setWidget(updated);
                         saveWidgetDraft(updated);
                       }}
                     >
                        <option value="">-- Select --</option>
                        {keys.map(k => <option key={k} value={k}>{k}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-xs text-gray-500 uppercase">Value Field</label>
                     <select 
                       className="w-full p-2 bg-gray-900 rounded border border-gray-800 text-sm text-gray-300" 
                       value={widget.map?.val || ''}
                       onChange={(e) => {
                         const updated = {...widget, map: {...widget.map, val: e.target.value}};
                         setWidget(updated);
                         saveWidgetDraft(updated);
                       }}
                     >
                        <option value="">-- Select --</option>
                        {keys.map(k => <option key={k} value={k}>{k}</option>)}
                     </select>
                   </div>
                 </>
               )}

               {widget.type === 'chart' && (
                  <>
                   <div>
                     <label className="text-xs text-gray-500 uppercase">X Axis (Time)</label>
                     <select 
                       className="w-full p-2 bg-gray-900 rounded border border-gray-800 text-sm text-gray-300" 
                       value={widget.map?.x || ''}
                       onChange={(e) => {
                         const updated = {...widget, map: {...widget.map, x: e.target.value}};
                         setWidget(updated);
                         saveWidgetDraft(updated);
                       }}
                     >
                        <option value="">-- Select --</option>
                        {keys.map(k => <option key={k} value={k}>{k}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-xs text-gray-500 uppercase">Y Axis (Price)</label>
                     <select 
                       className="w-full p-2 bg-gray-900 rounded border border-gray-800 text-sm text-gray-300" 
                       value={widget.map?.y || ''}
                       onChange={(e) => {
                         const updated = {...widget, map: {...widget.map, y: e.target.value}};
                         setWidget(updated);
                         saveWidgetDraft(updated);
                       }}
                     >
                        <option value="">-- Select --</option>
                        {keys.map(k => <option key={k} value={k}>{k}</option>)}
                     </select>
                   </div>
                  </>
               )}
               
               {widget.type === 'table' && (
                 <div className="space-y-2">
                   <label className="text-xs text-gray-500 uppercase">Select Columns</label>
                   <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-gray-900 rounded border border-gray-800">
                     {keys.map((k) => (
                       <label key={k} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                         <input 
                           type="checkbox" 
                           className="rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-0"
                           checked={(widget.map?.cols || []).includes(k)}
                           onChange={(e) => {
                             const current = widget.map?.cols || [];
                             const newCols = e.target.checked 
                               ? [...current, k] 
                               : current.filter((c: string) => c !== k);
                             const updated = {...widget, map: {...widget.map, cols: newCols}};
                             setWidget(updated);
                             saveWidgetDraft(updated);
                           }}
                         />
                         <span className="truncate" title={k}>{k}</span>
                       </label>
                     ))}
                   </div>
                   <p className="text-[10px] text-gray-500">Check fields to show as table columns.</p>
                 </div>
               )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900 flex justify-end">
          <button 
            onClick={handleCreate}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Create Widget
          </button>
        </div>

      </div>
    </div>
  );
}
