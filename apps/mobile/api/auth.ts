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
  isEmailVerified: boolean,
  createdAt: string,
  currentAccessToken: { token: string }
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

export class NetworkError extends Error {
  constructor() {
    super('Network request failed');
    this.name = 'NetworkError';
  }
}

export const authenticate = async (token: string) => {
  let response: Response;
  try {
    response = await fetch(authenticateUrl, {
      headers: {
        'Authorization': token,
      },
    });
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  const result: { user: UserInfo } = await response.json();

  return result;
};

// Email verification
const resendVerificationUrl = `${apiUrl}/auth/resend-verification`;

export const resendVerificationEmail = async (token: string): Promise<{ message: string }> => {
  const response = await fetch(resendVerificationUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to resend verification email');
  }

  return response.json();
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

// Apple OAuth
type AppleAuthPayload = {
  identityToken: string;
  fullName?: { firstName?: string | null; lastName?: string | null } | null;
  email?: string | null;
};

type AppleAuthResponse = { token: string; user: UserInfo; isNewUser: boolean };

const appleAuthUrl = `${apiUrl}/auth/apple/callback`;

export const authenticateWithApple = async (payload: AppleAuthPayload): Promise<AppleAuthResponse> => {
  const response = await fetch(appleAuthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Échec de l'authentification Apple");
  }

  return response.json();
};

// Password reset
const forgotPasswordUrl = `${apiUrl}/auth/forgot-password`;

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await fetch(forgotPasswordUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to send reset email');
  }

  return response.json();
};

export type { GoogleAuthResponse, AppleAuthResponse };
