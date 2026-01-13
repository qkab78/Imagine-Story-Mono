import React from 'react';
import { GlassView } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import Box from './Box';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';
import type { BoxProps } from '@shopify/restyle';
import type { Theme } from '@/config/theme';

export interface GlassBoxProps extends BoxProps<Theme> {
  /** Style de l'effet glass: 'clear' (léger) ou 'regular' (prononcé) */
  glassStyle?: 'clear' | 'regular';

  /** Couleur de teinte pour customiser l'apparence */
  tintColor?: string;

  /** Intensité du blur pour le fallback iOS < 26 (0-100) */
  blurIntensity?: number;

  /** Teinte du blur pour le fallback iOS < 26 */
  blurTint?: 'light' | 'dark' | 'default';

  /** Children */
  children?: React.ReactNode;
}

/**
 * GlassBox - Extension de Box avec support Liquid Glass
 *
 * Utilise le système Restyle pour toutes les props standard (margin, padding, etc.)
 * et ajoute les props glass spécifiques.
 *
 * Fallback automatique:
 * - iOS 26+: GlassView (liquid glass natif)
 * - iOS < 26: BlurView (effet blur classique)
 * - Android: Box standard avec backgroundColor du theme
 */
export const GlassBox: React.FC<GlassBoxProps> = ({
  glassStyle = 'regular',
  tintColor,
  blurIntensity = 80,
  blurTint = 'light',
  children,
  ...boxProps
}) => {
  const { hasGlassSupport, shouldUseBlur } = useLiquidGlass();

  // iOS 26+ avec expo-glass-effect
  if (hasGlassSupport) {
    return (
      <GlassView
        glassEffectStyle={glassStyle}
        tintColor={tintColor}
        // @ts-ignore - GlassView accepte les mêmes props que View
        style={boxProps.style}
      >
        <Box {...boxProps}>
          {children}
        </Box>
      </GlassView>
    );
  }

  // iOS < 26 - Fallback avec BlurView
  if (shouldUseBlur) {
    return (
      <BlurView
        intensity={blurIntensity}
        tint={blurTint}
        // @ts-ignore - BlurView accepte les mêmes props que View
        style={boxProps.style}
      >
        <Box
          {...boxProps}
          backgroundColor="glassLight"
        >
          {children}
        </Box>
      </BlurView>
    );
  }

  // Android - Fallback avec Box standard
  return (
    <Box
      {...boxProps}
      backgroundColor={boxProps.backgroundColor || 'mainBackground'}
    >
      {children}
    </Box>
  );
};

export default GlassBox;
