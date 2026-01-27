import React, { useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { useOfflineLibrary } from '@/hooks/useOfflineLibrary'
import { useOfflineAccess } from '@/hooks/useOfflineAccess'
import { useSubscriptionSheet } from '@/hooks/useSubscriptionSheet'
import {
  OfflineStoryCard,
  StorageUsageBar,
  OfflineAccessBanner,
} from '@/components/molecules/offline'
import { SubscriptionSheet } from '@/components/organisms/profile'
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile'
import type { OfflineStory } from '@/types/offline'

const DownloadsScreen: React.FC = () => {
  const router = useRouter()
  const subscriptionSheet = useSubscriptionSheet()

  const {
    stories,
    downloadedCount,
    maxStories,
    usedStorage,
    isLoading,
    removeStory,
    removeAll,
    refresh,
  } = useOfflineLibrary()

  const {
    accessLevel,
    accessMessage,
    daysUntilDeletion,
    canRead,
  } = useOfflineAccess()

  const handleBackPress = useCallback(() => {
    router.back()
  }, [router])

  const handleStoryPress = useCallback((story: OfflineStory) => {
    if (!canRead) {
      Alert.alert(
        'Accès restreint',
        'Renouvelez votre abonnement pour accéder à vos contenus hors ligne.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Renouveler', onPress: () => subscriptionSheet.open() },
        ]
      )
      return
    }
    router.push(`/stories/${story.id}/reader?offline=true`)
  }, [router, canRead, subscriptionSheet])

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
    )
  }, [removeStory])

  const handleDeleteAll = useCallback(() => {
    if (stories.length === 0) return

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
    )
  }, [stories.length, removeAll])

  const renderItem = useCallback(({ item }: { item: OfflineStory }) => (
    <OfflineStoryCard
      story={item}
      accessLevel={accessLevel}
      onPress={() => handleStoryPress(item)}
      onDelete={() => handleDeleteStory(item)}
    />
  ), [accessLevel, handleStoryPress, handleDeleteStory])

  const renderHeader = useCallback(() => (
    <View style={styles.headerSection}>
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
    </View>
  ), [
    accessLevel,
    accessMessage,
    daysUntilDeletion,
    downloadedCount,
    maxStories,
    usedStorage,
    stories.length,
    handleDeleteAll,
    subscriptionSheet,
  ])

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="cloud-download-outline" size={64} color={PROFILE_COLORS.textMuted} />
      <Text style={styles.emptyTitle}>Aucun téléchargement</Text>
      <Text style={styles.emptyDescription}>
        Téléchargez des histoires pour les lire sans connexion internet.
      </Text>
    </View>
  ), [])

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[PROFILE_COLORS.backgroundTop, PROFILE_COLORS.backgroundBottom]}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={PROFILE_COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Mes téléchargements</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <FlashList
          data={stories}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PROFILE_COLORS.backgroundTop,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PROFILE_SPACING.lg,
    paddingVertical: PROFILE_SPACING.md,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: PROFILE_COLORS.textPrimary,
    textAlign: 'center',
    marginHorizontal: PROFILE_SPACING.md,
  },
  headerSpacer: {
    width: 44,
  },
  listContent: {
    padding: PROFILE_SPACING.lg,
  },
  headerSection: {
    gap: PROFILE_SPACING.lg,
    marginBottom: PROFILE_SPACING.xl,
  },
  separator: {
    height: PROFILE_SPACING.md,
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
})

export default DownloadsScreen
