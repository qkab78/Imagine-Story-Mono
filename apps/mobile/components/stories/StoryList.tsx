
import React from 'react'
import { Stories } from '@imagine-story/api/types/db'
import { ScrollView, View, XStack, YStack } from 'tamagui'
import StoryCard from './StoryCard'
import { Link } from 'expo-router'
import { FlatList } from 'react-native-gesture-handler'

type StoryListProps = { stories: Stories[] }

const StoryList = (props: StoryListProps) => {
  const { stories } = props

  return (
    <FlatList
      data={stories}
      renderItem={({ item }) => <StoryCard key={String(item.id)} story={item} />}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, paddingVertical: 20 }}
    />
  )
}

export default StoryList