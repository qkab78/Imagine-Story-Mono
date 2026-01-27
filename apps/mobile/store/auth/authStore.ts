import { create } from "zustand";
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export type AuthUser = {
  id: string;
  fullname: string;
  email: string;
  firstname: string;
  lastname: string;
  role: number;
  avatar: string;
  emailVerifiedAt: string | null;
  createdAt: string;
};

const ROLE_PREMIUM = 3;

export type AuthStore = {
  token: string | undefined;
  user: AuthUser | undefined;
  setToken: (token: string) => void;
  setUser: (user: AuthUser | undefined) => void;
  clearAuth: () => void;
  getFirstname: () => string;
  getInitials: () => string;
  isPremium: () => boolean;
  isEmailVerified: () => boolean;
};

const useAuthStore = create<AuthStore>((set, get) => ({
  token: undefined,
  user: undefined,
  setToken: (token: string) => {
    set({ token });
    storage.set('user.token', token);
  },
  setUser: (user: AuthUser | undefined) => set({ user }),
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
  isPremium: () => {
    return get().user?.role === ROLE_PREMIUM;
  },
  isEmailVerified: () => {
    return get().user?.emailVerifiedAt !== null && get().user?.emailVerifiedAt !== undefined;
  },
}));

export default useAuthStore;