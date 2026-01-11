import { StyleSheet, ActivityIndicator, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useStoryDetail } from '@/features/stories/hooks/useStoryDetail'
import { StoryDetail } from '@/components/organisms/story/StoryDetail'
import Text from '@/components/ui/Text'
import { colors } from '@/theme/colors'

const StoryScreen = () => {
  const router = useRouter();
  const { slug } = useLocalSearchParams()

  // Use the useStoryDetail hook which returns domain entities
  const { data: story, isLoading, error } = useStoryDetail(slug as string)

  useEffect(() => {
    if (story) {
      router.setParams({
        title: story.title || '',
      });
    }
  }, [router, story?.title, slug]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentBlue} />
        <Text style={styles.loadingText}>Chargement de l'histoire...</Text>
      </View>
    )
  }

  if (error || !story) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur lors du chargement de l'histoire</Text>
      </View>
    )
  }

  // Use the StoryDetail organism with domain entity
  return <StoryDetail story={story} />
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
})

export default StoryScreen
