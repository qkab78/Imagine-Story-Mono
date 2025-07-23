import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import { BookOpen, Sparkles } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface MagicalChapterProps {
  chapter: {
    title: string;
    content: string;
  };
  index: number;
}

const MagicalChapter: React.FC<MagicalChapterProps> = ({ chapter, index }) => {
  const theme = useTheme<Theme>();
  const [isExpanded, setIsExpanded] = useState(index === 0); // First chapter expanded by default
  const scale = useSharedValue(1);
  const sparkleRotation = useSharedValue(0);
  
  // Single beautiful color for all chapters
  const chapterColor = '#D5E8FF'; // Soft Sky Blue - perfect for magical stories
  
  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    sparkleRotation.value = withSequence(
      withTiming(360, { duration: 300 }),
      withTiming(0, { duration: 0 })
    );
    setIsExpanded(!isExpanded);
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));
  
  return (
    <Animated.View style={[animatedStyle, { marginVertical: 8 }]}>
      <Box
        borderRadius="l"
        marginHorizontal="m"
        style={[
          styles.chapterContainer,
          { 
            backgroundColor: chapterColor,
            shadowColor: theme.colors.black 
          }
        ]}
      >
        {/* Chapter Header */}
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          <Box 
            flexDirection="row" 
            alignItems="center" 
            justifyContent="space-between"
            padding="m"
          >
            <Box flexDirection="row" alignItems="center" flex={1}>
              <Box 
                backgroundColor="white"
                borderRadius="m"
                padding="s"
                marginRight="m"
                style={styles.iconContainer}
              >
                <BookOpen size={20} color={theme.colors.textPrimary} />
              </Box>
              <Text 
                variant="subTitle" 
                fontSize={16} 
                fontWeight="bold"
                color="textPrimary"
                numberOfLines={2}
                flex={1}
              >
                {chapter.title}
              </Text>
            </Box>
            
            <Animated.View style={sparkleStyle}>
              <Sparkles 
                size={24} 
                color={isExpanded ? theme.colors.yellow : theme.colors.textPrimary} 
              />
            </Animated.View>
          </Box>
        </TouchableOpacity>
        
        {/* Chapter Content */}
        {isExpanded && (
          <Box 
            backgroundColor="white"
            margin="s"
            padding="m"
            borderRadius="m"
            style={styles.contentContainer}
          >
            <Text 
              variant="body" 
              fontSize={15}
              lineHeight={24}
              textAlign="justify"
              color="textPrimary"
            >
              {chapter.content}
            </Text>
          </Box>
        )}
      </Box>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chapterContainer: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contentContainer: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default MagicalChapter;