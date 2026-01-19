import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SparkleIcon } from '@/components/atoms/onboarding/SparkleIcon';

export const MagicWand: React.FC = () => {
  const scale = useSharedValue(1);
  const circle1Scale = useSharedValue(1);
  const circle1Opacity = useSharedValue(0.3);
  const circle2Scale = useSharedValue(1);
  const circle2Opacity = useSharedValue(0.3);

  useEffect(() => {
    // Pulse animation for wand - smooth breathing effect
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true // reverse for smooth loop
    );

    // Expand animation for circles - smooth pulse outward and back
    circle1Scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    circle1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.15, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Second circle with offset timing for layered effect
    circle2Scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    circle2Opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.35, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const wandStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const circle1Style = useAnimatedStyle(() => ({
    transform: [{ scale: circle1Scale.value }],
    opacity: circle1Opacity.value,
  }));

  const circle2Style = useAnimatedStyle(() => ({
    transform: [{ scale: circle2Scale.value }],
    opacity: circle2Opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.magicCircle, styles.circle1, circle1Style]} />
      <Animated.View style={[styles.magicCircle, styles.circle2, circle2Style]} />

      <Animated.View style={[styles.magicWand, wandStyle]}>
        <Text style={styles.wandEmoji}>🪄</Text>
      </Animated.View>

      <View style={[styles.sparkle, styles.sparkle1]}>
        <SparkleIcon type="sparkle" size={32} />
      </View>
      <View style={[styles.sparkle, styles.sparkle2]}>
        <SparkleIcon type="star" size={28} delay={1000} />
      </View>
      <View style={[styles.sparkle, styles.sparkle3]}>
        <SparkleIcon type="stars" size={30} delay={2000} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  magicWand: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2F6B4F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F6B4F',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 12,
  },
  wandEmoji: {
    fontSize: 56,
  },
  magicCircle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 3,
    borderColor: '#F6C177',
  },
  circle1: {
    width: 160,
    height: 160,
  },
  circle2: {
    width: 200,
    height: 200,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: -20,
    right: 20,
  },
  sparkle2: {
    bottom: 10,
    left: -10,
  },
  sparkle3: {
    top: '50%',
    right: -20,
  },
});

export default MagicWand;
