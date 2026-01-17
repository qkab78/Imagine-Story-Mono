import { create } from "zustand";
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export type AuthUser = {
  fullname: string;
  email: string;
  firstname: string;
  lastname: string;
  role: number;
};

export type AuthStore = {
  token: string | undefined;
  user: AuthUser | undefined;
  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  getFirstname: () => string;
  getInitials: () => string;
};

const useAuthStore = create<AuthStore>((set, get) => ({
  token: undefined,
  user: undefined,
  setToken: (token: string) => {
    set({ token });
    storage.set('user.token', token);
  },
  setUser: (user: AuthUser) => set({ user }),
  clearAuth: () => {
    set({ token: undefined, user: undefined });
    storage.delete('user.token');
  },
  getFirstname: () => {
    return get().user?.fullname.split(' ')[0] || '';
  },
  getInitials: () => {
    const [firstname, ...lastnameParts] = get().user?.fullname.split(' ') || [];
    const lastname = lastnameParts.join(' ');
    return firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();
  },
}));

export default useAuthStore;