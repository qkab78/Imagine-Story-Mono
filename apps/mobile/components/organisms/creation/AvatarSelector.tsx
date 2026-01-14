import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/theme/colors';
import { useNativeTabsSupport } from '@/hooks/useNativeTabsSupport';

export interface Avatar {
  id: string;
  species: 'girl' | 'boy' | 'robot' | 'superhero' | 'superheroine' | 'animal';
  emoji: string;
  sfSymbol?: string; // SF Symbol name for iOS
  label: string;
}

export interface AvatarSelectorProps {
  /** Liste des avatars disponibles */
  avatars: Avatar[];

  /** ID de l'avatar sélectionné */
  selectedId: string | null;

  /** Callback lors de la sélection */
  onSelect: (avatarId: string) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * AvatarSelector - Organism pour sélectionner un avatar
 *
 * Sélecteur horizontal d'avatars avec animations.
 * Utilise SF Symbols sur iOS avec liquid glass, emojis en fallback.
 * Utilisé dans l'écran Hero Selection.
 *
 * @example
 * ```tsx
 * const avatars = [
 *   { id: 'girl', species: 'girl', emoji: '👧', sfSymbol: 'figure.dress.line.vertical.figure', label: 'Fille' },
 *   { id: 'boy', species: 'boy', emoji: '👦', sfSymbol: 'figure.arms.open', label: 'Garçon' },
 * ];
 *
 * <AvatarSelector
 *   avatars={avatars}
 *   selectedId={selectedAvatar}
 *   onSelect={setSelectedAvatar}
 * />
 * ```
 */
export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  avatars,
  selectedId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {avatars.map((avatar) => (
        <AvatarOption
          key={avatar.id}
          avatar={avatar}
          isSelected={avatar.id === selectedId}
          onPress={() => onSelect(avatar.id)}
        />
      ))}
    </View>
  );
};

interface AvatarOptionProps {
  avatar: Avatar;
  isSelected: boolean;
  onPress: () => void;
}

const AvatarOption: React.FC<AvatarOptionProps> = ({
  avatar,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const { shouldUseNativeTabs } = useNativeTabsSupport();
  const canUseSFSymbols = Platform.OS === 'ios' && shouldUseNativeTabs;

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 400 });
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
        styles.avatarButton,
        isSelected && styles.avatarButtonSelected,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Avatar ${avatar.label}`}
      accessibilityState={{ selected: isSelected }}
    >
      {canUseSFSymbols && avatar.sfSymbol ? (
        <SymbolView
          name={avatar.sfSymbol as any}
          size={32}
          type="hierarchical"
          tintColor={isSelected ? colors.warmAmber : colors.forestGreen}
          animationSpec={{
            effect: {
              type: isSelected ? 'bounce' : 'scale',
            },
          }}
        />
      ) : (
        <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
    flexWrap: 'wrap',
  },
  avatarButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarButtonSelected: {
    borderColor: colors.warmAmber,
    shadowColor: colors.warmAmber,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarEmoji: {
    fontSize: 32,
  },
});

export default AvatarSelector;
