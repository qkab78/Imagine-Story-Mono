import React from 'react';
import { Stories } from '@imagine-story/api/types/db';
import { Card } from 'tamagui';
import { Link } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';
import Text from '../ui/Text';
import Box from '../ui/Box';
import { Sparkles, Heart } from 'lucide-react-native';

type StoryCardProps = { 
  story: Pick<Stories, 'id' | 'slug' | 'title' | 'synopsis' | 'cover_image'>;
  index?: number;
}

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.42;
const ITEM_HEIGHT = height * 0.25;
const IMAGE_HEIGHT = ITEM_HEIGHT * 0.7;

const StoryCard = (props: StoryCardProps) => {
  const { story, index = 0 } = props;
  const { title, cover_image, slug, id } = story;
  const theme = useTheme<Theme>();
  
  const scale = useSharedValue(1);
  const sparkleRotation = useSharedValue(0);
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    sparkleRotation.value = withSequence(
      withTiming(360, { duration: 300 }),
      withTiming(0, { duration: 0 })
    );
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));
  
  // Different magical colors for cards
  const cardColors = [
    '#FFD6E8', // softPink
    '#D5E8FF', // skyBlue
    '#D5FFE8', // mintGreen
    '#E8D5FF', // magicPurple
    '#FFE5D5', // sunsetOrange
    '#F0E6FF', // lavender
  ];
  
  const cardColor = cardColors[index % cardColors.length];
  
  return (
    <Link href={`/stories/${slug}`} asChild>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Animated.View style={[animatedCardStyle, { margin: 8 }]}>
          <Box
            width={ITEM_WIDTH}
            height={ITEM_HEIGHT}
            borderRadius="l"
            style={[
              styles.card,
              { 
                backgroundColor: cardColor,
                shadowColor: theme.colors.black 
              }
            ]}
          >
            {/* Sparkle decoration */}
            <Box style={styles.sparkleContainer}>
              <Animated.View style={sparkleStyle}>
                <Sparkles size={16} color={theme.colors.yellow} />
              </Animated.View>
            </Box>
            
            {/* Story Image */}
            <Box style={styles.imageContainer}>
              <Animated.Image
                style={[
                  styles.storyImage,
                  {
                    width: ITEM_WIDTH - 20,
                    height: IMAGE_HEIGHT,
                  }
                ]}
                source={{
                  uri: cover_image
                }}
                sharedTransitionTag={String(id)}
              />
            </Box>
            
            {/* Title Section */}
            <Box style={styles.titleContainer}>
              <Box flexDirection="row" alignItems="center" justifyContent="center">
                <Text 
                  variant="cardTitle" 
                  numberOfLines={2}
                  textAlign="center"
                  fontSize={12}
                  fontWeight="600"
                  color="textPrimary"
                  marginHorizontal="s"
                >
                  {title}
                </Text>
              </Box>
            </Box>
          </Box>
        </Animated.View>
      </TouchableOpacity>
    </Link>
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
    position: 'relative',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  imageContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    alignItems: 'center',
  },
  storyImage: {
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
});

export default StoryCard;