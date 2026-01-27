import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { DualIcon } from '@/components/ui'
import { useAppTranslation } from '@/hooks/useAppTranslation'
import { PROFILE_SPACING, PROFILE_ICONS } from '@/constants/profile'

type QuotaBadgeVariant = 'default' | 'compact' | 'inline'

interface QuotaBadgeProps {
  storiesCreatedThisMonth: number
  limit: number | null
  remaining: number | null
  isUnlimited: boolean
  variant?: QuotaBadgeVariant
}

const QUOTA_COLORS = {
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  premium: '#F6C177',
} as const

const getQuotaStatus = (remaining: number | null, limit: number | null) => {
  if (remaining === null || limit === null) return 'success'
  const percentage = remaining / limit
  if (percentage > 0.5) return 'success'
  if (percentage > 0) return 'warning'
  return 'danger'
}

const getStatusColor = (status: 'success' | 'warning' | 'danger') => {
  return QUOTA_COLORS[status]
}

export const QuotaBadge: React.FC<QuotaBadgeProps> = ({
  storiesCreatedThisMonth,
  limit,
  remaining,
  isUnlimited,
  variant = 'default',
}) => {
  const { t } = useAppTranslation('stories')

  if (isUnlimited) {
    return (
      <LinearGradient
        colors={[QUOTA_COLORS.premium, '#E8A957']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container, variant === 'compact' && styles.containerCompact]}
      >
        <DualIcon
          icon={PROFILE_ICONS.crown}
          size={variant === 'compact' ? 12 : 14}
          color="white"
        />
        <Text style={[styles.text, variant === 'compact' && styles.textCompact]}>
          {t('quota.unlimited')}
        </Text>
      </LinearGradient>
    )
  }

  const status = getQuotaStatus(remaining, limit)
  const statusColor = getStatusColor(status)

  if (variant === 'inline') {
    return (
      <View style={[styles.inlineContainer, { borderColor: statusColor }]}>
        <DualIcon
          icon={PROFILE_ICONS.sparkles}
          size={12}
          color={statusColor}
        />
        <Text style={[styles.inlineText, { color: statusColor }]}>
          {remaining}/{limit}
        </Text>
      </View>
    )
  }

  const getQuotaText = () => {
    if (remaining !== null) {
      return remaining > 1
        ? t('quota.storiesRemainingPlural', { count: remaining })
        : t('quota.storiesRemaining', { count: remaining })
    }
    return storiesCreatedThisMonth > 1
      ? t('quota.storiesUsedPlural', { count: storiesCreatedThisMonth })
      : t('quota.storiesUsed', { count: storiesCreatedThisMonth })
  }

  return (
    <View style={[
      styles.container,
      variant === 'compact' && styles.containerCompact,
      { backgroundColor: `${statusColor}15` }
    ]}>
      <DualIcon
        icon={PROFILE_ICONS.sparkles}
        size={variant === 'compact' ? 12 : 14}
        color={statusColor}
      />
      <Text style={[
        styles.text,
        variant === 'compact' && styles.textCompact,
        { color: statusColor }
      ]}>
        {getQuotaText()}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: PROFILE_SPACING.md,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  containerCompact: {
    paddingHorizontal: PROFILE_SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Nunito',
  },
  textCompact: {
    fontSize: 11,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  inlineText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Nunito',
  },
})

export default QuotaBadge
