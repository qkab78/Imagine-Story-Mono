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
 * AvatarSelectorCards - Variant "Cards arrondies"
 *
 * Grille 3x2 avec cards arrondies, coche verte sur sélection,
 * ombre portée et images mascot PNG.
 */
export const AvatarSelectorCards: React.FC<AvatarSelectorProps> = ({
  avatars,
  selectedId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {avatars.map((avatar) => (
        <CardOption
          key={avatar.id}
          avatar={avatar}
          isSelected={avatar.id === selectedId}
          onPress={() => onSelect(avatar.id)}
        />
      ))}
    </View>
  );
};

interface CardOptionProps {
  avatar: Avatar;
  isSelected: boolean;
  onPress: () => void;
}

const CardOption: React.FC<CardOptionProps> = ({ avatar, isSelected, onPress }) => {
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

  const imageSource = SPECIES_IMAGES[avatar.species];

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Avatar ${avatar.label}`}
      accessibilityState={{ selected: isSelected }}
    >
      {isSelected && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
      )}
      <Image
        source={imageSource}
        style={[
          styles.image,
          !isSelected && styles.imageInactive,
        ]}
        resizeMode="cover"
      />
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
    gap: 12,
    marginTop: 24,
  },
  card: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  cardSelected: {
    backgroundColor: '#e8f5ee',
    borderColor: colors.forestGreen,
    borderWidth: 2.5,
    shadowColor: colors.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  checkIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  image: {
    width: 96,
    height: 96,
  },
  imageInactive: {
    opacity: 0.8,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#888',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    letterSpacing: -0.2,
  },
  labelSelected: {
    fontWeight: '800',
    color: colors.forestGreen,
  },
});

export default AvatarSelectorCards;
