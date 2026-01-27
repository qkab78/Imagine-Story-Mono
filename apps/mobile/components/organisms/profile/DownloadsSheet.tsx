import React, { useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { SheetHeader } from '@/components/atoms/profile';
import { useOfflineLibrary } from '@/hooks/useOfflineLibrary';
import { useOfflineAccess } from '@/hooks/useOfflineAccess';
import { useSubscriptionSheet } from '@/hooks/useSubscriptionSheet';
import {
  OfflineStoryCard,
  StorageUsageBar,
  OfflineAccessBanner,
} from '@/components/molecules/offline';
import { SubscriptionSheet } from './SubscriptionSheet';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS } from '@/constants/profile';
import type { OfflineStory } from '@/types/offline';

interface DownloadsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const DownloadsSheet: React.FC<DownloadsSheetProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const subscriptionSheet = useSubscriptionSheet();

  const {
    stories,
    downloadedCount,
    maxStories,
    usedStorage,
    removeStory,
    removeAll,
  } = useOfflineLibrary();

  const {
    accessLevel,
    accessMessage,
    daysUntilDeletion,
    canRead,
  } = useOfflineAccess();

  const handleStoryPress = useCallback((story: OfflineStory) => {
    if (!canRead) {
      Alert.alert(
        'Accès restreint',
        'Renouvelez votre abonnement pour accéder à vos contenus hors ligne.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Renouveler', onPress: () => subscriptionSheet.open() },
        ]
      );
      return;
    }
    // Close sheet and navigate to reader
    onClose();
    router.push(`/stories/${story.id}/reader?offline=true`);
  }, [router, canRead, subscriptionSheet, onClose]);

  const handleDeleteStory = useCallback((story: OfflineStory) => {
    Alert.alert(
      'Supprimer le téléchargement',
      `Voulez-vous supprimer "${story.title}" de vos téléchargements ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => removeStory(story.id),
        },
      ]
    );
  }, [removeStory]);

  const handleDeleteAll = useCallback(() => {
    if (stories.length === 0) return;

    Alert.alert(
      'Supprimer tous les téléchargements',
      'Voulez-vous supprimer toutes les histoires téléchargées ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Tout supprimer',
          style: 'destructive',
          onPress: removeAll,
        },
      ]
    );
  }, [stories.length, removeAll]);

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cloud-download-outline" size={64} color={PROFILE_COLORS.textMuted} />
      <Text style={styles.emptyTitle}>Aucun téléchargement</Text>
      <Text style={styles.emptyDescription}>
        Téléchargez des histoires pour les lire sans connexion internet.
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[PROFILE_COLORS.backgroundTop, PROFILE_COLORS.backgroundBottom]}
        style={styles.container}
      >
        <View style={{ paddingTop: insets.top }}>
          <SheetHeader title="Mes téléchargements" onBack={onClose} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + PROFILE_SPACING.xxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Access Banner */}
          {accessLevel !== 'full' && (
            <OfflineAccessBanner
              accessLevel={accessLevel}
              message={accessMessage}
              daysUntilDeletion={daysUntilDeletion}
              onRenewPress={subscriptionSheet.open}
            />
          )}

          {/* Storage Usage */}
          <StorageUsageBar
            usedCount={downloadedCount}
            maxCount={maxStories}
            usedStorage={usedStorage}
          />

          {/* Delete All Button */}
          {stories.length > 0 && (
            <TouchableOpacity
              style={styles.deleteAllButton}
              onPress={handleDeleteAll}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteAllText}>Tout supprimer</Text>
            </TouchableOpacity>
          )}

          {/* Stories List */}
          {stories.length === 0 ? (
            renderEmpty()
          ) : (
            <View style={styles.storiesList}>
              {stories.map((story) => (
                <OfflineStoryCard
                  key={story.id}
                  story={story}
                  accessLevel={accessLevel}
                  onPress={() => handleStoryPress(story)}
                  onDelete={() => handleDeleteStory(story)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Subscription Sheet */}
      <SubscriptionSheet
        visible={subscriptionSheet.visible}
        onClose={subscriptionSheet.close}
        isPremium={subscriptionSheet.isSubscribed}
        isLoading={subscriptionSheet.isLoading}
        willRenew={subscriptionSheet.willRenew}
        price={subscriptionSheet.price}
        nextPaymentDate={subscriptionSheet.nextPaymentDate}
        onPurchase={subscriptionSheet.handlePurchase}
        onRestore={subscriptionSheet.handleRestore}
        onCancel={subscriptionSheet.handleCancel}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: PROFILE_SPACING.xl,
    gap: PROFILE_SPACING.lg,
  },
  storiesList: {
    gap: PROFILE_SPACING.md,
  },
  deleteAllButton: {
    alignSelf: 'flex-end',
  },
  deleteAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: PROFILE_COLORS.danger,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: PROFILE_SPACING.xxxl * 2,
    gap: PROFILE_SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PROFILE_COLORS.textPrimary,
  },
  emptyDescription: {
    fontSize: 14,
    color: PROFILE_COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: PROFILE_SPACING.xl,
  },
});

export default DownloadsSheet;
