import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/auth/authStore';
import { authenticate } from '@/api/auth';
import { transformApiUserToAuthUser } from '@/utils/userTransform';
import { getPushToken } from '@/store/notifications/notificationStorage';
import { registerPushToken } from '@/api/notifications';

export function useUserSync() {
  const token = useAuthStore(state => state.token);
  const setUser = useAuthStore(state => state.setUser);
  const pushTokenSentRef = useRef(false);

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

  // Send push token to backend once after sync
  useEffect(() => {
    if (!token || !data?.user || pushTokenSentRef.current) return;

    const pushToken = getPushToken();
    if (pushToken) {
      pushTokenSentRef.current = true;
      registerPushToken(token, pushToken).catch((error) => {
        console.error('[useUserSync] Failed to register push token:', error);
        pushTokenSentRef.current = false;
      });
    }
  }, [token, data]);
}
