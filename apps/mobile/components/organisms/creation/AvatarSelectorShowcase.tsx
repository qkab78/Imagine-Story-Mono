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
 * AvatarSelectorShowcase - Variant "Showcase avec badge"
 *
 * Grandes cartes avec effet translateY sur sélection,
 * badge doré "CHOISI", underline indicator,
 * et drop shadow sur l'image sélectionnée.
 */
export const AvatarSelectorShowcase: React.FC<AvatarSelectorProps> = ({
  avatars,
  selectedId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {avatars.map((avatar) => (
        <ShowcaseOption
          key={avatar.id}
          avatar={avatar}
          isSelected={avatar.id === selectedId}
          onPress={() => onSelect(avatar.id)}
        />
      ))}
    </View>
  );
};

interface ShowcaseOptionProps {
  avatar: Avatar;
  isSelected: boolean;
  onPress: () => void;
}

const ShowcaseOption: React.FC<ShowcaseOptionProps> = ({ avatar, isSelected, onPress }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: isSelected ? -4 : 0 },
    ],
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
        <View style={styles.choseBadge}>
          <Text style={styles.choseBadgeText}>✨ CHOISI</Text>
        </View>
      )}
      <Image
        source={imageSource}
        style={[
          styles.image,
          isSelected && styles.imageSelected,
          !isSelected && styles.imageInactive,
        ]}
        resizeMode="contain"
      />
      <Text
        style={[
          styles.label,
          isSelected && styles.labelSelected,
        ]}
      >
        {avatar.label}
      </Text>
      {isSelected && <View style={styles.underline} />}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 24,
    paddingHorizontal: 2,
  },
  card: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 22,
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 4,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'visible',
  },
  cardSelected: {
    backgroundColor: '#fff9f0',
    shadowColor: colors.forestGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  choseBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: colors.warmAmber,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    zIndex: 1,
    shadowColor: colors.warmAmber,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  choseBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    letterSpacing: 0.5,
  },
  image: {
    width: 80,
    height: 80,
  },
  imageSelected: {
    // drop shadow effect handled by card shadow
  },
  imageInactive: {
    opacity: 0.7,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  labelSelected: {
    fontWeight: '800',
    color: colors.forestGreen,
  },
  underline: {
    width: 30,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.forestGreen,
    marginTop: 1,
  },
});

export default AvatarSelectorShowcase;
