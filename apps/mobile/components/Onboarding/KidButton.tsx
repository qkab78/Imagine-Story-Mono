import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Text from '@/components/ui/Text';
import Box from '@/components/ui/Box';
import { theme } from '@/config/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '@/theme/spacing';

interface KidButtonProps {
  title: string;
  emoji: string;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const KidButton: React.FC<KidButtonProps> = ({ title, emoji, onPress }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 20, stiffness: 400 });
    translateY.value = withTiming(3, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.02, { damping: 20, stiffness: 400 });
    translateY.value = withSpring(-3, { damping: 20, stiffness: 400 });

    // Return to original position with bounce
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 18, stiffness: 350 });
    }, 150);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <LinearGradient
      colors={['#FF6B9D', '#FFB74D']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <AnimatedPressable
        style={[styles.container, animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Box style={styles.gradient}>
          <Text style={styles.buttonText}>
            {title}{emoji}
          </Text>
        </Box>
      </AnimatedPressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: theme.colors.primaryPink,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    minHeight: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default KidButton;