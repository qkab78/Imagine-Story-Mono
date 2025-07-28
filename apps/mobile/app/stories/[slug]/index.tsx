import { Dimensions, TouchableOpacity } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { getStoryBySlug } from '@/api/stories'

import Animated from 'react-native-reanimated'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import React from 'react'
import { Theme } from '@/config/theme'
import { useTheme } from '@shopify/restyle'
import BackButton from '@/components/ui/BackButton'

const { width, height } = Dimensions.get('window')

const StoryScreen = () => {
  const theme = useTheme<Theme>();
  const { slug } = useLocalSearchParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug as string),
  })

  return (
    <Box position={"relative"} height={height}>
      <BackButton />
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error fetching story</Text>}
      {!data && <Text>No story found</Text>}

      {data && (
        <>
          <Animated.Image
            source={{ uri: data.cover_image }}
            style={{ width, height: height * 0.6 }}
          />

          <Box position={"absolute"} bottom={0} gap={"l"} width={width} borderRadius={"l"} backgroundColor={"mainBackground"} padding={"m"} height={height * 0.6}>
            <Box gap={"l"}>
              <Text variant={"title"} textTransform={"uppercase"}>{data.title}</Text>
              <Box gap={"s"}>
                <Text variant="subTitle" style={{ fontSize: 18 }}>Synopsis</Text>
                <Text variant="body">{data.synopsis}</Text>
              </Box>
            </Box>

            <Link href={`/stories/${slug}/read`} asChild>
              <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 10, borderRadius: 10 }}>
                <Text variant="body" textTransform={"uppercase"} color={"white"} textAlign={"center"}>Lire</Text>
              </TouchableOpacity>
            </Link>
          </Box>
        </>
      )}
    </Box>
  )
}

export default StoryScreen