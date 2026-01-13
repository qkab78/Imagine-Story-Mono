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
      <View style={[styles.background, isSelected && styles.backgroundSelected]}>
        <LinearGradient
          colors={isSelected ? [colors.warmAmber, '#E8A957'] : ['#A8D4C0', '#7FB8A0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircle}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </LinearGradient>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
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
    padding: 20,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 12,
  },
  backgroundSelected: {
    backgroundColor: 'rgba(47, 107, 79, 0.08)',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    lineHeight: 16,
  },
});

export default ThemeCard;
