import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import { useStoryById } from '@/features/stories/hooks/useStoryById'
import { StoryDetail } from '@/components/organisms/story/StoryDetail'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import { colors } from '@/theme/colors'

const StoryScreen = () => {
  const { id } = useLocalSearchParams()

  // Use the useStoryById hook which returns domain entities
  const { data: story, isLoading, error } = useStoryById(id as string)

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={colors.accentBlue} />
        <Text style={styles.loadingText}>Chargement de l'histoire...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text style={styles.errorText}>Erreur lors du chargement de l'histoire</Text>
      </Box>
    )
  }

  if (!story) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text style={styles.errorText}>Histoire introuvable</Text>
      </Box>
    )
  }

  // Use the StoryDetail organism with domain entity
  return <StoryDetail story={story} />
}

const styles = StyleSheet.create({
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
})

export default StoryScreen
