import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';

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
    wait_time_minutes?: number;
  };
}

export interface POICollection {
  type: 'FeatureCollection';
  features: POIGeoJSON[];
}

export const usePOIs = (category?: string) => {
  return useQuery({
    queryKey: ['pois', category],
    queryFn: () => apiClient.get<POICollection>('/pois', category ? { category } : undefined),
  });
};
