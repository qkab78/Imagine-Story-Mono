import { ActivityIndicator, TouchableOpacity } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getLatestStories, getStories, THEMES } from '@/api/stories'
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
import { View, ScrollView } from 'tamagui'
import ActiveStory from '@/components/stories/ActiveStory'
import useStoryStore from '@/store/stories/storyStore'

const Categories = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined)
  const theme = useTheme<Theme>();
  const handleSetActiveCategory = (id: number) => {
    if (activeCategoryId === id) {
      setActiveCategoryId(undefined)
      return
    }
    setActiveCategoryId(id)
  }

  return (
    <Box flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"} gap={"m"} paddingVertical={"m"}>
      <FlatList
        data={THEMES}
        contentContainerStyle={{ flexDirection: "row", gap: theme.spacing.m }}
        renderItem={({ item }) => {
          const activeBackgroundColor = activeCategoryId === item.id ? "secondaryCardBackground" : "mainBackground"
          const activeBorderColor = activeCategoryId === item.id ? "secondaryCardBackground" : "textPrimary"
          return (
            <TouchableOpacity onPress={() => handleSetActiveCategory(item.id)}>
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



const Tab = () => {
  const theme = useTheme<Theme>();
  const token = useAuthStore(state => state.token!);
  const { data: latestStories, isLoading: isLatestStoriesLoading, isError: isLatestStoriesError } = useQuery({
    queryKey: ['latestStories', token],
    queryFn: ({ queryKey }) => getLatestStories(queryKey[1]),
  })
  const { data: stories, isLoading, isError } = useQuery({
    queryKey: ['stories', token],
    queryFn: ({ queryKey }) => getStories(queryKey[1]),
  })

  const activeStory = useStoryStore(state => state.activeStory)

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.mainBackground, paddingVertical: 20, paddingHorizontal: 10 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box justifyContent="center" alignItems="center" gap="xl">
          <Container>
            <Box marginTop={"xl"} flexDirection={'row'} paddingHorizontal={"l"} justifyContent="flex-start" alignItems="center" gap="m">
              <Header />
              <Categories />
            </Box>

            {activeStory && <ActiveStory story={activeStory} />}

            <Box gap={"xl"} >
              <Box justifyContent="flex-start" alignItems="flex-start" marginTop={"m"}>
                {isLatestStoriesLoading && <ActivityIndicator size={'large'} />}
                {isLatestStoriesError && <Text>Error fetching latest stories</Text>}
                <Text variant="subTitle" style={{ fontWeight: 'bold'}}>Sorties récentes</Text>
                <StoryList stories={latestStories ?? []} />
              </Box>

              <Box justifyContent="flex-start" alignItems="flex-start" marginTop={"l"}>
                {isLoading && <ActivityIndicator size={'large'} />}
                {isError && <Text>Error fetching stories</Text>}
                <Text variant="subTitle" style={{ fontWeight: 'bold'}}>Mes histoires</Text>
                <StoryList stories={stories ?? []} speed={0} />
              </Box>
            </Box>
          </Container>
        </Box>
      </ScrollView>
    </View>
  )
}

export default Tab