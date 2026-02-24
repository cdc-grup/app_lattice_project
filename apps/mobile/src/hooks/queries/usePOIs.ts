import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

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
    queryFn: async (): Promise<POICollection> => {
      const url = new URL(`${API_BASE_URL}/pois`);
      if (category) {
        url.searchParams.append('category', category);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch POIs');
      }
      return response.json();
    },
  });
};
