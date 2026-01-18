import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Alert } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { WelcomeHero } from '@/components/organisms/creation/WelcomeHero';
import { PrimaryButton } from '@/components/molecules/creation/PrimaryButton';
import { QuotaBadge } from '@/components/molecules/creation/QuotaBadge';
import { QuotaExceededModal } from '@/components/organisms/creation/QuotaExceededModal';
import { SubscriptionSheet } from '@/components/organisms/profile/SubscriptionSheet';
import { useStoryQuota } from '@/hooks/useStoryQuota';
import { useSubscription } from '@/hooks/useSubscription';
import { colors } from '@/theme/colors';

/**
 * WelcomeScreen - Template écran de bienvenue
 *
 * Premier écran du workflow de création d'histoire.
 * Présente le processus et permet de démarrer avec le bouton "Commencer".
 *
 * Route: /stories/creation/welcome
 */
export const WelcomeScreen: React.FC = () => {
  const router = useRouter();
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

  const handleStart = useCallback(() => {
    if (!canCreateStory) {
      setShowQuotaModal(true);
      return;
    }
    router.push('/stories/creation/hero-selection');
  }, [canCreateStory, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

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
    <LinearGradient
      colors={[colors.backgroundHome, colors.backgroundHomeEnd]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.content}>
        {/* Bouton retour */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Quota Badge */}
        <View style={styles.quotaBadgeContainer}>
          <QuotaBadge
            storiesCreatedThisMonth={storiesCreatedThisMonth}
            limit={limit}
            remaining={remaining}
            isUnlimited={isUnlimited}
          />
        </View>

        <WelcomeHero
          icon="✨"
          title="Créons une histoire magique"
          subtitle="Quelques questions pour personnaliser l'aventure de votre enfant"
          iconSize={120}
        />

        <View style={styles.footer}>
          <PrimaryButton
            title="Commencer"
            icon="→"
            onPress={handleStart}
          />
        </View>
      </View>

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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60, // Space for status bar
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 248, 241, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  backIcon: {
    fontSize: 24,
    color: colors.forestGreen,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  quotaBadgeContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginRight: 8,
  },
  footer: {
    marginTop: 'auto',
  },
});

export default WelcomeScreen;
