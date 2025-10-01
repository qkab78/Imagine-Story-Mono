import React, { useCallback } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  StatusBar,
  Platform,
  Dimensions,
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import WelcomeHeader from '@/components/home/WelcomeHeader';
import ActionCard from '@/components/home/ActionCard';
import RecentStoriesSection from '@/components/home/RecentStoriesSection';

// Hooks
import { useHomeScreen } from '@/hooks/useHomeScreen';

// Types
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();
  const { 
    user, 
    recentStories, 
    isLoading,
    isRefreshing, 
    refreshData,
    markStoryAsRead
  } = useHomeScreen();

  // Navigation handlers
  const handleCreateStory = useCallback(() => {
    router.push('/stories/creation/hero-selection');
  }, [router]);

  const handleReadStories = useCallback(() => {
    router.push('/search');
  }, [router]);

  const handleStoryPress = useCallback((storyId: string) => {
    router.push(`/stories/${storyId}`);
    markStoryAsRead(storyId);
  }, [router, markStoryAsRead]);

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
            <ActivityIndicator size="large" color="#FF6B9D" />
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
              tintColor="#FF6B9D"
              colors={['#FF6B9D']}
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
          
          {/* Recent Stories */}
          <RecentStoriesSection
            stories={recentStories}
            onStoryPress={handleStoryPress}
            isLoading={false}
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
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default HomeScreen;