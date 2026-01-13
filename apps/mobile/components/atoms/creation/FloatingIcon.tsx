import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

export interface FloatingIconProps {
  /** Emoji ou texte de l'icône */
  icon: string;

  /** Taille de l'icône en pixels */
  size?: number;

  /** Couleurs du gradient de fond */
  gradientColors?: [string, string];

  /** Désactiver l'animation float */
  disableAnimation?: boolean;
}

/**
 * FloatingIcon - Atom avec animation de flottement
 *
 * Icône avec gradient background et animation verticale douce.
 * Utilisé principalement dans l'écran de bienvenue.
 *
 * @example
 * ```tsx
 * <FloatingIcon
 *   icon="✨"
 *   size={120}
 *   gradientColors={[colors.warmAmber, '#E8A957']}
 * />
 * ```
 */
export const FloatingIcon: React.FC<FloatingIconProps> = ({
  icon,
  size = 120,
  gradientColors = [colors.warmAmber, '#E8A957'],
  disableAnimation = false,
}) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!disableAnimation) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repeat
        false
      );
    }
  }, [disableAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const iconSize = size * 0.47; // Icon is ~47% of container size

  return (
    <Animated.View style={[animatedStyle]}>
      <LinearGradient
        colors={gradientColors}
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size * 0.27, // ~27% of size for rounded corners
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.Text style={[styles.icon, { fontSize: iconSize }]}>
          {icon}
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.warmAmber,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 12,
  },
  icon: {
    textAlign: 'center',
  },
});

export default FloatingIcon;
