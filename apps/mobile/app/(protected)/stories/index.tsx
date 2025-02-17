import { ActivityIndicator, FlatList, Image, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStories } from '@/api/stories'
import useAuthStore from '@/store/auth/authStore'
import { Stories } from '@imagine-story/api/types/db'
import { Link } from 'expo-router'
import { CreatStoryForm } from '@/components/stories/CreateStoryForm'

const renderStory = ({ item }: ListRenderItemInfo<Stories>) => {

  return (
    <View style={{ padding: 20, gap: 1 }}>
      {/* <Image
        source={{ uri: item.cover_image }}
        style={{ width: 200, height: 200 }}
      /> */}
      <Text style={styles.title}>{item.title}</Text>
      <Link href={{
        pathname: '/stories/[slug]',
        params: { slug: item.slug }
      }}>
        <Text style={{ color: 'blue' }}>Read more</Text>
      </Link>
    </View>
  )
}

const StoriesScreen = () => {
  const token = useAuthStore(state => state.token!);

  const { data: stories, isLoading, isError } = useQuery({
    queryKey: ['stories', token],
    queryFn: ({ queryKey }) => getStories(queryKey[1]),
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest stories</Text>
      {isLoading && <ActivityIndicator size={'large'} />}
      {isError && <Text>Error fetching stories</Text>}
      <FlatList
        data={stories}
        renderItem={renderStory}
        // @ts-ignore
        keyExtractor={item => item.id}
      />

      <View style={{ padding: 20, borderTopColor: '#dde3fe', borderWidth: 1, gap: 3 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Add a story</Text>
        <CreatStoryForm />
      </View>
    </View>
  )
}

export default StoriesScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
})