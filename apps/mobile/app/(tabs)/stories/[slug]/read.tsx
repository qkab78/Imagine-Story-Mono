import { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { getStoryBySlug } from '@/api/stories'
import { splitChapters } from '@/utils/story.utils'
import { ScrollView, Text, View } from 'tamagui'

const ChapterPage = () => {
  const [chapters, setChapters] = useState<Array<{ title: string, content: string }>>([])
  const [conclusion, setConclusion] = useState<string | undefined>(undefined)
  const scrollViewRef = useRef<ScrollView>(null);

  const navigation = useNavigation();
  const { slug } = useLocalSearchParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug as string),
  })

  useEffect(() => {
    navigation.setOptions({ headerBackTitle: 'Retour', title: data?.title || '' });
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }, [navigation, data]);

  useEffect(() => {
    if (data) {
      const payload = splitChapters(data.content);
      setChapters(payload.chapters);
      setConclusion(payload.conclusion);
    }
  }, [data]);

  return (
    <ScrollView ref={scrollViewRef} style={{ padding: 10, flex: 1, }}>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error fetching story</Text>}

      {chapters.map((currentChapter) => {
        return (
          <View key={currentChapter.title} style={{ width: '100%', padding: 10, gap: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>{`${currentChapter.title?.trim()}`}</Text>
            <Text style={{ fontSize: 18, lineHeight: 34, textAlign: 'justify' }}>{currentChapter.content}</Text>
          </View>
        )
      })}
      {conclusion && (
        <View style={{ width: '100%', padding: 10, gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>Conclusion</Text>
          <Text style={{ fontSize: 18, lineHeight: 34, textAlign: 'justify' }}>{conclusion}</Text>
        </View>
      )}
    </ScrollView>
  )
}

export default ChapterPage