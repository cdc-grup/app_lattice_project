import { create } from 'zustand';

interface MapState {
  selectedPoiId: number | null;
  selectedCoords: number[] | null;
  
  // Actions
  selectPoi: (id: number, coords: number[]) => void;
  deselect: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedPoiId: null,
  selectedCoords: null,

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
}));
