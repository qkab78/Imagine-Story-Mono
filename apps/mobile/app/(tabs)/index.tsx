import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getLatestStories, getStoriesByAuthenticatedUserId, THEMES } from '@/api/stories';
import useAuthStore from '@/store/auth/authStore';
import StoryList from '@/components/stories/StoryList';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';
import { router } from 'expo-router';
import { BookPlus, Sparkles, Heart, Crown } from 'lucide-react-native';
import StoryCategoryCard from '@/components/home/StoryCategoryCard';
import MagicalButton from '@/components/home/MagicalButton';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const MagicalHeader = () => {
  const floatingAnimation = useSharedValue(0);
  
  useEffect(() => {
    floatingAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatingAnimation.value, [0, 1], [-5, 5]);
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Box alignItems="center" paddingVertical="xl">
      <Animated.View style={animatedStyle}>
        <Text style={styles.magicalTitle}>✨ Imagine Story ✨</Text>
      </Animated.View>
      <Text style={styles.subtitle}>Créons des histoires magiques ensemble!</Text>
    </Box>
  );
};

const StoryCategories = () => {
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

  const categoriesWithDisplay = THEMES.map((theme, index) => ({
    ...theme,
    emoji: getThemeEmoji(theme.value),
    color: getThemeColor(index),
  }));

  return (
    <Box paddingHorizontal="m">
      <Text variant="subTitle" textAlign="center" marginBottom="m" color="textPrimary">
        Choisis ton univers magique
      </Text>
      <Box 
        flexDirection="row" 
        flexWrap="wrap" 
        justifyContent="center" 
        gap="m"
      >
        {categoriesWithDisplay.map((category, index) => (
          <StoryCategoryCard
            key={category.value}
            title={category.label}
            emoji={category.emoji}
            backgroundColor={category.color}
            onPress={() => {
              router.push(`/(tabs)/stories/create?theme=${category.value}`);
            }}
          />
        ))}
      </Box>
    </Box>
  );
};



const MagicalHomeScreen = () => {
  const theme = useTheme<Theme>();
  const token = useAuthStore(state => state.token!);
  
  const { data: latestStories, isLoading: isLatestStoriesLoading } = useQuery({
    queryKey: ['latestStories', token],
    queryFn: ({ queryKey }) => getLatestStories(queryKey[1]),
    enabled: token !== undefined,
  });
  
  const { data: authenticatedUserStories, isLoading: isAuthenticatedUserStoriesLoading } = useQuery({
    queryKey: ['authenticatedUserStories', token],
    queryFn: ({ queryKey }) => getStoriesByAuthenticatedUserId(queryKey[1]),
    enabled: token !== undefined,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F0E6FF' }]}>
      <Box style={styles.gradient}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MagicalHeader />
          
          {/* Main Create Story Button */}
          <Box alignItems="center" marginVertical="xl">
            <MagicalButton
              title="Créer une Histoire"
              subtitle="Laisse ton imagination s'envoler!"
              onPress={() => router.push('/stories/create')}
              size="large"
              icon={<Sparkles size={24} color="white" />}
            />
          </Box>

          {/* Story Categories */}
          <StoryCategories />

          {/* My Stories Section */}
          {authenticatedUserStories && authenticatedUserStories.length > 0 && (
            <Box paddingHorizontal="m" marginTop="xl">
              <Box flexDirection="row" alignItems="center" justifyContent="center" marginBottom="m">

                <Text variant="subTitle" marginLeft="s" textAlign="center">
                  Mes Histoires Magiques
                </Text>
              </Box>
              <StoryList stories={authenticatedUserStories} speed={0} />
            </Box>
          )}

          {/* Latest Stories */}
          {latestStories && latestStories.length > 0 && (
            <Box paddingHorizontal="m" marginTop="xl" marginBottom="xl">
              <Box flexDirection="row" alignItems="center" justifyContent="center" marginBottom="m">
                <Text variant="subTitle" marginLeft="s" textAlign="center">
                  Nouvelles Histoires
                </Text>
              </Box>
              <StoryList stories={latestStories} />
            </Box>
          )}

          {/* Secondary Action - My Stories */}
          {(!authenticatedUserStories || authenticatedUserStories.length === 0) && (
            <Box alignItems="center" marginTop="l">
              <MagicalButton
                title="Mes Histoires"
                onPress={() => router.push('/(protected)/stories')}
                size="medium"
                icon={<BookPlus size={20} color="white" />}
              />
            </Box>
          )}
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  magicalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B46C1',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B5CF6',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
});

export default MagicalHomeScreen;