import { View, Text, StyleSheet } from 'react-native'
import { DualIcon } from '@/components/ui'
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile'

interface OfflineIndicatorProps {
  variant?: 'badge' | 'inline'
  showLabel?: boolean
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  variant = 'badge',
  showLabel = true,
}) => {
  if (variant === 'inline') {
    return (
      <View style={styles.inlineContainer}>
        <DualIcon
          icon={{ sfSymbol: 'arrow.down.circle.fill', lucide: 'Download' }}
          size={14}
          color={PROFILE_COLORS.primary}
        />
        {showLabel && <Text style={styles.inlineText}>Hors ligne</Text>}
      </View>
    )
  }

  return (
    <View style={styles.badgeContainer}>
      <DualIcon
        icon={{ sfSymbol: 'arrow.down.circle.fill', lucide: 'Download' }}
        size={12}
        color={PROFILE_COLORS.surface}
      />
      {showLabel && <Text style={styles.badgeText}>Hors ligne</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PROFILE_COLORS.primary,
    paddingVertical: 3,
    paddingHorizontal: PROFILE_SPACING.sm,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    color: PROFILE_COLORS.surface,
    fontSize: 10,
    fontWeight: '700',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inlineText: {
    color: PROFILE_COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
})

export default OfflineIndicator
