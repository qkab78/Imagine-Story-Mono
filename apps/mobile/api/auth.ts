import { Users } from '@imagine-story/api/types/db';

export interface LoginFormData { email: string, password: string }
type LoginResponse = { token: string, user: { id: string, email: string, fullname: string, role: number, avatar: string } }

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const loginUrl = `${apiUrl}/auth/login`;
const logoutUrl = `${apiUrl}/auth/logout`;
const authenticateUrl = `${apiUrl}/auth/authenticate`;

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
