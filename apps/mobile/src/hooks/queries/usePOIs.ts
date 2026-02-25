import { useQuery } from '@tanstack/react-query';
import { geoService } from '../../services/geoService';

export const usePOIs = (category?: string) => {
  return useQuery({
    queryKey: ['pois', category],
    queryFn: () => geoService.getPOIs(category),
  });
};
