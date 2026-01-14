import { View, StyleSheet } from 'react-native';
import { DualIcon, type IconConfig } from '@/components/ui';
import { PROFILE_COLORS, PROFILE_DIMENSIONS } from '@/constants/profile';

interface SettingsIconProps {
  icon: IconConfig;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export const SettingsIcon: React.FC<SettingsIconProps> = ({
  icon,
  size = PROFILE_DIMENSIONS.iconSize,
  color = PROFILE_COLORS.iconColor,
  backgroundColor = PROFILE_COLORS.iconBackground,
}) => {
  const containerSize = PROFILE_DIMENSIONS.iconContainerSize;

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor,
        },
      ]}
    >
      <DualIcon icon={icon} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsIcon;
