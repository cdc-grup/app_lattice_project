import { useMutation } from '@tanstack/react-query';
import { useAuthStore, Ticket, User } from '../hooks/useAuthStore';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const useSyncTicket = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setTicket = useAuthStore((state) => state.setTicket);

  return useMutation({
    mutationFn: async (ticketCode: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/ticket-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_code_data: ticketCode, device_id: 'mobile-app' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.user_friendly_message || 'Failed to sync ticket');
      }

      return response.json();
    },
    onSuccess: (data: { user: User; token: string; ticket_info: Ticket }) => {
      setAuth(data.token, data.user);
      setTicket(data.ticket_info);
    },
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async ({ email, password }: any) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.user_friendly_message || 'Login failed');
      }

      return response.json();
    },
    onSuccess: (data: { user: User; token: string }) => {
      setAuth(data.token, data.user);
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async ({ email, password, fullName }: any) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.user_friendly_message || 'Registration failed');
      }

      return response.json();
    },
    onSuccess: (data: { user: User; token: string }) => {
      setAuth(data.token, data.user);
    },
  });
};
