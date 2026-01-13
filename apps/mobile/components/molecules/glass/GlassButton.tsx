import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GlassView } from '@/components/atoms/glass/GlassView';
import Text from '@/components/ui/Text';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export interface GlassButtonProps {
  /** Texte du bouton */
  label: string;

  /** Handler pour le press */
  onPress: () => void;

  /** Style de glass: 'clear' (léger) ou 'regular' (prononcé) */
  glassStyle?: 'clear' | 'regular';

  /** Couleur de teinte pour l'effet glass */
  tintColor?: string;

  /** Variante (taille) du bouton */
  variant?: 'small' | 'medium' | 'large';

  /** Désactivé */
  disabled?: boolean;

  /** Couleur du texte */
  textColor?: string;
}

/**
 * GlassButton - Molecule button avec effet glass
 *
 * Bouton avec effet glass et animation au press.
 * Compose l'atom GlassView avec logique d'animation.
 *
 * @example
 * ```tsx
 * <GlassButton
 *   label="Créer une histoire"
 *   onPress={() => console.log('pressed')}
 *   glassStyle="regular"
 *   variant="large"
 * />
 * ```
 */
export const GlassButton: React.FC<GlassButtonProps> = ({
  label,
  onPress,
  glassStyle = 'regular',
  tintColor,
  variant = 'medium',
  disabled = false,
  textColor = 'rgba(0, 0, 0, 0.8)',
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View style={animatedStyle}>
        <GlassView
          glassStyle={glassStyle}
          tintColor={tintColor}
          style={[
            styles.button,
            styles[variant],
            disabled && styles.disabled,
          ]}
        >
          <Text style={[styles.label, { color: textColor }]}>
            {label}
          </Text>
        </GlassView>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
  },
  large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
  },
});

export default GlassButton;
