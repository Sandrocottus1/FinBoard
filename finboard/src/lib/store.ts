import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WCfg } from './types';

interface Store {
  ws: WCfg[];
  add: (w: WCfg) => void;
  remove: (id: string) => void; 
  reorder: (ws: WCfg[]) => void;
  setWidgets: (ws: WCfg[]) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      ws: [],
      add: (w) => set((s) => ({ ws: [...s.ws, w] })),
      
      // The logic to actually delete the widget by ID
      remove: (id) => set((s) => ({ ws: s.ws.filter((w) => w.id !== id) })),
      
      reorder: (ws) => set({ ws }),
      setWidgets:(newWidgets)=>set({ws:newWidgets}),
    }),
    { name: 'finboard-store' }
  )
);