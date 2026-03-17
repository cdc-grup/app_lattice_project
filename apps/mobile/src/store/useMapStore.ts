import { create } from 'zustand';
import { RouteGeoJSON } from '../types';
import { UIPOI } from '../types/models/poi';

interface RouteMetadata {
  distance: number;
  duration: number;
  destinationName: string;
}

interface MapState {
  selectedPoiId: string | null;
  selectedPoi: UIPOI | null;
  selectedCoords: number[] | null;
  recenterCount: number;
  currentRoute: RouteGeoJSON | null;
  routeMetadata: RouteMetadata | null;
  isNavigating: boolean;

  // Actions - Renamed to break cache
  selectPoi: (poi: any) => void;
  setRoute: (route: RouteGeoJSON | null, metadata?: RouteMetadata | null) => void;
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
  routeMetadata: null,
  isNavigating: false,

  selectPoi: (poi: any) => {
    if (!poi) return;

    const isObj = typeof poi === 'object' && poi !== null;
    const id = isObj ? String(poi.id || '') : String(poi);
    const coords = isObj ? poi.geometry?.coordinates || null : null;
    const fullPoi = isObj && (poi.name || poi.label) ? (poi as UIPOI) : null;

    set({
      selectedPoiId: id,
      selectedPoi: fullPoi,
      selectedCoords: coords,
      isNavigating: false, // Reset navigation when selecting a new POI
    });
  },

  setRoute: (route, metadata = null) =>
    set({
      currentRoute: route,
      routeMetadata:
        metadata ||
        (route?.properties
          ? {
              distance: route.properties.distance,
              duration: route.properties.durationEstimate,
              destinationName: '', // Will be filled by the caller if needed
            }
          : null),
    }),
  setNavigating: (nav) => set({ isNavigating: nav }),
  deselect: () =>
    set({
      selectedPoiId: null,
      selectedPoi: null,
      selectedCoords: null,
      currentRoute: null,
      routeMetadata: null,
      isNavigating: false,
    }),
  triggerRecenter: () => set((state) => ({ recenterCount: state.recenterCount + 1 })),
}));
