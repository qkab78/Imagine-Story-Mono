import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { HomeIcon } from '@/components/atoms/home';
import type { ActionCardProps } from '@/types/home';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  iconGradient,
  onPress,
  testID,
}) => {
  const scaleAnimation = useSharedValue(1);
  const opacityAnimation = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scaleAnimation.value = withTiming(0.98, { duration: 100 });
    opacityAnimation.value = withTiming(0.8, { duration: 100 });
  }, []);

  const handlePressOut = useCallback(() => {
    scaleAnimation.value = withTiming(1, { duration: 100 });
    opacityAnimation.value = withTiming(1, { duration: 100 });
  }, []);

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
    opacity: opacityAnimation.value,
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint="Appuyez pour continuer"
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <HomeIcon emoji={icon} gradient={iconGradient as [string, string]} size={64} />

          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // No margin needed here, will be handled by parent
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F6B4F',
    fontFamily: 'Quicksand',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4A6B5A',
    fontFamily: 'Nunito',
    lineHeight: 20,
  },
});

export default ActionCard;