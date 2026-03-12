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
  
  // Actions - Renamed to break cache
  selectPoi: (poi: any) => void;
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

  selectPoi: (poi: any) => {
    // Si llegamos aquí, Metro DEBE estar usando este archivo nuevo
    console.log('--- RECARGA FORZADA: Store Activo ---');
    
    if (!poi) return;
    
    const isObj = typeof poi === 'object' && poi !== null;
    const id = isObj ? String(poi.id || '') : String(poi);
    const coords = isObj ? (poi.geometry?.coordinates || null) : null;
    const fullPoi = (isObj && (poi.name || poi.label)) ? (poi as UIPOI) : null;

    set({
      selectedPoiId: id,
      selectedPoi: fullPoi,
      selectedCoords: coords,
    });
  },

  setRoute: (route) => set({ currentRoute: route }),
  setNavigating: (nav) => set({ isNavigating: nav }),
  deselect: () => set({
    selectedPoiId: null,
    selectedPoi: null,
    selectedCoords: null,
    currentRoute: null,
    isNavigating: false,
  }),
  triggerRecenter: () => set((state) => ({ recenterCount: state.recenterCount + 1 })),
}));
