import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform,
  View,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import WelcomeHeader from '@/components/home/WelcomeHeader';
import ActionCard from '@/components/home/ActionCard';
import RecentStoriesSection from '@/components/home/RecentStoriesSection';
import Text from '@/components/ui/Text';

// Hooks
import { useLatestStories } from '@/features/stories/hooks/useStoryList';
import useAuthStore from '@/store/auth/authStore';

// Types
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch stories using clean architecture hook
  const { data: stories = [], isLoading, refetch } = useLatestStories();

  // Refresh handler
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  // Navigation handlers
  const handleCreateStory = useCallback(() => {
    router.push('/stories/creation/welcome');
  }, [router]);

  const handleReadStories = useCallback(() => {
    router.push('/search');
  }, [router]);

  const handleStoryPress = useCallback((storyId: string) => {
    router.push(`/stories/${storyId}`);
  }, [router]);

  // Loading state
  if (isLoading || !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* @ts-ignore */}
        <LinearGradient
          colors={['#FFF8E1', '#FFE0F0']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryPink} />
            <Text style={styles.loadingText}>Chargement de tes histoires...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={Platform.OS === 'android'} 
      />
      
      {/* @ts-ignore */}
      <LinearGradient
        colors={['#FFF8E1', '#FFE0F0']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      > 
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshData}
              tintColor={colors.primaryPink}
              colors={[colors.primaryPink]}
            />
          }
        >
          {/* Welcome Header */}
          <WelcomeHeader user={user} />
          
          {/* Action Cards */}
          <ActionCard
            title="Créer une histoire"
            description="Invente une nouvelle aventure magique"
            icon="✨"
            iconGradient={['#FF6B9D', '#FFB74D']}
            onPress={handleCreateStory}
            testID="create-story-card"
          />
          
          <ActionCard
            title="Lire une histoire"
            description="Découvre tes histoires préférées"
            icon="📖"
            iconGradient={['#2196F3', '#03DAC6']}
            onPress={handleReadStories}
            testID="read-stories-card"
          />
          
          {/* Recent Stories - now receiving domain entities */}
          <RecentStoriesSection
            stories={stories}
            onStoryPress={handleStoryPress}
            isLoading={isLoading}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600',
    color: colors.safetyGreen,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default HomeScreen;