import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import useAuthStore from '@/store/auth/authStore';
import { resendVerificationEmail } from '@/api/auth';

/**
 * Hook qui gère l'état et la logique de la bannière de vérification email.
 */
export function useEmailVerificationBanner() {
  const { t } = useTranslation('auth');
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const isEmailVerified = useAuthStore(state => state.isEmailVerified);

  const [isDismissed, setIsDismissed] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const shouldShow = user && !isEmailVerified() && !isDismissed;

  const handleResend = async () => {
    if (!token) return;

    setIsResending(true);
    try {
      await resendVerificationEmail(token);
      Alert.alert(t('verification.resendSuccess'));
    } catch (error) {
      Alert.alert(t('verification.resendError'));
    } finally {
      setIsResending(false);
    }
  };

  const handleDismiss = () => setIsDismissed(true);

  return {
    shouldShow,
    isResending,
    handleResend,
    handleDismiss,
  };
}
