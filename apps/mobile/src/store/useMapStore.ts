import { create } from 'zustand';

import { RouteGeoJSON } from '../types';

interface MapState {
  selectedPoiId: number | null;
  selectedCoords: number[] | null;
  recenterCount: number;
  currentRoute: RouteGeoJSON | null;
  
  // Actions
  selectPoi: (id: number, coords: number[]) => void;
  setRoute: (route: RouteGeoJSON | null) => void;
  deselect: () => void;
  triggerRecenter: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedPoiId: null,
  selectedCoords: null,
  recenterCount: 0,
  currentRoute: null,

  selectPoi: (id, coords) => set({
    selectedPoiId: id,
    selectedCoords: coords,
  }),

  setRoute: (route) => set({
    currentRoute: route,
  }),

  deselect: () => {
    set({
      selectedPoiId: null,
      selectedCoords: null,
      currentRoute: null,
    });
  },

  triggerRecenter: () => set((state) => ({ recenterCount: state.recenterCount + 1 })),
}));

