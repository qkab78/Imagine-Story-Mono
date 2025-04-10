import { ActivityIndicator, TouchableOpacity } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getLatestStories, getStories, getStoriesByAuthenticatedUserId, THEMES } from '@/api/stories'
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
import { router } from 'expo-router'
import { BookPlus } from 'lucide-react-native'

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
  const { data: authenticatedUserStories, isLoading: isAuthenticatedUserStoriesLoading, isError: isAuthenticatedUserStoriesError } = useQuery({
    queryKey: ['authenticatedUserStories', token],
    queryFn: ({ queryKey }) => getStoriesByAuthenticatedUserId(queryKey[1]),
  })

  const activeStory = useStoryStore(state => state.activeStory)

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.mainBackground, paddingVertical: 20, paddingHorizontal: 10 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box justifyContent="center" alignItems="center" gap="xl">
          <Container>
            <Box marginTop={"xl"} justifyContent="flex-start"  gap="m">
              <Header />
              <Categories />
            </Box>

            {activeStory && <ActiveStory story={activeStory} />}

            <Box gap={"xl"} >
              <Box justifyContent="flex-start" alignItems="flex-start" marginTop={"m"}>
                {isLatestStoriesLoading && <ActivityIndicator size={'large'} />}
                {isLatestStoriesError && <Text>Error fetching latest stories</Text>}
                <Text variant="subTitle" style={{ fontWeight: 'bold' }}>Sorties récentes</Text>
                <StoryList stories={latestStories ?? []} />
              </Box>

              <Box justifyContent="flex-start" alignItems="flex-start" marginTop={"l"}>
                {isAuthenticatedUserStoriesLoading && <ActivityIndicator size={'large'} />}
                {isAuthenticatedUserStoriesError && <Text>Error fetching stories</Text>}
                <Text variant="subTitle" style={{ fontWeight: 'bold' }}>Mes histoires</Text>
                {authenticatedUserStories?.length === 0 ? (
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, padding: 10, borderRadius: 10, marginTop: 10 }} onPress={() => router.push('/(tabs)/stories/create')}>
                    <BookPlus size={24} color={theme.colors.white} />
                    <Text variant="body" color={"white"}>Créer une histoire</Text>
                  </TouchableOpacity>
                ) : (
                  <StoryList stories={authenticatedUserStories ?? []} speed={0} />
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      </ScrollView>
    </View>
  )
}

export default Tab