import { ActivityIndicator, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getStories } from '@/api/stories'
import useAuthStore from '@/store/auth/authStore'
import StoryList from '@/components/stories/StoryList'

import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import Container from '@/components/ui/Container'
import Header from '@/components/ui/Header'

const Tab = () => {
  const token = useAuthStore(state => state.token!);
  const { data: stories, isLoading, isError } = useQuery({
    queryKey: ['stories', token],
    queryFn: ({ queryKey }) => getStories(queryKey[1]),
  })

  return (
    <Box flex={1} justifyContent="center" alignItems="center" gap="xl" backgroundColor={"mainBackground"}>
      {isLoading && <ActivityIndicator size={'large'} />}
      {isError && <Text>Error fetching stories</Text>}
      <Container>
        <Header />

        <Box justifyContent="center" alignItems="center" gap="m">
          <Text variant="title">Latest stories</Text>
          <StoryList stories={stories ?? []} />
        </Box>
      </Container>
    </Box>
  )
}

export default Tab