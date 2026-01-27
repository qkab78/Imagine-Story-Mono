import { View, Text, StyleSheet } from 'react-native'
import { DualIcon } from '@/components/ui'
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile'

interface StorageUsageBarProps {
  usedCount: number
  maxCount: number
  usedStorage: string
}

export const StorageUsageBar: React.FC<StorageUsageBarProps> = ({
  usedCount,
  maxCount,
  usedStorage,
}) => {
  const percentage = maxCount > 0 ? (usedCount / maxCount) * 100 : 0
  const isNearLimit = percentage >= 80
  const isFull = usedCount >= maxCount

  const getBarColor = () => {
    if (isFull) return PROFILE_COLORS.danger
    if (isNearLimit) return PROFILE_COLORS.warningAlert.border
    return PROFILE_COLORS.primary
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <DualIcon
            icon={{ sfSymbol: 'internaldrive.fill', lucide: 'HardDrive' }}
            size={16}
            color={PROFILE_COLORS.iconColor}
          />
          <Text style={styles.title}>Stockage</Text>
        </View>
        <Text style={styles.storageText}>{usedStorage}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: `${Math.min(100, percentage)}%`,
                backgroundColor: getBarColor(),
              },
            ]}
          />
        </View>
        <Text style={[styles.countText, isFull && styles.countTextFull]}>
          {usedCount}/{maxCount}
        </Text>
      </View>

      {isFull && (
        <Text style={styles.limitText}>
          Limite atteinte. Supprimez des histoires pour en télécharger d'autres.
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: 12,
    padding: PROFILE_SPACING.lg,
    gap: PROFILE_SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PROFILE_SPACING.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: PROFILE_COLORS.textPrimary,
  },
  storageText: {
    fontSize: 13,
    color: PROFILE_COLORS.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PROFILE_SPACING.md,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: PROFILE_COLORS.inputBackground,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: PROFILE_COLORS.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
  countTextFull: {
    color: PROFILE_COLORS.danger,
  },
  limitText: {
    fontSize: 12,
    color: PROFILE_COLORS.danger,
    fontWeight: '500',
  },
})

export default StorageUsageBar
