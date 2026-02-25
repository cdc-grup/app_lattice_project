import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { POICollection } from '../types';

export const geoService = {
  getPOIs: async (category?: string): Promise<POICollection> => {
    return apiClient.get<POICollection>(
      API_ENDPOINTS.GEO.POIS, 
      category ? { category } : undefined
    );
  },

  getCategories: async (): Promise<string[]> => {
    return apiClient.get<string[]>(API_ENDPOINTS.GEO.CATEGORIES);
  },
};
