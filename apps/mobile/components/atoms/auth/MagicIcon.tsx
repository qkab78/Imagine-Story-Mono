import { useEffect } from 'react';
import { ColorValue, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface MagicIconProps {
  emoji: string;
  variant?: 'default' | 'signup';
  size?: 'large' | 'compact';
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const MagicIcon: React.FC<MagicIconProps> = ({
  emoji,
  variant = 'default',
  size = 'large',
}) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(180, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const gradientColors =
    variant === 'signup'
      ? ['#FF9AA2', '#FFB7B2', '#F6C177']
      : ['#7FB8A0', '#2F6B4F'];

  const containerStyle = size === 'large' ? styles.containerLarge : styles.containerCompact;
  const emojiStyle = size === 'large' ? styles.emojiLarge : styles.emojiCompact;
  const sparkleStyle = size === 'large' ? styles.sparkleLarge : styles.sparkleCompact;

  return (
    <LinearGradient
      colors={gradientColors as [ColorValue, ColorValue, ColorValue]}
      style={containerStyle}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={emojiStyle}>{emoji}</Text>
      <Animated.Text style={[sparkleStyle, sparkleAnimatedStyle]}>
        ✨
      </Animated.Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  containerLarge: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 6,
  },
  containerCompact: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 6,
  },
  emojiLarge: {
    fontSize: 56,
  },
  emojiCompact: {
    fontSize: 40,
  },
  sparkleLarge: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 32,
  },
  sparkleCompact: {
    position: 'absolute',
    top: -6,
    right: -6,
    fontSize: 24,
  },
});

export default MagicIcon;
