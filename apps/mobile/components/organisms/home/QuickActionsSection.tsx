import { useState, useCallback } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import ActionCard from '@/components/home/ActionCard';
import { QuotaExceededModal } from '@/components/organisms/creation/QuotaExceededModal';
import { QuotaBadge } from '@/components/molecules/creation/QuotaBadge';
import { SubscriptionSheet } from '@/components/organisms/profile/SubscriptionSheet';
import { useStoryQuota } from '@/hooks/useStoryQuota';
import { useSubscription } from '@/hooks/useSubscription';

interface QuickActionsSectionProps {
  onCreateStory: () => void;
  onReadStories: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onCreateStory,
  onReadStories,
}) => {
  const { canCreateStory, storiesCreatedThisMonth, limit, remaining, isUnlimited, resetDate } = useStoryQuota();
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
      Alert.alert('Succès', 'Bienvenue dans la famille Premium ! Profitez de toutes les fonctionnalités.');
      setShowSubscriptionSheet(false);
    } else if (subscriptionError) {
      Alert.alert('Erreur', subscriptionError);
    }
  }, [purchase, subscriptionError]);

  const handleRestore = useCallback(async () => {
    const success = await restore();
    if (success) {
      Alert.alert('Succès', 'Vos achats ont été restaurés.');
      setShowSubscriptionSheet(false);
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

  return (
    <View style={styles.container}>
      <View style={styles.createCardContainer}>
        <ActionCard
          title="Créer une histoire"
          description="Invente une nouvelle aventure magique"
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
        title="Lire une histoire"
        description="Découvre tes histoires préférées"
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
