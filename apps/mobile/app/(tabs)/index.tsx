import { ActivityIndicator, FlatList, Image, ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStories } from '@/api/stories'
import useAuthStore from '@/store/auth/authStore'
import { Stories } from '@imagine-story/api/types/db'
import { Link } from 'expo-router'

const renderStory = ({ item }: ListRenderItemInfo<Stories>) => {
  return (
    <View style={{ padding: 20, gap: 1, display: 'flex', alignItems: 'flex-start' }}>
      <Image
        source={{ uri: item.cover_image }}
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Link href={{
        pathname: '/(tabs)/stories/[slug]',
        params: { slug: item.slug },
      }} asChild push>
        <Pressable>
          <Text style={{ color: 'blue' }}>Lire</Text>
        </Pressable>
      </Link>
    </View>
  )
}

const Tab = () => {
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
      <View style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 40 }}>
        <FlatList
          data={stories}
          renderItem={renderStory}
          // @ts-ignore
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  )
}

export default Tab

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})