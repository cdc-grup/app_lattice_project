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
  setAuth: (token: string, user: User) => void;
  setTicket: (ticket: Ticket) => void;
  addTicketToWallet: (ticket: Ticket) => void;
  logout: () => void;
}

const createAuthStore: StateCreator<AuthState, [['zustand/persist', unknown]]> = (set) => ({
  token: null,
  user: null,
  activeTicket: null,
  tickets: [],
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
  logout: () => set({ token: null, user: null, activeTicket: null, tickets: [] }),
});

export const useAuthStore = create<AuthState>()(
  persist(createAuthStore, {
    name: 'auth-storage',
    storage: createJSONStorage(() => mmkvStorage),
  })
);
