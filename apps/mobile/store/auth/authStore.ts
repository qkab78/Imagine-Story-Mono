import { create } from "zustand";
import { MMKV } from 'react-native-mmkv';
import { getTokenSync, setSecureToken, deleteSecureToken } from '../../utils/secureTokenStorage';

const storage = new MMKV();

export type AuthUser = {
  id: string;
  fullname: string;
  email: string;
  firstname: string;
  lastname: string;
  role: number;
  avatar: string;
  isEmailVerified: boolean;
  createdAt: string;
};

const ROLE_PREMIUM = 3;

// Récupérer l'utilisateur persisté au démarrage
const getPersistedUser = (): AuthUser | undefined => {
  const userJson = storage.getString('user.data');
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      // Migration: si isEmailVerified n'existe pas, on considère l'utilisateur comme vérifié
      // (pour les utilisateurs existants avant cette feature)
      if (user.isEmailVerified === undefined) {
        user.isEmailVerified = true;
      }
      return user;
    } catch {
      return undefined;
    }
  }
  return undefined;
};

// Récupérer le token persisté au démarrage (sync pour l'hydratation initiale)
const getPersistedToken = (): string | undefined => {
  return getTokenSync();
};

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
  token: getPersistedToken(),
  user: getPersistedUser(),
  setToken: (token: string) => {
    set({ token });
    setSecureToken(token);
  },
  setUser: (user: AuthUser | undefined) => {
    set({ user });
    if (user) {
      storage.set('user.data', JSON.stringify(user));
    } else {
      storage.delete('user.data');
    }
  },
  clearAuth: () => {
    set({ token: undefined, user: undefined });
    deleteSecureToken();
    storage.delete('user.data');
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
    return get().user?.isEmailVerified === true;
  },
}));

export default useAuthStore;
