import React from 'react';
import { StyleSheet, TouchableOpacity, Platform, View } from 'react-native';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

export interface ThemeCardProps {
  /** Emoji du thème */
  emoji: string;

  /** Nom du thème */
  name: string;

  /** Description du thème */
  description: string;

  /** Couleur du thème */
  color: string;

  /** État de sélection */
  isSelected: boolean;

  /** Callback lors de la sélection */
  onPress: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * ThemeCard - Molecule pour une carte de thème
 *
 * Carte cliquable avec emoji, nom, description et gradient coloré.
 * Utilisée dans l'écran Theme Selection.
 *
 * @example
 * ```tsx
 * <ThemeCard
 *   emoji="🏰"
 *   name="Royaume magique"
 *   description="Châteaux, princes et princesses"
 *   color="#FF6B9D"
 *   isSelected={selectedTheme?.id === theme.id}
 *   onPress={() => onThemeSelect(theme)}
 * />
 * ```
 */
export const ThemeCard: React.FC<ThemeCardProps> = ({
  emoji,
  name,
  description,
  color,
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
      accessibilityLabel={`Thème ${name}`}
      accessibilityState={{ selected: isSelected }}
    >
      <LinearGradient
        colors={[color, adjustColor(color, -20)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
};

/**
 * Helper function to darken/lighten a color
 */
function adjustColor(color: string, amount: number): string {
  const clamp = (val: number) => Math.min(Math.max(val, 0), 255);
  const num = parseInt(color.replace('#', ''), 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00ff) + amount);
  const b = clamp((num & 0x0000ff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  containerSelected: {
    borderColor: colors.warmAmber,
    shadowColor: colors.warmAmber,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  gradient: {
    padding: 16,
    height: 160,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  description: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    lineHeight: 16,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.warmAmber,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmarkText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ThemeCard;
