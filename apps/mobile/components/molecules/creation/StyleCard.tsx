import React from 'react';
import { StyleSheet, TouchableOpacity, Platform, View } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

export interface StyleCardProps {
  /** ID du style */
  id: string;

  /** Nom du style */
  name: string;

  /** Description du style */
  description: string;

  /** Emoji for the style */
  emoji: string;

  /** Gradient colors for the preview */
  gradientColors: string[];

  /** État de sélection */
  isSelected: boolean;

  /** Callback lors de la sélection */
  onPress: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * StyleCard - Molecule pour une carte de style d'illustration
 *
 * Carte cliquable avec gradient de preview, emoji, nom et description.
 * Utilisée dans l'écran de sélection du style d'illustration.
 *
 * @example
 * ```tsx
 * <StyleCard
 *   id="japanese-soft"
 *   name="Doux & Magique"
 *   description="Style japonais doux, couleurs pastel"
 *   emoji="🌸"
 *   gradientColors={['#FFE5EC', '#FFC4D6', '#FFAEC9']}
 *   isSelected={selectedStyle === 'japanese-soft'}
 *   onPress={() => onStyleSelect('japanese-soft')}
 * />
 * ```
 */
export const StyleCard: React.FC<StyleCardProps> = ({
  name,
  description,
  emoji,
  gradientColors,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Style ${name}`}
      accessibilityState={{ selected: isSelected }}
    >
      <View style={[styles.background, isSelected && styles.backgroundSelected]}>
        {/* Preview Gradient with Emoji */}
        <View style={styles.previewContainer}>
          <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </LinearGradient>
          {isSelected && (
            <View style={styles.selectedOverlay}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  containerSelected: {
    borderColor: colors.forestGreen,
    shadowColor: colors.deepForest,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  background: {
    backgroundColor: '#FFFFFF',
  },
  backgroundSelected: {
    backgroundColor: 'rgba(47, 107, 79, 0.08)',
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkmark: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textContainer: {
    padding: 12,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  description: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    lineHeight: 14,
  },
});

export default StyleCard;
