import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../hooks/useAuthStore';
import { Ticket, User } from '../types';
import { apiClient } from './apiClient';

export const useSyncTicket = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setTicket = useAuthStore((state) => state.setTicket);

  return useMutation({
    mutationFn: async (ticketCode: string) => {
      return apiClient.post<{ user: User; token: string; ticket_info: Ticket }>(
        '/auth/ticket-sync',
        { qr_code_data: ticketCode, device_id: 'mobile-app' }
      );
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      setTicket(data.ticket_info);
    },
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setTicket = useAuthStore((state) => state.setTicket);

  return useMutation({
    mutationFn: async ({ email, password }: any) => {
      return apiClient.post<{ user: User; token: string; ticket_info?: Ticket }>('/auth/login', {
        email,
        password,
      });
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      if (data.ticket_info) {
        setTicket(data.ticket_info);
      }
      useAuthStore.getState().setPendingTicketCode(null);
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async ({ email, password, fullName }: any) => {
      return apiClient.post<{ user: User; token: string }>('/auth/register', {
        email,
        password,
        fullName,
      });
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
};
