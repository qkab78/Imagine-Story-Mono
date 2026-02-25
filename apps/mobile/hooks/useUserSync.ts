import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/auth/authStore';
import { authenticate } from '@/api/auth';
import { transformApiUserToAuthUser } from '@/utils/userTransform';

export function useUserSync() {
  const token = useAuthStore(state => state.token);
  const setUser = useAuthStore(state => state.setUser);

  const { data } = useQuery({
    queryKey: ['user', 'sync', token],
    queryFn: () => authenticate(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data?.user) {
      setUser(transformApiUserToAuthUser(data.user));
    }
  }, [data, setUser]);
}
