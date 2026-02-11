import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Platform } from 'react-native';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { SPECIES_IMAGES } from '@/constants/speciesImages';
import type { AvatarSelectorProps, Avatar } from './AvatarSelector';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * AvatarSelectorCircles - Variant "Cercles avatars"
 *
 * Style similaire au sélecteur de teint (SkinToneSelector).
 * Cercles avec images mascot, bordure verte sur sélection,
 * glow effect et label en dessous.
 */
export const AvatarSelectorCircles: React.FC<AvatarSelectorProps> = ({
  avatars,
  selectedId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {avatars.map((avatar) => (
        <CircleOption
          key={avatar.id}
          avatar={avatar}
          isSelected={avatar.id === selectedId}
          onPress={() => onSelect(avatar.id)}
        />
      ))}
    </View>
  );
};

interface CircleOptionProps {
  avatar: Avatar;
  isSelected: boolean;
  onPress: () => void;
}

const CircleOption: React.FC<CircleOptionProps> = ({ avatar, isSelected, onPress }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isSelected ? 1.08 : scale.value }],
  }));

  const imageSource = SPECIES_IMAGES[avatar.species];

  return (
    <AnimatedTouchableOpacity
      style={[styles.button, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Avatar ${avatar.label}`}
      accessibilityState={{ selected: isSelected }}
    >
      <View
        style={[
          styles.circle,
          isSelected && styles.circleSelected,
        ]}
      >
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text
        style={[
          styles.label,
          isSelected && styles.labelSelected,
        ]}
      >
        {avatar.label}
      </Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
    paddingVertical: 4,
  },
  button: {
    alignItems: 'center',
    gap: 6,
  },
  circle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 2.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  circleSelected: {
    backgroundColor: '#e8f5ee',
    borderColor: colors.forestGreen,
    borderWidth: 3,
    shadowColor: colors.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  image: {
    width: 58,
    height: 58,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  labelSelected: {
    fontWeight: '800',
    color: colors.forestGreen,
  },
});

export default AvatarSelectorCircles;
