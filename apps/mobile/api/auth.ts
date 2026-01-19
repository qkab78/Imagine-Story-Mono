import { Users } from '@imagine-story/api/types/db';

export interface LoginFormData { email: string, password: string }
export interface RegisterFormData { email: string, password: string, firstname: string, lastname: string }

type UserInfo = { 
  id: string, 
  email: string, 
  firstname: string, 
  lastname: string, 
  fullname: string, 
  role: number, 
  avatar: string,
  createdAt: string 
}

type RegisterResponse = { token: string, user: UserInfo }
type LoginResponse = { token: string, user: UserInfo }
type GoogleRedirectResponse = { redirectUrl: string }
type GoogleAuthResponse = { token: string, user: UserInfo, isNewUser: boolean }

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const loginUrl = `${apiUrl}/auth/login`;
const logoutUrl = `${apiUrl}/auth/logout`;
const authenticateUrl = `${apiUrl}/auth/authenticate`;
const registerUrl = `${apiUrl}/auth/register`;

export const register = async (payload: RegisterFormData) => {
  const response = await fetch(registerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result: RegisterResponse = await response.json();

  return result;
};

export const login = async (payload: LoginFormData) => {
  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result: LoginResponse = await response.json();

  return result;
};

export const logout = async (token: string) => {
  return fetch(logoutUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  });
};

export const authenticate = async (token: string) => {
  const response = await fetch(authenticateUrl, {
    headers: {
      'Authorization': token,
    },
  });

  const result: { user: Users & { currentAccessToken: { token: string } } } = await response.json();

  return result;
};

// Google OAuth
const googleRedirectUrl = `${apiUrl}/auth/google/redirect`;

export const getGoogleRedirectUrl = async (mobileCallbackUrl: string): Promise<GoogleRedirectResponse> => {
  const response = await fetch(googleRedirectUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ callbackUrl: mobileCallbackUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Impossible de récupérer l\'URL de redirection Google');
  }

  return response.json();
};

export type { GoogleAuthResponse };
