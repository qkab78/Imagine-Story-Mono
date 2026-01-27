import { useState, useCallback } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import ActionCard from '@/components/home/ActionCard';
import { QuotaExceededModal } from '@/components/organisms/creation/QuotaExceededModal';
import { QuotaBadge } from '@/components/molecules/creation/QuotaBadge';
import { SubscriptionSheet } from '@/components/organisms/profile/SubscriptionSheet';
import { useStoryQuota } from '@/hooks/useStoryQuota';
import { useSubscription } from '@/hooks/useSubscription';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface QuickActionsSectionProps {
  onCreateStory: () => void;
  onReadStories: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onCreateStory,
  onReadStories,
}) => {
  const { t } = useAppTranslation('stories');
  const { t: tProfile } = useAppTranslation('profile');
  const { t: tCommon } = useAppTranslation('common');
  const { canCreateStory, storiesCreatedThisMonth, limit, remaining, isUnlimited, resetDate, refreshQuota } = useStoryQuota();
  const {
    isSubscribed,
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
    willRenew,
    getFormattedPrice,
    getFormattedExpirationDate,
    purchase,
    restore,
    openManageSubscription,
  } = useSubscription();

  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [showSubscriptionSheet, setShowSubscriptionSheet] = useState(false);

  const handleCreateStory = useCallback(() => {
    if (!canCreateStory) {
      setShowQuotaModal(true);
      return;
    }
    onCreateStory();
  }, [canCreateStory, onCreateStory]);

  const handleUpgrade = useCallback(() => {
    setShowQuotaModal(false);
    setShowSubscriptionSheet(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowQuotaModal(false);
  }, []);

  const handlePurchase = useCallback(async () => {
    const success = await purchase();
    if (success) {
      await refreshQuota();
      Alert.alert(tProfile('alerts.upgradeSuccess'), tProfile('alerts.upgradeSuccessMessage'));
      setShowSubscriptionSheet(false);
    } else if (subscriptionError) {
      Alert.alert(tProfile('alerts.error'), subscriptionError);
    }
  }, [purchase, subscriptionError, refreshQuota, tProfile]);

  const handleRestore = useCallback(async () => {
    const success = await restore();
    if (success) {
      await refreshQuota();
      Alert.alert(tProfile('alerts.restoreSuccess'), tProfile('alerts.restoreSuccessMessage'));
      setShowSubscriptionSheet(false);
    } else {
      Alert.alert(tProfile('alerts.restoreNoItems'), tProfile('alerts.restoreNoItemsMessage'));
    }
  }, [restore, refreshQuota, tProfile]);

  const handleCancelSubscription = useCallback(() => {
    Alert.alert(
      tProfile('alerts.manageSubscriptionTitle'),
      tProfile('alerts.manageSubscriptionMessage'),
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
  }, [openManageSubscription, tProfile, tCommon]);

  return (
    <View style={styles.container}>
      <View style={styles.createCardContainer}>
        <ActionCard
          title={t('home.createStory')}
          description={t('home.createDescription')}
          icon="✨"
          iconGradient={['#F6C177', '#E8A957']}
          onPress={handleCreateStory}
          testID="create-story-card"
        />
        {!isUnlimited && (
          <View style={styles.quotaBadgeOverlay}>
            <QuotaBadge
              storiesCreatedThisMonth={storiesCreatedThisMonth}
              limit={limit}
              remaining={remaining}
              isUnlimited={isUnlimited}
              variant="inline"
            />
          </View>
        )}
      </View>
      <ActionCard
        title={t('home.readStory')}
        description={t('home.readDescription')}
        icon="📖"
        iconGradient={['#2F6B4F', '#7FB8A0']}
        onPress={onReadStories}
        testID="read-stories-card"
      />

      <QuotaExceededModal
        visible={showQuotaModal}
        onClose={handleCloseModal}
        onUpgrade={handleUpgrade}
        resetDate={resetDate}
        limit={limit}
      />

      <SubscriptionSheet
        visible={showSubscriptionSheet}
        onClose={() => setShowSubscriptionSheet(false)}
        isPremium={isSubscribed}
        price={getFormattedPrice()}
        nextPaymentDate={getFormattedExpirationDate() || undefined}
        willRenew={willRenew}
        isLoading={isSubscriptionLoading}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        onCancel={handleCancelSubscription}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  createCardContainer: {
    position: 'relative',
  },
  quotaBadgeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

export default QuickActionsSection;
