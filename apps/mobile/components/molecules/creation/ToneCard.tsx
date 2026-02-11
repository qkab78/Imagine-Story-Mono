import React from 'react';
import { StyleSheet, TouchableOpacity, Platform, View, Image, ImageSourcePropType } from 'react-native';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

export interface ToneCardProps {
  /** Emoji du ton */
  emoji: string;

  /** Nom du ton */
  name: string;

  /** Description du ton */
  description: string;

  /** État de sélection */
  isSelected: boolean;

  /** Callback lors de la sélection */
  onPress: () => void;

  /** Image source optionnelle (remplace l'emoji) */
  imageSource?: ImageSourcePropType;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * ToneCard - Molecule pour une carte de ton
 *
 * Carte cliquable avec emoji, nom et description sur fond blanc.
 * Utilisée dans l'écran Tone Selection.
 *
 * @example
 * ```tsx
 * <ToneCard
 *   emoji="😊"
 *   name="Joyeux"
 *   description="Une histoire pleine de rires et de bonne humeur"
 *   isSelected={selectedTone?.id === tone.id}
 *   onPress={() => onToneSelect(tone)}
 * />
 * ```
 */
export const ToneCard: React.FC<ToneCardProps> = ({
  emoji,
  name,
  description,
  isSelected,
  onPress,
  imageSource,
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
      accessibilityLabel={`Ton ${name}`}
      accessibilityState={{ selected: isSelected }}
    >
      <View style={styles.background}>
        <View style={styles.content}>
          <View style={[styles.emojiContainer, imageSource ? styles.imageContainer : undefined]}>
            {imageSource ? (
              <Image source={imageSource} style={styles.toneImage} resizeMode="cover" />
            ) : (
              <Text style={styles.emoji}>{emoji}</Text>
            )}
          </View>
          <View style={styles.textContent}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
};

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
    borderColor: colors.forestGreen,
    shadowColor: colors.forestGreen,
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
  background: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    minHeight: 88,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    backgroundColor: colors.creamSurface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 26,
  },
  imageContainer: {
    overflow: 'hidden',
  },
  toneImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  textContent: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    lineHeight: 18,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#A8D4C0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkCircleSelected: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ToneCard;
