import { create } from "zustand";

interface State {
  products: any[];
  page: number;
  hasMore: boolean;
  scrollY: number;

  setProducts: (p: any[]) => void;
  appendProducts: (p: any[]) => void;
  setPage: (p: number) => void;
  setScroll: (y: number) => void;
  setHasMore: (v: boolean) => void;
  reset: () => void;
}

export const useProductStore = create<State>((set) => ({
  products: [],
  page: 1,
  hasMore: true,
  scrollY: 0,

  setProducts: (p) => set({ products: p }),
  appendProducts: (p) =>
    set((s) => ({ products: [...s.products, ...p] })),

  setPage: (p) => set({ page: p }),
  setScroll: (y) => set({ scrollY: y }),
  setHasMore: (v) => set({ hasMore: v }),

  reset: () =>
    set({ products: [], page: 1, hasMore: true, scrollY: 0 }),
}));