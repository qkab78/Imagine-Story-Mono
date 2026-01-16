import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { SparkleIcon } from '@/components/atoms/onboarding/SparkleIcon';

export const ShieldBadge: React.FC = () => {
  const badgeScale = useSharedValue(0);

  useEffect(() => {
    badgeScale.value = withDelay(
      500,
      withSpring(1, {
        damping: 12,
        stiffness: 100,
      })
    );
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.shieldContainer}>
        <Text style={styles.shieldEmoji}>🛡️</Text>
      </View>

      <Animated.View style={[styles.checkBadge, badgeStyle]}>
        <Text style={styles.checkEmoji}>✓</Text>
      </Animated.View>

      <View style={[styles.sparkle, styles.sparkle1]}>
        <SparkleIcon type="sparkle" size={32} />
      </View>
      <View style={[styles.sparkle, styles.sparkle2]}>
        <SparkleIcon type="star" size={28} delay={1000} />
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
  shieldContainer: {
    width: 140,
    height: 160,
    backgroundColor: '#2F6B4F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F6B4F',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 12,
    // Shield shape using transform
    transform: [{ scaleY: 1.2 }],
    borderRadius: 70,
  },
  shieldEmoji: {
    fontSize: 64,
  },
  checkBadge: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
    right: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  checkEmoji: {
    fontSize: 32,
    color: '#2F6B4F',
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
});

export default ShieldBadge;
