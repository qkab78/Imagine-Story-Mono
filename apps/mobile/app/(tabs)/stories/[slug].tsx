import { ImageBackground, StyleSheet } from 'react-native'
import { useEffect } from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { getStoryBySlug } from '@/api/stories'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, Text, View, YStack, H1, Paragraph, Button } from 'tamagui'
import Animated from 'react-native-reanimated'
import { BookOpen } from '@tamagui/lucide-icons'

const StoryScreen = () => {
  const navigation = useNavigation();
  const { slug } = useLocalSearchParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug as string),
  })

  useEffect(() => {
    navigation.setOptions({ headerBackTitle: 'Retour', title: '' });
  }, [navigation]);

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error || !data) {
    return <Text>Error fetching story</Text>
  }

  return (
    <View>
      <ScrollView>
        <ImageBackground
          source={{ uri: data.cover_image }}
          resizeMode='cover'
          blurRadius={10}
        >
          <Animated.Image
            source={{ uri: data.cover_image }}
            style={{ width: 200, height: 300, padding: 20, margin: 'auto' }}
            borderRadius={5}
            sharedTransitionTag={`story-image-${slug}`}
          />
        </ImageBackground>

        <YStack padding={10}>
          <H1 fontSize={20} fontWeight={'700'} style={{ textTransform: 'uppercase' }}>{data.title}</H1>
          <Paragraph fontSize={15} fontWeight={'300'} fontStyle={'italic'}>{data.synopsis}</Paragraph>
        </YStack>

        <Link href={`/(tabs)/stories/${slug}/read`} asChild>
          <Button icon={BookOpen} size={"$6"} alignSelf='center' style={{ fontSize: 20, fontWeight: '700' }}>Lire</Button>
        </Link>
      </ScrollView>
    </View>
  )
}

export default StoryScreen

const styles = StyleSheet.create({})