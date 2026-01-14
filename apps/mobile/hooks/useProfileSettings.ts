import { useState, useEffect, useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';
import { MMKV } from 'react-native-mmkv';
import useAuthStore from '@/store/auth/authStore';
import { PROFILE_EXTERNAL_URLS } from '@/constants/profile';

const storage = new MMKV({ id: 'profile-settings' });

export const useProfileSettings = () => {
  const { user, setToken, setUser } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [appVersion, setAppVersion] = useState('1.0.0');

  useEffect(() => {
    const stored = storage.getBoolean('notifications_enabled');
    if (stored !== undefined) {
      setNotificationsEnabled(stored);
    }

    const version = Application.nativeApplicationVersion || '1.0.0';
    setAppVersion(version);
  }, []);

  const toggleNotifications = useCallback(async (value: boolean) => {
    setNotificationsEnabled(value);
    storage.set('notifications_enabled', value);

    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Notifications désactivées',
          'Activez les notifications dans les paramètres de votre appareil.',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Paramètres', onPress: () => Linking.openSettings() },
          ]
        );
        setNotificationsEnabled(false);
        storage.set('notifications_enabled', false);
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: () => {
            setToken('');
            setUser(undefined);
          },
        },
      ]
    );
  }, [setToken, setUser]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront définitivement supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Confirmation',
              'Tapez SUPPRIMER pour confirmer la suppression de votre compte.',
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Confirmer',
                  style: 'destructive',
                  onPress: (text: string | undefined) => {
                    if (text === 'SUPPRIMER') {
                      // TODO: Call API to delete account
                      setToken('');
                      setUser(undefined);
                    } else {
                      Alert.alert('Erreur', 'Le texte de confirmation ne correspond pas.');
                    }
                  },
                },
              ],
              'plain-text'
            );
          },
        },
      ]
    );
  }, [setToken, setUser]);

  const openHelp = useCallback(() => {
    Linking.openURL(PROFILE_EXTERNAL_URLS.help);
  }, []);

  const openAppStore = useCallback(() => {
    const url = Platform.select({
      ios: 'https://apps.apple.com/app/id...',
      android: 'https://play.google.com/store/apps/details?id=...',
    });
    if (url) {
      Linking.openURL(url);
    }
  }, []);

  const openTerms = useCallback(() => {
    Linking.openURL(PROFILE_EXTERNAL_URLS.terms);
  }, []);

  const openPrivacy = useCallback(() => {
    Linking.openURL(PROFILE_EXTERNAL_URLS.privacy);
  }, []);

  const isPremium = user?.role === 3;

  return {
    user,
    isPremium,
    notificationsEnabled,
    appVersion,
    toggleNotifications,
    handleLogout,
    handleDeleteAccount,
    openHelp,
    openAppStore,
    openTerms,
    openPrivacy,
  };
};

export default useProfileSettings;
