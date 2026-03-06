export interface POIGeoJSON {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: number;
    name: string;
    category: string;
    description: string;
    crowdLevel: 'low' | 'moderate' | 'high' | 'blocked';
    isWheelchairAccessible: boolean;
    hasPriorityLane: boolean;
    wait_time_minutes?: number;
    time?: string;
    distance?: string;
    images?: string[];
  };
}

export interface POICollection {
  type: 'FeatureCollection';
  features: POIGeoJSON[];
}

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'idle' | 'loading' | 'blocked';

export interface RouteGeoJSON {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  properties: {
    distance: number;
    durationEstimate: number;
  };
}

