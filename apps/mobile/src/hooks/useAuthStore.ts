import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { User, Ticket } from '../types/models/auth';
import { authService } from '../services/authService';

const storage = createMMKV();

const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

interface AuthState {
  token: string | null;
  user: User | null;
  activeTicket: Ticket | null;
  tickets: Ticket[]; // Wallet of all scanned tickets
  pendingTicketCode: string | null; // Stores scanned code if user needs to login/register
  isGuest: boolean; // True if logged in via Ticket Sync only
  setAuth: (token: string, user: User, isGuest?: boolean) => void;
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
  isGuest: false,
  setAuth: (token, user, isGuest = false) => set({ token, user, isGuest }),
  setTicket: (ticket) => set((state) => ({ 
    activeTicket: ticket,
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
      const ticket = await authService.claimTicket(ticketCode, token ?? undefined);
      if (ticket) {
        setTicket(ticket);
        set({ user: { ...get().user!, hasTicket: true } }); // Update User State
        setPendingTicketCode(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error claiming ticket:', error);
      return false;
    }
  },
  logout: () => set({ token: null, user: null, activeTicket: null, tickets: [], pendingTicketCode: null, isGuest: false }),
});

export const useAuthStore = create<AuthState>()(
  persist(createAuthStore, {
    name: 'auth-storage',
    storage: createJSONStorage(() => mmkvStorage),
  })
);
