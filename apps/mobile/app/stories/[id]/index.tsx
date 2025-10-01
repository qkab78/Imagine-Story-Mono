import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { getStoryById } from '@/api/stories'
import { StoryPresentationScreen } from '@/screens/story'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'

const StoryScreen = () => {
  const { id } = useLocalSearchParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', id],
    queryFn: () => getStoryById(id as string),
  })

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Error fetching story</Text>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>No story found</Text>
      </Box>
    )
  }
  
  return <StoryPresentationScreen story={data} />
}

export default StoryScreen