import { create } from 'zustand';

export const useSelectionStore = create((set) => ({
    selection: null,
    setSelection: (nextSelection) => set({ selection: nextSelection }),
    clearSelection: () => set({ selection: null })
}));