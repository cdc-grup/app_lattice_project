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
  setAuth: (token: string, user: User) => void;
  setTicket: (ticket: Ticket) => void;
  logout: () => void;
}

const createAuthStore: StateCreator<AuthState, [['zustand/persist', unknown]]> = (set) => ({
  token: null,
  user: null,
  activeTicket: null,
  setAuth: (token, user) => set({ token, user }),
  setTicket: (ticket) => set({ activeTicket: ticket }),
  logout: () => set({ token: null, user: null, activeTicket: null }),
});

export const useAuthStore = create<AuthState>()(
  persist(createAuthStore, {
    name: 'auth-storage',
    storage: createJSONStorage(() => mmkvStorage),
  })
);
