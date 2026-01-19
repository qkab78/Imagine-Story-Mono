import { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
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
  const scale = useSharedValue(1);

  useEffect(() => {
    // Float animation with delay - smooth up and down
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true // reverse for smooth loop
      )
    );

    // Rotate animation - smooth back and forth instead of full rotation reset
    rotate.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(15, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(-15, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true // reverse for smooth loop
      )
    );

    // Subtle scale pulse for extra life
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
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
