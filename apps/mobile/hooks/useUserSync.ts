import { useEffect } from 'react';
import useAuthStore from '@/store/auth/authStore';
import { authenticate } from '@/api/auth';

export function useUserSync() {
  const token = useAuthStore(state => state.token);
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    const syncUser = async () => {
      if (!token) return;

      try {
        const { user } = await authenticate(token);
        setUser({
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          fullname: user.fullname,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        });
      } catch (error) {
        console.error('[useUserSync] Failed to sync user:', error);
      }
    };

    syncUser();
  }, [token, setUser]);
}
