import { Dimensions, StyleSheet } from 'react-native'
import { useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { getStoryBySlug } from '@/api/stories'
import { useNavigation } from '@react-navigation/native'

import Animated from 'react-native-reanimated'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import Button from '@/components/ui/Button'
import React from 'react'

const { width, height } = Dimensions.get('window')

const StoryScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { slug } = useLocalSearchParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug as string),
  })

  useEffect(() => {
    navigation.setOptions({ headerBackTitle: 'Retour', title: '' });
  }, [navigation]);

  const goToStory = () => {
    router.navigate(`/(tabs)/stories/${slug}/read`);
  }

  return (
    <Box position={"relative"} height={height}>
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

            <Button label='Lire' bgColor='primary' textColor='white' onPress={goToStory} />
          </Box>
        </>
      )}
    </Box>
  )
}

export default StoryScreen

const styles = StyleSheet.create({})