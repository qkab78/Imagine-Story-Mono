import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { NotificationPermissionContent } from '@/components/organisms/notification';
import {
  setPermissionStatus,
  setPushToken,
  setNotificationOnboardingCompleted,
} from '@/store/notifications/notificationStorage';

export const NotificationPermissionScreen: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('[NotificationPermission] Screen mounted');
    checkExistingPermission();
  }, []);

  const checkExistingPermission = async () => {
    // Sur simulateur, on affiche quand même l'écran pour tester le design
    // mais on ne vérifie pas les permissions
    if (!Device.isDevice) {
      console.log('[NotificationPermission] Running on simulator, showing screen');
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    console.log('[NotificationPermission] Current permission status:', status);

    if (status === 'granted') {
      console.log('[NotificationPermission] Permission already granted, skipping');
      setNotificationOnboardingCompleted(true);
      navigateToLogin();
    }
  };

  const handleActivate = async () => {
    setIsLoading(true);
    console.log('[NotificationPermission] handleActivate called');

    try {
      // Sur simulateur, on simule juste l'activation
      if (!Device.isDevice) {
        console.log('[NotificationPermission] Simulator - simulating activation');
        setNotificationOnboardingCompleted(true);
        navigateToLogin();
        return;
      }

      const { status } = await Notifications.requestPermissionsAsync();
      console.log('[NotificationPermission] Permission request result:', status);
      setPermissionStatus(status);

      if (status === 'granted') {
        // Configurer les notifications
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2F6B4F',
        });

        // Récupérer le push token
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
        });
        setPushToken(tokenData.data);
        console.log('[NotificationPermission] Push token saved');
      }

      setNotificationOnboardingCompleted(true);
      navigateToLogin();
    } catch (error) {
      console.error('[NotificationPermission] Error:', error);
      setNotificationOnboardingCompleted(true);
      navigateToLogin();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setNotificationOnboardingCompleted(true);
    navigateToLogin();
  };

  const navigateToLogin = () => {
    router.replace('/login');
  };

  return (
    <NotificationPermissionContent
      onActivate={handleActivate}
      onSkip={handleSkip}
      isLoading={isLoading}
    />
  );
};

export default NotificationPermissionScreen;
