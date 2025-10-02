import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import BackButton from '../ui/BackButton';
import { Story } from '@imagine-story/api/app/stories/entities';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface MagicalStoryHeaderProps {
  story: Story;
}

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.35;

const MagicalStoryHeader: React.FC<MagicalStoryHeaderProps> = ({ story }) => {
  const floatingAnimation = useSharedValue(0);
  const heartBeat = useSharedValue(1);
  
  useEffect(() => {
    floatingAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
    heartBeat.value = withRepeat(
      withTiming(1.2, { duration: 1000 }),
      -1,
      true
    );
  }, []);
  
  const floatingStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatingAnimation.value, [0, 1], [-5, 5]);
    return {
      transform: [{ translateY }],
    };
  });
  
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartBeat.value }],
  }));
  
  return (
    <Box position="relative">
      {/* Back Button */}
      <Box
        position="absolute"
        top={50}
        left={16}
        zIndex={1000}
        style={styles.backButtonContainer}
      >
        <BackButton style={styles.backButton} />
      </Box>
      
      {/* Story Cover and Title */}
      <Box position="relative" height={IMAGE_HEIGHT} width={width}>
        <Animated.Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/images/covers/${story.coverImage}` }}
          style={[
            styles.coverImage,
            { width, height: IMAGE_HEIGHT }
          ]}
        />
        
        {/* Magical Overlay */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          style={styles.titleOverlay}
        >
          <Box alignItems="center" paddingVertical="m">            
            {/* Story Title */}
            <Text 
              variant="title" 
              color="white" 
              textAlign="center"
              fontSize={24}
              fontWeight="bold"
              style={styles.titleText}
              numberOfLines={3}
            >
              {story.title}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  coverImage: {
    resizeMode: 'cover',
  },
  titleOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  titleText: {
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 20,
  },
  decorationContainer: {
    opacity: 0.9,
  },
});

export default MagicalStoryHeader;