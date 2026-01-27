import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { DualIcon } from '@/components/ui'
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS } from '@/constants/profile'
import { OfflineIndicator } from './OfflineIndicator'
import type { OfflineStory, OfflineAccessLevel } from '@/types/offline'
import { formatRelativeDate } from '@/utils/date'
import { offlineStorageService } from '@/services/offline'

interface OfflineStoryCardProps {
  story: OfflineStory
  accessLevel: OfflineAccessLevel
  onPress: () => void
  onDelete: () => void
}

export const OfflineStoryCard: React.FC<OfflineStoryCardProps> = ({
  story,
  accessLevel,
  onPress,
  onDelete,
}) => {
  const isLocked = accessLevel === 'locked' || accessLevel === 'none'
  const downloadedDate = new Date(story.downloadedAt)
  const fileSize = offlineStorageService.formatSize(story.sizeInBytes)

  return (
    <TouchableOpacity
      style={[styles.container, isLocked && styles.containerLocked]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.7}
    >
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        {story.coverImagePath ? (
          <Image
            source={{ uri: story.coverImagePath }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <DualIcon
              icon={{ sfSymbol: 'book.closed.fill', lucide: 'BookOpen' }}
              size={24}
              color={PROFILE_COLORS.textMuted}
            />
          </View>
        )}
        {isLocked && (
          <View style={styles.lockOverlay}>
            <DualIcon
              icon={{ sfSymbol: 'lock.fill', lucide: 'Lock' }}
              size={20}
              color={PROFILE_COLORS.surface}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, isLocked && styles.textLocked]} numberOfLines={2}>
            {story.title}
          </Text>
          <OfflineIndicator variant="inline" showLabel={false} />
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            Téléchargé {formatRelativeDate(downloadedDate)}
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{fileSize}</Text>
        </View>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <DualIcon
          icon={{ sfSymbol: 'trash', lucide: 'Trash2' }}
          size={18}
          color={PROFILE_COLORS.danger}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: PROFILE_DIMENSIONS.cardBorderRadius,
    padding: PROFILE_SPACING.md,
    gap: PROFILE_SPACING.md,
  },
  containerLocked: {
    opacity: 0.6,
  },
  coverContainer: {
    width: 60,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: PROFILE_COLORS.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: PROFILE_SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: PROFILE_SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: PROFILE_COLORS.textPrimary,
  },
  textLocked: {
    color: PROFILE_COLORS.textMuted,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PROFILE_SPACING.xs,
  },
  metaText: {
    fontSize: 12,
    color: PROFILE_COLORS.textSecondary,
  },
  metaDot: {
    fontSize: 12,
    color: PROFILE_COLORS.textMuted,
  },
  deleteButton: {
    alignSelf: 'center',
    padding: PROFILE_SPACING.sm,
  },
})

export default OfflineStoryCard
