import { useQuery } from '@tanstack/react-query';
import { geoService } from '../../services/geoService';

export const usePathNetwork = () => {
  return useQuery({
    queryKey: ['pathNetwork'],
    queryFn: () => geoService.getPathNetwork(),
  });
};
