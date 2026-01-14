import { useState } from 'react';
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
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_ICONS } from '@/constants/profile';

export const ProfileContent: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
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
  } = useProfileSettings();

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

  const handleSubscription = () => {
    setShowSubscription(true);
  };

  const handleLanguage = () => {
    // TODO: Navigate to language selection
    Alert.alert('Bientôt disponible', 'La sélection de langue sera disponible prochainement.');
  };

  const handleSaveProfile = (data: {
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    // TODO: Call API to update profile
    console.log('Save profile:', data);
    Alert.alert('Succès', 'Vos informations ont été mises à jour.');
    setShowEditProfile(false);
  };

  const handleUpgrade = (plan: 'monthly' | 'yearly') => {
    // TODO: Implement in-app purchase
    console.log('Upgrade to:', plan);
    Alert.alert('Bientôt disponible', "L'achat in-app sera disponible prochainement.");
  };

  const handleChangePlan = () => {
    // TODO: Navigate to plan change screen
    Alert.alert('Bientôt disponible', 'Le changement de formule sera disponible prochainement.');
  };

  const handleCancelSubscription = () => {
    // TODO: Call API to cancel subscription
    console.log('Cancel subscription');
    Alert.alert('Abonnement résilié', 'Votre abonnement a été résilié.');
    setShowSubscription(false);
  };

  // Format registration date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

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
        {!isPremium && (
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
            value={isPremium ? 'Premium' : 'Gratuit'}
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
        registrationDate={formatDate(undefined)}
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
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChangePlan={handleChangePlan}
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
