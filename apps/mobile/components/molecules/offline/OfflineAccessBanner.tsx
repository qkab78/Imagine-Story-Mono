import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { DualIcon } from '@/components/ui'
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile'
import type { OfflineAccessLevel } from '@/types/offline'

interface OfflineAccessBannerProps {
  accessLevel: OfflineAccessLevel
  message: string | null
  daysUntilDeletion: number | null
  onRenewPress: () => void
}

const getConfig = (level: OfflineAccessLevel) => {
  switch (level) {
    case 'grace':
      return {
        colors: PROFILE_COLORS.warningAlert,
        icon: { sfSymbol: 'exclamationmark.triangle.fill', lucide: 'AlertTriangle' } as const,
      }
    case 'locked':
      return {
        colors: PROFILE_COLORS.warningUrgent,
        icon: { sfSymbol: 'lock.fill', lucide: 'Lock' } as const,
      }
    case 'none':
      return {
        colors: PROFILE_COLORS.warningUrgent,
        icon: { sfSymbol: 'xmark.circle.fill', lucide: 'XCircle' } as const,
      }
    default:
      return null
  }
}

export const OfflineAccessBanner: React.FC<OfflineAccessBannerProps> = ({
  accessLevel,
  message,
  daysUntilDeletion,
  onRenewPress,
}) => {
  const config = getConfig(accessLevel)

  if (!config || !message) return null

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.colors.background,
          borderColor: config.colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <DualIcon
          icon={config.icon}
          size={20}
          color={config.colors.border}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.message, { color: config.colors.text }]}>
            {message}
          </Text>
          {daysUntilDeletion !== null && daysUntilDeletion > 0 && accessLevel === 'locked' && (
            <Text style={[styles.subMessage, { color: config.colors.text }]}>
              Renouveler pour conserver vos téléchargements
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onRenewPress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Renouveler</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: PROFILE_SPACING.md,
    gap: PROFILE_SPACING.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: PROFILE_SPACING.md,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
  },
  subMessage: {
    fontSize: 12,
    opacity: 0.8,
  },
  button: {
    backgroundColor: PROFILE_COLORS.primary,
    paddingVertical: PROFILE_SPACING.sm,
    paddingHorizontal: PROFILE_SPACING.lg,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: PROFILE_COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
})

export default OfflineAccessBanner
