import { create } from 'zustand';

import { RouteGeoJSON } from '../types';

interface MapState {
  selectedPoiId: string | null;
  selectedCoords: number[] | null;
  recenterCount: number;
  currentRoute: RouteGeoJSON | null;
  
  // Actions
  selectPoi: (id: string | number, coords: number[]) => void;
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
    selectedPoiId: String(id),
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

