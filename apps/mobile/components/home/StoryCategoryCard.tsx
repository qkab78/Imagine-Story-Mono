import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';

interface StoryCategoryCardProps {
  title: string;
  emoji: string;
  backgroundColor: string; // Changed to accept hex color values
  onPress: () => void;
}

const StoryCategoryCard: React.FC<StoryCategoryCardProps> = ({
  title,
  emoji,
  backgroundColor,
  onPress,
}) => {
  const theme = useTheme<Theme>();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    rotation.value = withSequence(
      withTiming(-2, { duration: 100 }),
      withTiming(2, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Box
          borderRadius="l"
          padding="m"
          alignItems="center"
          justifyContent="center"
          width={120}
          height={120}
          style={[
            styles.card,
            { 
              backgroundColor: backgroundColor,
              shadowColor: theme.colors.black 
            }
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
          <Text 
            variant="body" 
            textAlign="center" 
            fontSize={12}
            fontWeight="600"
            numberOfLines={2}
          >
            {title}
          </Text>
        </Box>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
});

export default StoryCategoryCard;