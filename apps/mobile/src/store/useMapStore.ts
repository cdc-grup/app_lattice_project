import { create } from 'zustand';

interface MapState {
  selectedPoiId: number | null;
  selectedCoords: number[] | null;
  recenterCount: number;
  
  // Actions
  selectPoi: (id: number, coords: number[]) => void;
  deselect: () => void;
  triggerRecenter: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedPoiId: null,
  selectedCoords: null,
  recenterCount: 0,

  selectPoi: (id, coords) => set({
    selectedPoiId: id,
    selectedCoords: coords,
  }),

  deselect: () => {
    set({
      selectedPoiId: null,
      selectedCoords: null,
    });
  },

  triggerRecenter: () => set((state) => ({ recenterCount: state.recenterCount + 1 })),
}));

