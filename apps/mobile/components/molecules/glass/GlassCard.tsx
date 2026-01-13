import React from 'react';
import { StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { GlassView } from '@/components/atoms/glass/GlassView';
import { spacing } from '@/theme/spacing';
import { colors } from '@/theme/colors';

export interface GlassCardProps {
  /** Contenu du card */
  children: React.ReactNode;

  /** Style de l'effet glass: 'clear' (léger) ou 'regular' (prononcé) */
  glassStyle?: 'clear' | 'regular';

  /** Couleur de teinte pour l'effet glass */
  tintColor?: string;

  /** Handler pour le press */
  onPress?: () => void;

  /** Handler pour le long press */
  onLongPress?: () => void;

  /** Style personnalisé */
  style?: StyleProp<ViewStyle>;

  /** Style pour le fallback (Android) */
  fallbackStyle?: StyleProp<ViewStyle>;

  /** Border radius */
  borderRadius?: number;

  /** Padding */
  padding?: number;
}

/**
 * GlassCard - Molecule card avec effet glass
 *
 * Card standard avec effet glass, pressable optionnel.
 * Utilisé comme building block pour les organisms et features.
 *
 * Compose l'atom GlassView avec logique de press.
 *
 * @example
 * ```tsx
 * <GlassCard
 *   glassStyle="regular"
 *   tintColor="rgba(107, 70, 193, 0.1)"
 *   onPress={() => console.log('pressed')}
 *   borderRadius={24}
 * >
 *   <Text>Contenu du card</Text>
 * </GlassCard>
 * ```
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  glassStyle = 'regular',
  tintColor,
  onPress,
  onLongPress,
  style,
  fallbackStyle,
  borderRadius = 16,
  padding = spacing.base,
}) => {
  const cardContent = (
    <GlassView
      glassStyle={glassStyle}
      tintColor={tintColor}
      style={[
        styles.card,
        { borderRadius, padding },
        style,
      ]}
      fallbackBackgroundColor={colors.cardBackground}
    >
      {children}
    </GlassView>
  );

  // Si pressable, wrapper avec Pressable
  if (onPress || onLongPress) {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [
          pressed && styles.pressed,
        ]}
      >
        {cardContent}
      </Pressable>
    );
  }

  // Sinon, retourner directement le card
  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
  },
});

export default GlassCard;
