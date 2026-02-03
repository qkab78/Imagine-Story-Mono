import { AuthUser } from '@/store/auth/authStore';

type ApiUser = {
  id: string | number;
  email: string;
  firstname: string;
  lastname: string;
  fullname?: string;
  role: number;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
};

export function transformApiUserToAuthUser(user: ApiUser): AuthUser {
  return {
    id: String(user.id),
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    fullname: user.fullname || `${user.firstname} ${user.lastname}`.trim(),
    role: Number(user.role),
    avatar: user.avatar || '',
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
}
