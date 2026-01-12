import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { GlassContainer as ExpoGlassContainer } from 'expo-glass-effect';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';

export interface GlassContainerProps {
  /** Enfants GlassCard qui peuvent merger ensemble */
  children: React.ReactNode;

  /** Distance minimale entre éléments pour activer le merge (en pixels) */
  spacing?: number;

  /** Styles personnalisés du container */
  style?: StyleProp<ViewStyle>;
}

/**
 * GlassContainer - Molecule pour grouper plusieurs GlassCard
 *
 * Container pour créer des effets de merge visuel entre GlassCards proches.
 * Fonctionne uniquement sur iOS 26+, sinon agit comme un View standard.
 *
 * L'effet de merge crée une continuité visuelle entre les cards lorsqu'elles
 * sont suffisamment proches (selon le spacing).
 *
 * @example
 * ```tsx
 * <GlassContainer spacing={20}>
 *   <GlassCard>Card 1</GlassCard>
 *   <GlassCard>Card 2</GlassCard>
 * </GlassContainer>
 * ```
 */
export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  spacing = 20,
  style,
}) => {
  const { hasGlassSupport } = useLiquidGlass();

  // iOS 26+ - Utiliser GlassContainer pour merge effects
  if (hasGlassSupport) {
    return (
      <ExpoGlassContainer spacing={spacing} style={style}>
        {children}
      </ExpoGlassContainer>
    );
  }

  // Fallback - Simple View sans effet de merge
  return <View style={style}>{children}</View>;
};

export default GlassContainer;
