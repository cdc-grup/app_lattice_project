import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { Ticket, User } from '../types/models/auth';

export interface AuthResponse {
  token: string;
  user: User;
  tickets: Ticket[];
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

  updateMe: async (data: Partial<User>, token: string): Promise<User> => {
    return apiClient.patch<User>(API_ENDPOINTS.AUTH.ME, data, token);
  },

  getUserTickets: async (token: string): Promise<Ticket[]> => {
    return apiClient.get<Ticket[]>(API_ENDPOINTS.AUTH.TICKET_WALLET, undefined, token);
  },
  
  unclaimTicket: async (ticketCode: string, token: string): Promise<{ tickets: Ticket[] }> => {
    return apiClient.post<{ tickets: Ticket[] }>(
      API_ENDPOINTS.AUTH.TICKET_UNCLAIM,
      { ticket_code: ticketCode },
      token
    );
  },
};
