import { ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getStories, THEMES } from '@/api/stories'
import useAuthStore from '@/store/auth/authStore'
import StoryList from '@/components/stories/StoryList'

import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import Container from '@/components/ui/Container'
import Header from '@/components/ui/Header'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from '@shopify/restyle'
import { Theme } from '@/config/theme'
import { useState } from 'react'
import { ScrollView } from 'tamagui'
import { Link } from 'expo-router'
import { Stories } from '@imagine-story/api/types/db'

const { width, height } = Dimensions.get('window')
const ITEM_WIDTH = width * 0.8

const Categories = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined)
  const theme = useTheme<Theme>();

  return (
    <Box flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"} gap={"m"} paddingVertical={"m"}>
      <FlatList
        data={THEMES}
        contentContainerStyle={{ flexDirection: "row", gap: theme.spacing.m }}
        renderItem={({ item }) => {
          const activeBackgroundColor = activeCategoryId === item.id ? "secondaryCardBackground" : "mainBackground"
          const activeBorderColor = activeCategoryId === item.id ? "secondaryCardBackground" : "textPrimary"
          return (
            <TouchableOpacity onPress={() => setActiveCategoryId(item.id)}>
              <Box backgroundColor={activeBackgroundColor} padding={"s"} borderRadius={"s"} opacity={0.9} width={"auto"} borderWidth={1} borderColor={activeBorderColor}>
                <Text variant={"body"} fontSize={14}>{item.label}</Text>
              </Box>
            </TouchableOpacity>
          )
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </Box>
  )
}

type ActiveStoryProps = { story: Stories }

const ActiveStory = ({ story }: ActiveStoryProps) => {
  return (
    <Box backgroundColor={"secondaryCardBackground"} borderRadius={"m"} opacity={0.9} width={ITEM_WIDTH} padding={"m"} justifyContent={"center"}>
      <Text variant={"subTitle"}>{story.title}</Text>
      <Box borderWidth={1} borderColor={"textSecondary"} borderRadius={"s"} padding={"m"} marginTop={"m"}>
        <Link href={`/(tabs)/stories/${story.slug}`} asChild>
          <TouchableOpacity style={{ width: "100%" }}>
            <Text variant={"buttonLabel"} textAlign={"center"}>Continue story</Text>
          </TouchableOpacity>
        </Link>
      </Box>
    </Box>
  )
}

const Tab = () => {
  const theme = useTheme<Theme>();
  const token = useAuthStore(state => state.token!);
  const { data: stories, isLoading, isError } = useQuery({
    queryKey: ['stories', token],
    queryFn: ({ queryKey }) => getStories(queryKey[1]),
  })
  // Get current active story from stories store
  const activeStory = stories?.[0]

  return (
    <ScrollView>
      <Box height={height} justifyContent="center" alignItems="center" gap="xl" backgroundColor={"mainBackground"}>
        {isLoading && <ActivityIndicator size={'large'} />}
        {isError && <Text>Error fetching stories</Text>}
        <Container>
          <Header />
          <Categories />

          {activeStory && <ActiveStory story={activeStory} />}
          <Box justifyContent="center" alignItems="center" gap="m">
            <Text variant="title">Latest stories</Text>
            <StoryList stories={stories ?? []} />
          </Box>
        </Container>
      </Box>
    </ScrollView>
  )
}

export default Tab