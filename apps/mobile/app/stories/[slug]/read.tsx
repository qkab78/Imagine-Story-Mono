import { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { getStoryBySlug } from '@/api/stories'
import { splitChapters } from '@/utils/story.utils'
import { ScrollView, Dimensions, StyleSheet } from 'react-native'
import Text from '@/components/ui/Text'
import ReadStory from '@/components/stories/ReadStory'

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.07;
const styles = StyleSheet.create({
  container: {
    marginTop: HEADER_HEIGHT,
    width,
    alignSelf: "center",
    position: "relative",
  }
})

const ChapterPage = () => {
  const [chapters, setChapters] = useState<Array<{ title: string, content: string }>>([])
  const [conclusion, setConclusion] = useState<string>('')
  const scrollViewRef = useRef<ScrollView>(null);

  const navigation = useNavigation();
  const { slug } = useLocalSearchParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug as string),
  })

  useEffect(() => {
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
    <ScrollView ref={scrollViewRef} style={styles.container}>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error fetching story</Text>}
      {data && (
        <ReadStory story={data} chapters={chapters} conclusion={conclusion} />
      )}
    </ScrollView>
  )
}

export default ChapterPage