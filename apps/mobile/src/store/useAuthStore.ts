import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

interface User {
  id: number;
  email: string;
  fullName: string;
}

interface Ticket {
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      activeTicket: null,
      setAuth: (token, user) => set({ token, user }),
      setTicket: (ticket) => set({ activeTicket: ticket }),
      logout: () => set({ token: null, user: null, activeTicket: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
