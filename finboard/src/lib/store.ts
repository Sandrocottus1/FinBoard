import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WCfg } from './types';

interface St {
  ws: WCfg[]; // Widgets
  add: (w: WCfg) => void;
  del: (id: string) => void;
  reorder: (ws: WCfg[]) => void;
}

export const useStore = create<St>()(
  persist(
    (set) => ({
      ws: [],
      add: (w) => set((s) => ({ ws: [...s.ws, w] })),
      del: (id) => set((s) => ({ ws: s.ws.filter((i) => i.id !== id) })),
      reorder: (ws) => set({ ws }),
    }),
    { name: 'finboard-st' }
  )
);