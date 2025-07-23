import { create } from "zustand";

export type AuthStore = {
  token: string | undefined;
  user: {
    id: string;
    email: string;
    fullname: string;
    avatar: string;
    role: number;
  } | undefined;
  setToken: (token: string) => void;
  setUser: (user: AuthStore["user"]) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  token: undefined,
  user: undefined,
  setToken: (token: string) => set({ token }),
  setUser: (user: AuthStore["user"]) => set({ user }),
}));

export default useAuthStore;