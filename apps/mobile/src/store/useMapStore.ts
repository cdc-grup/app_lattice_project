import { create } from 'zustand';
import { RouteGeoJSON } from '../types';
import { UIPOI } from '../types/models/poi';

interface MapState {
  selectedPoiId: string | null;
  selectedPoi: UIPOI | null;
  selectedCoords: number[] | null;
  recenterCount: number;
  currentRoute: RouteGeoJSON | null;
  isNavigating: boolean;
  
  // Actions
  selectPoi: (poi: UIPOI | { id: string | number; geometry: { coordinates: number[] } }) => void;
  setRoute: (route: RouteGeoJSON | null) => void;
  setNavigating: (navigating: boolean) => void;
  deselect: () => void;
  triggerRecenter: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedPoiId: null,
  selectedPoi: null,
  selectedCoords: null,
  recenterCount: 0,
  currentRoute: null,
  isNavigating: false,

  selectPoi: (poi) => {
    const isObject = poi !== null && typeof poi === 'object';
    const isFullPoi = isObject && 'name' in poi;
    
    set({
      selectedPoiId: isObject ? String(poi.id) : String(poi),
      selectedPoi: isFullPoi ? poi as UIPOI : null,
      selectedCoords: isObject ? (poi as any).geometry?.coordinates : null,
    });
  },

  setRoute: (route) => set({
    currentRoute: route,
  }),

  setNavigating: (navigating) => set({
    isNavigating: navigating,
  }),

  deselect: () => {
    set({
      selectedPoiId: null,
      selectedPoi: null,
      selectedCoords: null,
      currentRoute: null,
      isNavigating: false,
    });
  },

  triggerRecenter: () => set((state) => ({ recenterCount: state.recenterCount + 1 })),
}));

