import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { DualIcon, type IconConfig } from '@/components/ui/DualIcon';
import { READER_COLORS, READER_DIMENSIONS } from '@/constants/reader';
import type { ReaderNavButtonVariant } from '@/types/reader';

interface ReaderNavButtonProps {
  icon: IconConfig;
  onPress: () => void;
  disabled?: boolean;
  variant?: ReaderNavButtonVariant;
  style?: ViewStyle;
}

export const ReaderNavButton: React.FC<ReaderNavButtonProps> = ({
  icon,
  onPress,
  disabled = false,
  variant = 'default',
  style,
}) => {
  const buttonSize =
    variant === 'back' || variant === 'close'
      ? READER_DIMENSIONS.backButtonSize
      : READER_DIMENSIONS.navButtonSize;

  const iconColor = disabled ? READER_COLORS.textMuted : READER_COLORS.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { width: buttonSize, height: buttonSize },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <DualIcon
        icon={icon}
        size={variant === 'default' ? 18 : 16}
        color={iconColor}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    backgroundColor: READER_COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  disabled: {
    opacity: 0.3,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
});

export default ReaderNavButton;
