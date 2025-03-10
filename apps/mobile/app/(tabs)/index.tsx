import { ActivityIndicator, Image, ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getStories } from '@/api/stories'
import useAuthStore from '@/store/auth/authStore'
import { Stories } from '@imagine-story/api/types/db'
import { Link } from 'expo-router'
import StoryList from '@/components/stories/StoryList'
import { ScrollView } from 'tamagui'

const renderStory = ({ item }: ListRenderItemInfo<Stories>) => {
  return (
    <Link href={{
      pathname: '/(tabs)/stories/[slug]',
      params: { slug: item.slug },
    }} asChild push>
      <Pressable>
        <View style={{ padding: 20, gap: 1, display: 'flex', alignItems: 'flex-start' }}>
          <Image
            source={{ uri: item.cover_image }}
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={{ color: 'blue' }}>Lire</Text>
        </View>
      </Pressable>
    </Link>
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
      {isLoading && <ActivityIndicator size={'large'} />}
      {isError && <Text>Error fetching stories</Text>}
      <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
        <StoryList stories={stories ?? []} />

        {/* <FlatList
          data={stories}
          renderItem={renderStory}
          // @ts-ignore
          keyExtractor={item => item.id}
        /> */}
      </ScrollView>
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