import { Stories } from '@imagine-story/api/types/db';

export interface LoginFormData { email: string, password: string }
type LoginResponse = { token: string, user: { id: number, email: string, fullname: string, role: number, avatar: string } }

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const loginUrl = `${apiUrl}/auth/login`;


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
