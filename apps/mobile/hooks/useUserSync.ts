import { useEffect } from 'react';
import useAuthStore from '@/store/auth/authStore';
import { authenticate } from '@/api/auth';
import { transformApiUserToAuthUser } from '@/utils/userTransform';

export function useUserSync() {
  const token = useAuthStore(state => state.token);
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    const syncUser = async () => {
      if (!token) return;

      try {
        const { user } = await authenticate(token);
        setUser(transformApiUserToAuthUser(user));
      } catch (error) {
        console.error('[useUserSync] Failed to sync user:', error);
      }
    };

    syncUser();
  }, [token, setUser]);
}
