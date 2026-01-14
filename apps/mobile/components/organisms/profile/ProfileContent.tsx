import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_ICONS } from '@/constants/profile';

export const ProfileContent: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
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

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
  };

  const handlePremiumPress = () => {
    // TODO: Navigate to premium screen
  };

  const handlePersonalInfo = () => {
    // TODO: Navigate to personal info screen
  };

  const handleSubscription = () => {
    // TODO: Navigate to subscription screen
  };

  const handleLanguage = () => {
    // TODO: Navigate to language selection
  };

  return (
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
