import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

export interface PrimaryButtonProps {
  /** Texte du bouton */
  title: string;

  /** Callback au clic */
  onPress: () => void;

  /** Icône à droite du texte (emoji ou SF Symbol name sur iOS) */
  icon?: string;

  /** État de chargement */
  loading?: boolean;

  /** Bouton désactivé */
  disabled?: boolean;

  /** Style personnalisé */
  style?: any;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * PrimaryButton - Molecule bouton principal
 *
 * Bouton primaire avec fond forestGreen, icône optionnelle et état de chargement.
 * Utilisé pour les actions principales (Commencer, Continuer, etc.).
 *
 * @example
 * ```tsx
 * <PrimaryButton
 *   title="Commencer"
 *   icon="→"
 *   onPress={handleStart}
 * />
 * ```
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  icon,
  loading = false,
  disabled = false,
  style,
}) => {
  const scaleAnimation = useSharedValue(1);
  const opacityAnimation = useSharedValue(1);

  const handlePressIn = () => {
    scaleAnimation.value = withTiming(0.98, { duration: 100 });
    opacityAnimation.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOut = () => {
    scaleAnimation.value = withTiming(1, { duration: 100 });
    opacityAnimation.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
    opacity: opacityAnimation.value,
  }));

  const isDisabled = disabled || loading;

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.button,
        isDisabled && styles.buttonDisabled,
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          <Text style={styles.title}>{title}</Text>
          {icon && <Text style={styles.icon}>{icon}</Text>}
        </>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: colors.forestGreen,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.forestGreen,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  icon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default PrimaryButton;
