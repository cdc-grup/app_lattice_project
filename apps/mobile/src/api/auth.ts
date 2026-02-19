import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';

// TODO: Move to environment variables
const API_BASE_URL = 'http://localhost:3000/api/v1';

export const useSyncTicket = () => {
  const setTicket = useAuthStore((state) => state.setTicket);

  return useMutation({
    mutationFn: async (ticketCode: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/sync-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: ticketCode }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync ticket');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setTicket(data.ticket);
    },
  });
};
