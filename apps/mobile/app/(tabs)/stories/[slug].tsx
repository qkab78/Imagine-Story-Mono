import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ScrollView } from 'react-native-gesture-handler'
import { getStoryBySlug } from '@/api/stories'
import { splitChapters } from '@/utils/story.utils'
import { useNavigation } from '@react-navigation/native'

const StoryScreen = () => {
  const navigation = useNavigation();
  const { slug } = useLocalSearchParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug as string),
  })

  useEffect(() => {
    navigation.setOptions({
      title: data?.title,
      headerBackTitle: 'Retour',
    });
  }, [navigation, data?.title]);

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error || !data) {
    return <Text>Error fetching story</Text>
  }

  const chapters = splitChapters(data.content);

  return (
    <View>
      <ImageBackground
        source={{ uri: data.cover_image }}
        style={{ width: '100%', height: 200 }}
      />
      <View style={{ display: 'flex' }}>
        <View style={{ padding: 20, gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>{data.title}</Text>
          <Text style={{ fontSize: 15, fontWeight: '300', fontStyle: 'italic' }}>{data.synopsis}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ display: 'flex', flexDirection: 'row' }}
      >
        {chapters.map((chapter, index) => (
          <View key={index} style={{ padding: 20, width: 400, gap: 20 }}>
            <Text>{`Chapitre ${index + 1} : ${chapter.titre}`}</Text>
            <ScrollView>
              <Text style={{ textAlign: 'justify', lineHeight: 30, fontSize: 15 }}>{chapter.contenu}</Text>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default StoryScreen

const styles = StyleSheet.create({})