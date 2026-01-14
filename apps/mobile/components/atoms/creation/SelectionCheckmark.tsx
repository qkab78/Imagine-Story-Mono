import React, { useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

export interface SelectionCheckmarkProps {
  /** État de sélection */
  selected: boolean;

  /** Taille du checkmark en pixels */
  size?: number;
}

/**
 * SelectionCheckmark - Atom pour indiquer une sélection
 *
 * Checkmark circulaire animé qui apparaît quand un élément est sélectionné.
 * Utilisé dans les ToneCards et autres éléments sélectionnables.
 *
 * @example
 * ```tsx
 * <SelectionCheckmark selected={isSelected} size={24} />
 * ```
 */
export const SelectionCheckmark: React.FC<SelectionCheckmarkProps> = ({
  selected,
  size = 24,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (selected) {
      // Animation d'apparition avec bounce
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.2, { duration: 150, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 100, easing: Easing.inOut(Easing.ease) })
      );
      opacity.value = withTiming(1, { duration: 150 });
    } else {
      // Animation de disparition
      scale.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.ease) });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const iconSize = size * 0.5; // Icon is 50% of container

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        selected ? styles.selected : styles.unselected,
        animatedStyle,
      ]}
    >
      {selected && (
        <Animated.Text style={[styles.checkmark, { fontSize: iconSize }]}>
          ✓
        </Animated.Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  unselected: {
    borderColor: colors.mintGreen,
    backgroundColor: 'transparent',
  },
  selected: {
    borderColor: colors.forestGreen,
    backgroundColor: colors.forestGreen,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        marginTop: -2, // Adjust for iOS text rendering
      },
    }),
  },
});

export default SelectionCheckmark;
