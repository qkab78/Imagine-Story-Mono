import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface NotificationBubbleProps {
  emojis?: string;
  delay?: number;
}

export const NotificationBubble: React.FC<NotificationBubbleProps> = ({
  emojis = '👋 📚 ❓',
  delay = 300,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 12,
        stiffness: 150,
      })
    );
    opacity.value = withDelay(delay, withSpring(1));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.emojis}>{emojis}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  emojis: {
    fontSize: 20,
  },
});

export default NotificationBubble;
