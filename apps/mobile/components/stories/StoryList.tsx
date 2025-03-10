
import React from 'react'
import { Stories } from '@imagine-story/api/types/db'
import { ScrollView, View, XStack, YStack } from 'tamagui'
import StoryCard from './StoryCard'
import { Link } from 'expo-router'

type StoryListProps = { stories: Stories[] }

const StoryList = (props: StoryListProps) => {
  const { stories } = props

  return (
    <YStack gap={20} display='flex' flexDirection='row' flexWrap='wrap' justifyContent='center'>
      {stories.map((story) => <StoryCard key={String(story.id)} story={story} />)}
    </YStack>
  )
}

export default StoryList