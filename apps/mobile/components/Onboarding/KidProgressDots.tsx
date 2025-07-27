import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Box from '@/components/ui/Box';
import { theme } from '@/config/theme';

interface KidProgressDotsProps {
  totalSlides: number;
  currentSlide: number;
  onDotPress?: (index: number) => void;
}

const KidProgressDots: React.FC<KidProgressDotsProps> = ({ totalSlides, currentSlide, onDotPress }) => {
  const handleDotPress = (index: number) => {
    // Feedback haptique pour les enfants
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDotPress?.(index);
  };

  return (
    <Box 
      flexDirection="row" 
      justifyContent="center" 
      alignItems="center" 
      gap="m"
    >
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isActive = index === currentSlide;
        
        const animatedStyle = useAnimatedStyle(() => ({
          width: withSpring(isActive ? 28 : 12, {
            damping: 15,
            stiffness: 150,
          }),
          backgroundColor: isActive ? theme.colors.primaryPink : '#E0E0E0',
          borderColor: isActive ? theme.colors.secondaryOrange : 'transparent',
          borderWidth: isActive ? 2 : 0,
        }));

        return (
          <Pressable
            key={index}
            onPress={() => handleDotPress(index)}
            style={({ pressed }) => [
              styles.dotPressable,
              pressed && styles.dotPressed
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Animated.View
              style={[
                styles.dot,
                animatedStyle,
              ]}
            />
          </Pressable>
        );
      })}
    </Box>
  );
};

const styles = StyleSheet.create({
  dotPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  dotPressed: {
    transform: [{ scale: 0.9 }],
  },
  dot: {
    height: 12,
    borderRadius: 6,
  },
});

export default KidProgressDots;