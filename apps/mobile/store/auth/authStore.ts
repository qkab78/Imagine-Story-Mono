import { create } from "zustand";
import { login as apiLogin, register as apiRegister, LoginFormData } from "@/api/auth";
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export type AuthStore = {
  token: string | undefined;
  user: {
    id: string;
    email: string;
    fullname: string;
    avatar: string;
    role: number;
    favoriteStories?: string[];
    createdAt?: string;
  } | undefined;
  setToken: (token: string) => void;
  setUser: (user: AuthStore["user"]) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { fullname: string; email: string; password: string }) => Promise<void>;
  getFirstname: () => string;
  getInitials: () => string;
};

const useAuthStore = create<AuthStore>((set, get) => ({
  token: undefined,
  user: undefined,
  setToken: (token: string) => set({ token }),
  setUser: (user: AuthStore["user"]) => set({ user }),

  login: async (email: string, password: string) => {
    const response = await apiLogin({ email, password });

    if (!response.token) {
      throw new Error('Identifiants invalides');
    }

    set({ token: response.token, user: response.user });
    storage.set('user.token', response.token);
  },

  register: async (data: { fullname: string; email: string; password: string }) => {
    const [firstname, ...lastnameParts] = data.fullname.split(' ');
    const lastname = lastnameParts.join(' ');

    const response = await apiRegister({
      email: data.email,
      password: data.password,
      firstname,
      lastname,
    });

    if (!response.token) {
      throw new Error('Erreur lors de la création du compte');
    }

    set({ token: response.token, user: response.user });
    storage.set('user.token', response.token);
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