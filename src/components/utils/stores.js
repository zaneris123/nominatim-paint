import { create } from 'zustand';

export const useSelectionStore = create((set) => ({
    selection: null,
    setSelection: (nextSelection) => set({ selection: nextSelection }),
    clearSelection: () => set({ selection: null })
}));

export const useJsonStore = create((set) => ({
    json: null,
    setJson: (newJson) => set({json: newJson}),
    clearSelection: () => set({ json: null})
}))