import { ImageBackground, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { getStoryBySlug } from '@/api/stories'
import { splitChapters } from '@/utils/story.utils'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, Text, View, Image, YStack, H1, Paragraph, Dialog, XStack } from 'tamagui'
import Modal from '@/components/ui/Modal'

const StoryScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const chapters = splitChapters(data.content);
  
  return (
    <View>
      <ScrollView>
        <ImageBackground
          source={{ uri: data.cover_image }}
          resizeMode='cover'
          blurRadius={10}
        >
          <Image source={{ uri: data.cover_image }} style={{ width: 200, height: 300, padding: 20, margin: 'auto' }} borderRadius={5} />
        </ImageBackground>

        <YStack padding={10}>
          <H1 fontSize={20} fontWeight={'700'} style={{ textTransform: 'uppercase' }}>{data.title}</H1>
          <Paragraph fontSize={15} fontWeight={'300'} fontStyle={'italic'}>{data.synopsis}</Paragraph>
        </YStack>

        <Modal>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {chapters.map((chapter, index) => {
              return (
                <XStack key={index} padding={20} gap={20} display='flex' flexDirection='column'>
                  <Dialog.Title fontSize={20}>{`Chapitre ${index + 1} : ${chapter.titre.trim().replace(':', '')}`}</Dialog.Title>
                  <ScrollView>
                    <Dialog.Description width={320} textAlign='justify'>{chapter.contenu}</Dialog.Description>
                  </ScrollView>
                </XStack>
              )
            })}
          </ScrollView>
        </Modal>
      </ScrollView>
    </View>
  )
}

export default StoryScreen

const styles = StyleSheet.create({})