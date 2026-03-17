import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../hooks/useAuthStore';
import { Ticket, User } from '../types/models/auth';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const useSyncTicket = () => {
  return useMutation({
    mutationFn: async (ticketCode: string) => {
      return apiClient.post<{ user: User; token: string; ticket_info: Ticket; requires_setup: boolean }>(
        API_ENDPOINTS.AUTH.TICKET_SYNC,
        { qr_code_data: ticketCode, device_id: 'mobile-app' }
      );
    },
    onSuccess: (data) => {
      const { setRegistrationRequired, setAuth, setTicket } = useAuthStore.getState();
      
      if (data.requires_setup) {
        setRegistrationRequired(true, data.user.email);
        setTicket(data.ticket_info);
      } else {
        setAuth(data.token, data.user, (data as any).tickets || [], true);
        setTicket(data.ticket_info);
      }
    },
  });
};

export const useLogin = () => {
  const pendingTicketCode = useAuthStore((state) => state.pendingTicketCode);

  return useMutation({
    mutationFn: async ({ email, password }: any) => {
      return apiClient.post<{ user: User; token: string; ticket_info?: Ticket }>(
        API_ENDPOINTS.AUTH.LOGIN, 
        {
          email,
          password,
          ticket_code: pendingTicketCode || undefined,
        }
      );
    },
    onSuccess: (data: any) => {
      const { setAuth, setTicket } = useAuthStore.getState();
      setAuth(data.token, data.user, data.tickets || [], false);
      if (data.ticket_info) {
        setTicket(data.ticket_info);
      }
      useAuthStore.getState().setPendingTicketCode(null);
    },
  });
};

export const useRegister = () => {
  const pendingTicketCode = useAuthStore((state) => state.pendingTicketCode);

  return useMutation({
    mutationFn: async ({ email, password, fullName }: any) => {
      return apiClient.post<{ user: User; token: string; ticket_info?: Ticket }>(
        API_ENDPOINTS.AUTH.REGISTER, 
        {
          email,
          password,
          fullName,
          ticket_code: pendingTicketCode || undefined,
        }
      );
    },
    onSuccess: (data: any) => {
      const { setAuth } = useAuthStore.getState();
      setAuth(data.token, data.user, data.tickets || [], false);
      if (data.ticket_info) {
        useAuthStore.getState().setTicket(data.ticket_info);
      }
      useAuthStore.getState().setPendingTicketCode(null);
    },
  });
};
