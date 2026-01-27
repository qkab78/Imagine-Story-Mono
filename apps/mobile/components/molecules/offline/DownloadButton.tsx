import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { DualIcon } from '@/components/ui'
import { PROFILE_COLORS } from '@/constants/profile'
import type { DownloadStatus } from '@/types/offline'

interface DownloadButtonProps {
  status: DownloadStatus
  onPress: () => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

const SIZE_CONFIG = {
  small: { container: 28, icon: 14 },
  medium: { container: 36, icon: 18 },
  large: { container: 44, icon: 22 },
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  status,
  onPress,
  disabled = false,
  size = 'medium',
}) => {
  const sizeConfig = SIZE_CONFIG[size]
  const isDownloading = status === 'downloading'
  const isDownloaded = status === 'downloaded'
  const hasError = status === 'error'

  const getBackgroundColor = () => {
    if (disabled) return PROFILE_COLORS.inputBackground
    if (isDownloaded) return PROFILE_COLORS.primary
    if (hasError) return PROFILE_COLORS.dangerLight
    return PROFILE_COLORS.iconBackground
  }

  const getIconColor = () => {
    if (disabled) return PROFILE_COLORS.textMuted
    if (isDownloaded) return PROFILE_COLORS.surface
    if (hasError) return PROFILE_COLORS.danger
    return PROFILE_COLORS.primary
  }

  const renderContent = () => {
    if (isDownloading) {
      return <ActivityIndicator size="small" color={PROFILE_COLORS.primary} />
    }

    if (isDownloaded) {
      return (
        <DualIcon
          icon={{ sfSymbol: 'checkmark.circle.fill', lucide: 'CheckCircle' }}
          size={sizeConfig.icon}
          color={getIconColor()}
        />
      )
    }

    if (hasError) {
      return (
        <DualIcon
          icon={{ sfSymbol: 'exclamationmark.circle', lucide: 'AlertCircle' }}
          size={sizeConfig.icon}
          color={getIconColor()}
        />
      )
    }

    return (
      <DualIcon
        icon={{ sfSymbol: 'arrow.down.circle', lucide: 'Download' }}
        size={sizeConfig.icon}
        color={getIconColor()}
      />
    )
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: sizeConfig.container,
          height: sizeConfig.container,
          backgroundColor: getBackgroundColor(),
        },
      ]}
      onPress={onPress}
      disabled={disabled || isDownloading || isDownloaded}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default DownloadButton
