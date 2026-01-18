import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VersionBadge } from '@/components/atoms/profile';
import {
  ProfileHeaderCard,
  PremiumPromptCard,
  SettingsItem,
  SettingsToggleItem,
  LogoutButton,
  DeleteAccountButton,
} from '@/components/molecules/profile';
import { SettingsSection } from './SettingsSection';
import { PersonalInfoSheet } from './PersonalInfoSheet';
import { EditProfileSheet } from './EditProfileSheet';
import { SubscriptionSheet } from './SubscriptionSheet';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { useSubscription } from '@/hooks/useSubscription';
import { formatLongDate } from '@/utils/dateFormatter';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_ICONS } from '@/constants/profile';

export const ProfileContent: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    user,
    notificationsEnabled,
    appVersion,
    toggleNotifications,
    handleLogout,
    handleDeleteAccount,
    openHelp,
    openAppStore,
    openTerms,
    openPrivacy,
  } = useProfileSettings();

  const {
    isSubscribed,
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
    willRenew,
    getFormattedPrice,
    getFormattedExpirationDate,
    purchase,
    restore,
    refresh,
    openManageSubscription,
  } = useSubscription();

  // Sheet visibility states
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handlePremiumPress = () => {
    setShowSubscription(true);
  };

  const handlePersonalInfo = () => {
    setShowPersonalInfo(true);
  };

  const handleSubscription = useCallback(async () => {
    await refresh();
    setShowSubscription(true);
  }, [refresh]);

  const handleLanguage = () => {
    Alert.alert('Bientôt disponible', 'La sélection de langue sera disponible prochainement.');
  };

  const handleSaveProfile = (data: {
    currentPassword?: string;
    newPassword?: string;
  }) => {
    console.log('Save password:', data);
    Alert.alert('Succès', 'Votre mot de passe a été mis à jour.');
    setShowEditProfile(false);
  };

  const handleUpgrade = useCallback(async () => {
    const success = await purchase();
    if (success) {
      Alert.alert('Succès', 'Bienvenue dans la famille Premium ! Profitez de toutes les fonctionnalités.');
      setShowSubscription(false);
    } else if (subscriptionError) {
      Alert.alert('Erreur', subscriptionError);
    }
  }, [purchase, subscriptionError]);

  const handleRestore = useCallback(async () => {
    const success = await restore();
    if (success) {
      Alert.alert('Succès', 'Vos achats ont été restaurés.');
      setShowSubscription(false);
    } else {
      Alert.alert('Information', 'Aucun achat précédent trouvé.');
    }
  }, [restore]);

  const handleCancelSubscription = useCallback(() => {
    Alert.alert(
      'Gérer l\'abonnement',
      'Vous allez être redirigé vers les paramètres de votre store pour gérer ou résilier votre abonnement.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Continuer',
          onPress: async () => {
            await openManageSubscription();
          },
        },
      ]
    );
  }, [openManageSubscription]);

  // Refresh subscription status on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + PROFILE_SPACING.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeaderCard
          name={user?.fullname || 'Utilisateur'}
          avatarUrl={user?.avatar}
          onEditPress={handleEditProfile}
        />

        {/* Premium Card (non-premium users only) */}
        {!isSubscribed && (
          <View style={styles.premiumContainer}>
            <PremiumPromptCard onPress={handlePremiumPress} />
          </View>
        )}

        {/* Mon compte */}
        <SettingsSection title="Mon compte">
          <SettingsItem
            icon={PROFILE_ICONS.user}
            label="Informations personnelles"
            value={user?.email}
            onPress={handlePersonalInfo}
          />
          <View style={styles.separator} />
          <SettingsItem
            icon={PROFILE_ICONS.subscription}
            label="Abonnement"
            value={isSubscribed ? 'Premium' : 'Gratuit'}
            onPress={handleSubscription}
          />
        </SettingsSection>

        {/* Préférences */}
        <SettingsSection title="Préférences">
          <SettingsToggleItem
            icon={PROFILE_ICONS.notifications}
            label="Notifications"
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
          <View style={styles.separator} />
          <SettingsItem
            icon={PROFILE_ICONS.language}
            label="Langue"
            value="Français"
            onPress={handleLanguage}
          />
        </SettingsSection>

        {/* Support & À propos */}
        <SettingsSection title="Support & À propos">
          <SettingsItem
            icon={PROFILE_ICONS.help}
            label="Aide & Support"
            onPress={openHelp}
          />
          <View style={styles.separator} />
          <SettingsItem
            icon={PROFILE_ICONS.rating}
            label="Donner mon avis"
            onPress={openAppStore}
          />
          <View style={styles.separator} />
          <SettingsItem
            icon={PROFILE_ICONS.terms}
            label="Conditions d'utilisation"
            onPress={openTerms}
          />
          <View style={styles.separator} />
          <SettingsItem
            icon={PROFILE_ICONS.privacy}
            label="Confidentialité"
            onPress={openPrivacy}
          />
        </SettingsSection>

        {/* Zone Danger */}
        <View style={styles.dangerZone}>
          <LogoutButton onPress={handleLogout} />
          <DeleteAccountButton onPress={handleDeleteAccount} />
        </View>

        {/* Version */}
        <VersionBadge version={appVersion} />
      </ScrollView>

      {/* Sheets */}
      <PersonalInfoSheet
        visible={showPersonalInfo}
        onClose={() => setShowPersonalInfo(false)}
        name={user?.fullname || 'Utilisateur'}
        email={user?.email || 'N/A'}
        registrationDate={formatLongDate(user?.createdAt)}
        storiesCount={12}
      />

      <EditProfileSheet
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        initialEmail={user?.email || ''}
        onSave={handleSaveProfile}
      />

      <SubscriptionSheet
        visible={showSubscription}
        onClose={() => setShowSubscription(false)}
        isPremium={isSubscribed}
        price={getFormattedPrice()}
        nextPaymentDate={getFormattedExpirationDate() || undefined}
        willRenew={willRenew}
        isLoading={isSubscriptionLoading}
        onPurchase={handleUpgrade}
        onRestore={handleRestore}
        onCancel={handleCancelSubscription}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: PROFILE_SPACING.xxl,
  },
  premiumContainer: {
    marginTop: PROFILE_SPACING.lg,
    marginBottom: PROFILE_SPACING.lg,
  },
  separator: {
    height: 1,
    backgroundColor: PROFILE_COLORS.separator,
    marginHorizontal: PROFILE_SPACING.lg,
  },
  dangerZone: {
    marginTop: PROFILE_SPACING.lg,
    gap: PROFILE_SPACING.sm,
  },
});

export default ProfileContent;
