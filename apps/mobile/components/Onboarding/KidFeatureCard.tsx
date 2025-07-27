import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import { FeatureItem } from './kidSlides';

interface KidFeatureCardProps {
  feature: FeatureItem;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const KidFeatureCard: React.FC<KidFeatureCardProps> = ({ feature, index }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.card, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => {
        // Optional: Add haptic feedback or sound
        console.log(`Feature ${index + 1} pressed`);
      }}
    >
      <Box 
        backgroundColor="white" 
        borderRadius="l" 
        padding="m" 
        flexDirection="row" 
        alignItems="center" 
        gap="m"
        style={styles.cardContent}
      >
        <Box style={[styles.iconContainer, { backgroundColor: feature.gradientColors[0] }]}>
          <Text style={styles.emoji}>{feature.emoji}</Text>
        </Box>
        
        <Box flex={1}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>
        </Box>
      </Box>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  cardContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 193, 7, 0.3)',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emoji: {
    fontSize: 22,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#616161',
    lineHeight: 16,
  },
});

export default KidFeatureCard;