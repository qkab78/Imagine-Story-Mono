import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

export interface MagicButtonProps {
  /** Texte du bouton */
  title: string;

  /** Callback au clic */
  onPress: () => void;

  /** Icône à gauche du texte (emoji) */
  icon?: string;

  /** État de chargement */
  loading?: boolean;

  /** Bouton désactivé */
  disabled?: boolean;

  /** Style personnalisé */
  style?: any;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * MagicButton - Molecule bouton magique avec effet shimmer
 *
 * Bouton avec gradient et animation shimmer pour les actions importantes.
 * Utilisé dans l'écran Summary pour "Créer mon histoire magique".
 *
 * @example
 * ```tsx
 * <MagicButton
 *   title="Créer mon histoire magique"
 *   icon="✨"
 *   onPress={handleCreate}
 * />
 * ```
 */
export const MagicButton: React.FC<MagicButtonProps> = ({
  title,
  onPress,
  icon = '✨',
  loading = false,
  disabled = false,
  style,
}) => {
  const scaleAnimation = useSharedValue(1);
  const shimmerTranslate = useSharedValue(-100);

  useEffect(() => {
    // Animation shimmer infinie
    shimmerTranslate.value = withRepeat(
      withTiming(100, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const handlePressIn = () => {
    scaleAnimation.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scaleAnimation.value = withTiming(1, { duration: 100 });
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
  }));

  const isDisabled = disabled || loading;

  return (
    <AnimatedTouchableOpacity
      style={[styles.button, animatedButtonStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
    >
      <LinearGradient
        colors={[colors.forestGreen, '#3D7A5E']}
        style={[
          styles.gradient,
          isDisabled && styles.gradientDisabled,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Effet shimmer */}
        {!isDisabled && (
          <Animated.View style={[styles.shimmer, shimmerStyle]} />
        )}

        {/* Contenu */}
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={styles.title}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.forestGreen,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 10,
  },
  gradient: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    position: 'relative',
  },
  gradientDisabled: {
    opacity: 0.6,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  icon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
});

export default MagicButton;
