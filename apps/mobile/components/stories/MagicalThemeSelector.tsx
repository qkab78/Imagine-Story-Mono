import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import { Control, Controller } from 'react-hook-form';
import { THEMES } from '@/api/stories';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';

interface MagicalThemeSelectorProps {
  control: Control<any>;
  name: string;
}

const MagicalThemeSelector: React.FC<MagicalThemeSelectorProps> = ({
  control,
  name,
}) => {
  const theme = useTheme<Theme>();
  
  // Map THEMES to include emojis and colors for magical display
  const getThemeEmoji = (value: string) => {
    const emojiMap: Record<string, string> = {
      'fantasy': '🧙‍♀️',
      'science-fiction': '🚀',
      'historical': '🏰',
      'detective': '🔍',
      'adventure': '🗺️',
      'comedy': '😄',
      'fable': '📚',
      'myth': '⚡',
      'legend': '🛡️',
    };
    return emojiMap[value] || '✨';
  };

  const getThemeColor = (index: number) => {
    const colors = [
      '#FFD6E8', // Soft Pink
      '#D5E8FF', // Sky Blue
      '#D5FFE8', // Mint Green
      '#E8D5FF', // Magic Purple
      '#FFE5D5', // Sunset Orange
      '#F0E6FF', // Lavender
      '#FFF0D5', // Cream
      '#D5F0FF', // Light Blue
      '#E8FFD5', // Light Green
    ];
    return colors[index % colors.length];
  };

  const themesWithDisplay = THEMES.map((theme, index) => ({
    ...theme,
    emoji: getThemeEmoji(theme.value),
    color: getThemeColor(index),
  }));

  const ThemeCard = ({ themeItem, isSelected, onPress }: any) => {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    const handlePress = () => {
      scale.value = withSequence(
        withSpring(0.95),
        withSpring(1)
      );
      rotation.value = withSequence(
        withTiming(5, { duration: 100 }),
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      onPress();
    };

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    }));

    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          <Box
            borderRadius="l"
            padding="m"
            alignItems="center"
            justifyContent="center"
            width={100}
            height={100}
            style={[
              styles.themeCard,
              { 
                backgroundColor: themeItem.color,
                shadowColor: theme.colors.black,
                borderWidth: isSelected ? 3 : 0,
                borderColor: isSelected ? theme.colors.yellow : 'transparent',
              }
            ]}
          >
            <Text style={styles.emoji}>{themeItem.emoji}</Text>
            <Text 
              variant="body" 
              textAlign="center" 
              fontSize={11}
              fontWeight="600"
              numberOfLines={1}
            >
              {themeItem.label}
            </Text>
          </Box>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Box>
          <Text variant="subTitle" marginBottom="m" textAlign="center" color="textPrimary">
            ✨ Choisis ton univers magique ✨
          </Text>
          <Box 
            flexDirection="row" 
            flexWrap="wrap" 
            justifyContent="center" 
            gap="m"
          >
            {themesWithDisplay.map((themeItem) => (
              <ThemeCard
                key={themeItem.value}
                themeItem={themeItem}
                isSelected={value === themeItem.value}
                onPress={() => onChange(themeItem.value)}
              />
            ))}
          </Box>
        </Box>
      )}
    />
  );
};

const styles = StyleSheet.create({
  themeCard: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 6,
  },
});

export default MagicalThemeSelector;