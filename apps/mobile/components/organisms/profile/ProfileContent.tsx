import { useEffect, useState } from 'react';
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
  LanguageSelector,
} from '@/components/molecules/profile';
import { SettingsSection } from './SettingsSection';
import { PersonalInfoSheet } from './PersonalInfoSheet';
import { EditProfileSheet } from './EditProfileSheet';
import { SubscriptionSheet } from './SubscriptionSheet';
import { DownloadsSheet } from './DownloadsSheet';
import { StoryTimePickerSheet } from './StoryTimePickerSheet';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { useSubscription } from '@/hooks/useSubscription';
import { useStoryTimeSettings } from '@/hooks/useStoryTimeSettings';
import { useUserStories } from '@/features/stories/hooks/useStoryList';
import { formatLongDate } from '@/utils/dateFormatter';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_ICONS } from '@/constants/profile';

/**
 * Labels des langues pour l'affichage
 */
const LANGUAGE_DISPLAY: Record<string, string> = {
  fr: 'Francais',
  en: 'English',
};

export const ProfileContent: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { t, language } = useAppTranslation('profile');
  const { t: tCommon } = useAppTranslation('common');

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
    willRenew,
    getFormattedPrice,
    getFormattedExpirationDate,
    purchase,
    restore,
    refresh,
    openManageSubscription,
  } = useSubscription();

  const { data: userStories = [] } = useUserStories();

  const {
    hour: storyTimeHour,
    minute: storyTimeMinute,
    enabled: storyTimeEnabled,
    formattedTime: storyTimeFormatted,
    updateTime: updateStoryTime,
    toggleEnabled: toggleStoryTime,
  } = useStoryTimeSettings();

  // Sheet visibility states
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showStoryTimePicker, setShowStoryTimePicker] = useState(false);

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handlePremiumPress = () => {
    setShowSubscription(true);
  };

  const handlePersonalInfo = () => {
    setShowPersonalInfo(true);
  };

  const handleSubscription = async () => {
    await refresh();
    setShowSubscription(true);
  };

  const handleLanguage = () => {
    setShowLanguageSelector(true);
  };

  const handleDownloads = () => {
    setShowDownloads(true);
  };

  const handleSaveProfile = (data: {
    currentPassword?: string;
    newPassword?: string;
  }) => {
    console.log('Save password:', data);
    Alert.alert(t('alerts.passwordUpdated'), t('alerts.passwordUpdatedMessage'));
    setShowEditProfile(false);
  };

  const handleUpgrade = async () => {
    const result = await purchase();
    if (result.success) {
      Alert.alert(t('alerts.upgradeSuccess'), t('alerts.upgradeSuccessMessage'));
      setShowSubscription(false);
    } else if (result.error) {
      Alert.alert(t('alerts.error'), result.error);
    }
  };

  const handleRestore = async () => {
    const success = await restore();
    if (success) {
      Alert.alert(t('alerts.restoreSuccess'), t('alerts.restoreSuccessMessage'));
      setShowSubscription(false);
    } else {
      Alert.alert(t('alerts.restoreNoItems'), t('alerts.restoreNoItemsMessage'));
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      t('alerts.manageSubscriptionTitle'),
      t('alerts.manageSubscriptionMessage'),
      [
        { text: tCommon('buttons.cancel'), style: 'cancel' },
        {
          text: tCommon('buttons.continue'),
          onPress: async () => {
            await openManageSubscription();
          },
        },
      ]
    );
  };

  // Refresh subscription status on mount
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          name={user?.fullname || t('defaultUser')}
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
        <SettingsSection title={t('sections.account')}>
          <SettingsItem
            icon={PROFILE_ICONS.user}
            label={t('settings.personalInfo')}
            value={user?.email}
            onPress={handlePersonalInfo}
          />
          <View style={styles.separator} />
          <SettingsItem
            icon={PROFILE_ICONS.subscription}
            label={t('settings.subscription')}
            value={isSubscribed ? tCommon('labels.premium') : tCommon('labels.free')}
            onPress={handleSubscription}
          />
          {isSubscribed && (
            <>
              <View style={styles.separator} />
              <SettingsItem
                icon={{ sfSymbol: 'arrow.down.circle', lucide: 'Download' }}
                label={t('settings.downloads')}
                onPress={handleDownloads}
              />
            </>
          )}
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title={t('sections.preferences')}>
          <SettingsToggleItem
            icon={PROFILE_ICONS.notifications}
            label={t('settings.notifications')}
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
          <View style={styles.separator} />
          <SettingsToggleItem
            icon={{ sfSymbol: 'moon.stars', lucide: 'Moon' }}
            label={t('settings.storyTime')}
            value={storyTimeEnabled}
            onValueChange={toggleStoryTime}
          />
          {storyTimeEnabled && (
            <>
              <View style={styles.separator} />
              <SettingsItem
                icon={{ sfSymbol: 'clock.fill', lucide: 'Clock' }}
                label={t('settings.storyTimeHour')}
                value={storyTimeFormatted}
                onPress={() => setShowStoryTimePicker(true)}
              />
            </>
          )}
          <View style={styles.separator} />
          <SettingsItem
            icon={PROFILE_ICONS.language}
            label={t('settings.language')}
            value={LANGUAGE_DISPLAY[language] || language}
            onPress={handleLanguage}
          />
        </SettingsSection>

        {/* Support & About */}
        <SettingsSection title={t('sections.support')}>
          <SettingsItem
            icon={PROFILE_ICONS.help}
            label={t('settings.help')}
            onPress={openHelp}
          />
          <View style={styles.separator} />
          <SettingsItem
            icon={PROFILE_ICONS.rating}
            label={t('settings.rating')}
            onPress={openAppStore}
          />
          <View style={styles.separator} />
          <SettingsItem
            icon={PROFILE_ICONS.terms}
            label={t('settings.terms')}
            onPress={openTerms}
          />
          <View style={styles.separator} />
          <SettingsItem
            icon={PROFILE_ICONS.privacy}
            label={t('settings.privacy')}
            onPress={openPrivacy}
          />
        </SettingsSection>

        {/* Danger Zone */}
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
        name={user?.fullname || t('defaultUser')}
        email={user?.email || 'N/A'}
        registrationDate={formatLongDate(user?.createdAt)}
        storiesCount={userStories.length}
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

      <DownloadsSheet
        visible={showDownloads}
        onClose={() => setShowDownloads(false)}
      />

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />

      <StoryTimePickerSheet
        visible={showStoryTimePicker}
        onClose={() => setShowStoryTimePicker(false)}
        hour={storyTimeHour}
        minute={storyTimeMinute}
        onSave={updateStoryTime}
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
