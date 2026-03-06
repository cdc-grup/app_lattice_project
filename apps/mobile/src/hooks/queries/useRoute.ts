import { useQuery } from '@tanstack/react-query';
import { navigationService, RouteRequest } from '../../services/navigationService';
import { useMapStore } from '../../store/useMapStore';
import { useEffect } from 'react';

export const useRoute = (request: RouteRequest | null) => {
  const { setRoute } = useMapStore();

  const query = useQuery({
    queryKey: ['route', request],
    queryFn: () => (request ? navigationService.getRoute(request) : null),
    enabled: !!request,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      setRoute(query.data);
    } else if (!request) {
      setRoute(null);
    }
  }, [query.data, request, setRoute]);

  return query;
};
