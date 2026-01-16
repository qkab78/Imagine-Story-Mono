import { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type SparkleType = 'sparkle' | 'star' | 'stars';

interface SparkleIconProps {
  type: SparkleType;
  size?: number;
  delay?: number;
}

const SPARKLE_EMOJIS: Record<SparkleType, string> = {
  sparkle: '✨',
  star: '⭐',
  stars: '💫',
};

export const SparkleIcon: React.FC<SparkleIconProps> = ({
  type,
  size = 32,
  delay = 0,
}) => {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Float animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Rotate animation
    rotate.value = withRepeat(
      withTiming(180, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={[styles.emoji, { fontSize: size }]}>
        {SPARKLE_EMOJIS[type]}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  emoji: {
    textAlign: 'center',
  },
});

export default SparkleIcon;
