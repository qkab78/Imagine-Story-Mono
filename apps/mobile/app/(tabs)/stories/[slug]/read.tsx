import { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { getStoryBySlug } from '@/api/stories'
import { splitChapters } from '@/utils/story.utils'
import { Image, ScrollView, View } from 'tamagui'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'

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
    <ScrollView ref={scrollViewRef} style={{ flex: 1, }}>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error fetching story</Text>}

      <Box justifyContent={'space-between'} alignItems={'center'} gap={'m'} marginTop={"l"}>
        <Text variant={"title"}>{`${data?.title?.trim()}`}</Text>
        <Image source={{ uri: data?.cover_image }} style={{ width: '100%', height: 200 }} />
        <Box padding={"s"}>
          {chapters.map((currentChapter) => {
            return (
              <View key={currentChapter.title} style={{ width: '100%', padding: 10, gap: 10 }}>
                <Text variant={"subTitle"}>{`${currentChapter.title?.trim()}`}</Text>
                <Text variant={"body"} style={{ fontSize: 14, lineHeight: 34, textAlign: 'justify' }}>{currentChapter.content}</Text>
              </View>
            )
          })}

          {conclusion && (
            <View style={{ width: '100%', padding: 10, gap: 10 }}>
              <Text variant={"subTitle"}>Conclusion</Text>
              <Text variant={"body"} style={{ fontSize: 14, lineHeight: 34, textAlign: 'justify' }}>{conclusion}</Text>
            </View>
          )}
        </Box>
      </Box>
      <Box>

      </Box>
      {/* {chapters.map((currentChapter) => {
        return (
          <View key={currentChapter.title} style={{ width: '100%', padding: 10, gap: 10 }}>
            <Text>{`${currentChapter.title?.trim()}`}</Text>
            <Text style={{ fontSize: 18, lineHeight: 34, textAlign: 'justify' }}>{currentChapter.content}</Text>
          </View>
        )
      })} */}
      {/* {conclusion && (
        <View style={{ width: '100%', padding: 10, gap: 10 }}>
          <Text>Conclusion</Text>
          <Text style={{ fontSize: 18, lineHeight: 34, textAlign: 'justify' }}>{conclusion}</Text>
        </View>
      )} */}
    </ScrollView>
  )
}

export default ChapterPage