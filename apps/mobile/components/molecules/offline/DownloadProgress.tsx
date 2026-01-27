import { View, Text, StyleSheet } from 'react-native'
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile'

interface DownloadProgressProps {
  progress: number // 0-100
  showPercentage?: boolean
  height?: number
}

export const DownloadProgress: React.FC<DownloadProgressProps> = ({
  progress,
  showPercentage = true,
  height = 4,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              height,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PROFILE_SPACING.sm,
  },
  track: {
    flex: 1,
    backgroundColor: PROFILE_COLORS.inputBackground,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: PROFILE_COLORS.primary,
    borderRadius: 999,
  },
  percentage: {
    fontSize: 11,
    fontWeight: '600',
    color: PROFILE_COLORS.textSecondary,
    minWidth: 32,
    textAlign: 'right',
  },
})

export default DownloadProgress
