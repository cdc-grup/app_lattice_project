import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { Ticket, User } from '../types';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ClaimTicketResponse {
  ticket_info: Ticket;
}

export const authService = {
  claimTicket: async (ticketCode: string, token?: string): Promise<Ticket> => {
    const data = await apiClient.post<ClaimTicketResponse>(
      API_ENDPOINTS.AUTH.TICKET_CLAIM, 
      { ticket_code: ticketCode },
      token
    );
    return data.ticket_info;
  },

  getMe: async (token: string): Promise<User> => {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME, undefined, token);
  },
};
