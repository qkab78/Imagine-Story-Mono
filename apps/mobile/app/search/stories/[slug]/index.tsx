import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import { useEffect } from 'react'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { getStoryBySlug } from '@/api/stories'
import { useNavigation } from '@react-navigation/native'

import Animated from 'react-native-reanimated'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import React from 'react'
import { CircleX } from 'lucide-react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '@/config/theme'

const { width, height } = Dimensions.get('window')

const StoryModal = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const theme = useTheme<Theme>();
  const { slug } = useLocalSearchParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug as string),
  })

  useEffect(() => {
    navigation.setOptions({ headerBackTitle: 'Retour', title: '' });
  }, [navigation]);

  return (
    <Box position={"relative"} height={height}>
      <CircleX
        size={24}
        color={theme.colors.black}
        onPress={() => router.back()}
        style={{ position: 'absolute', top: 50, right: 20, zIndex: 1000 }}
      />
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
              <Text variant={"subTitle"} textTransform={"uppercase"}>{data.title}</Text>
              <Text variant="body">{data.synopsis}</Text>
            </Box>

            <Link href={`/search/stories/${slug}/read`} asChild>
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

export default StoryModal

const styles = StyleSheet.create({})