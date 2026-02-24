import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

export interface User {
  id: number;
  email: string;
  fullName: string;
}

export interface Ticket {
  id: number;
  code: string;
  zoneName: string;
  gate: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  activeTicket: Ticket | null;
  tickets: Ticket[]; // Wallet of all scanned tickets
  pendingTicketCode: string | null; // Stores scanned code if user needs to login/register
  setAuth: (token: string, user: User) => void;
  setTicket: (ticket: Ticket) => void;
  addTicketToWallet: (ticket: Ticket) => void;
  setPendingTicketCode: (code: string | null) => void;
  claimTicket: (ticketCode: string) => Promise<boolean>;
  logout: () => void;
}

const createAuthStore: StateCreator<AuthState, [['zustand/persist', unknown]]> = (set, get) => ({
  token: null,
  user: null,
  activeTicket: null,
  tickets: [],
  pendingTicketCode: null,
  setAuth: (token, user) => set({ token, user }),
  setTicket: (ticket) => set((state) => ({ 
    activeTicket: ticket,
    // Automatically add to wallet if it's not already there
    tickets: state.tickets.some(t => t.code === ticket.code) 
      ? state.tickets 
      : [...state.tickets, ticket]
  })),
  addTicketToWallet: (ticket) => set((state) => ({
    tickets: state.tickets.some(t => t.code === ticket.code) 
      ? state.tickets 
      : [...state.tickets, ticket]
  })),
  setPendingTicketCode: (code) => set({ pendingTicketCode: code }),
  claimTicket: async (ticketCode: string) => {
    const { token, setTicket, setPendingTicketCode } = get();
    try {
      // Use EXPO_PUBLIC_API_URL or fallback wrapper. 
      // Replace with your actual api client if you have one.
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.31.4.242:3000';
      const response = await fetch(`${API_URL}/auth/ticket/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ ticket_code: ticketCode }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      if (data.ticket_info) {
        const t = { id: data.ticket_info.id, code: data.ticket_info.code, zoneName: data.ticket_info.zoneName, gate: data.ticket_info.gate };
        setTicket(t);
        setPendingTicketCode(null); // Clear upon successful claim
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error claiming ticket:', error);
      return false;
    }
  },
  logout: () => set({ token: null, user: null, activeTicket: null, tickets: [], pendingTicketCode: null }),
});

export const useAuthStore = create<AuthState>()(
  persist(createAuthStore, {
    name: 'auth-storage',
    storage: createJSONStorage(() => mmkvStorage),
  })
);
