import React from 'react';
import { StyleSheet, ViewStyle, StyleProp, View } from 'react-native';
import { GlassView as ExpoGlassView } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';

export interface GlassViewProps {
  /** Children */
  children?: React.ReactNode;

  /** Style de l'effet glass: 'clear' (léger) ou 'regular' (prononcé) */
  glassStyle?: 'clear' | 'regular';

  /** Couleur de teinte pour customiser l'apparence */
  tintColor?: string;

  /** Style personnalisé */
  style?: StyleProp<ViewStyle>;

  /** Props pour le fallback blur (iOS < 26) */
  blurIntensity?: number;
  blurTint?: 'light' | 'dark' | 'default';

  /** Props pour le fallback solid (Android) */
  fallbackBackgroundColor?: string;
}

/**
 * GlassView - Atom primitive pour liquid glass
 *
 * La plus petite unité réutilisable avec effet glass.
 * Utilisé comme building block pour les molecules et organisms.
 */
export const GlassView: React.FC<GlassViewProps> = ({
  children,
  glassStyle = 'regular',
  tintColor,
  style,
  blurIntensity = 80,
  blurTint = 'light',
  fallbackBackgroundColor = 'rgba(255, 255, 255, 0.9)',
}) => {
  const { hasGlassSupport, shouldUseBlur } = useLiquidGlass();

  // iOS 26+ - Liquid glass natif
  if (hasGlassSupport) {
    return (
      <ExpoGlassView
        glassEffectStyle={glassStyle}
        tintColor={tintColor}
        style={style}
      >
        {children}
      </ExpoGlassView>
    );
  }

  // iOS < 26 - Fallback blur
  if (shouldUseBlur) {
    return (
      <BlurView
        intensity={blurIntensity}
        tint={blurTint}
        style={[style, styles.blurContainer]}
      >
        {children}
      </BlurView>
    );
  }

  // Android - Fallback solid
  return (
    <View style={[style, { backgroundColor: fallbackBackgroundColor }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default GlassView;
