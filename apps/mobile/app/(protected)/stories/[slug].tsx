import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { getStoryBySlug } from '@/api/stories'
import { ScrollView } from 'react-native-gesture-handler'

const StoryScreen = () => {
  const { slug } = useLocalSearchParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug as string),
  })

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error || !data) {
    return <Text>Error fetching story</Text>
  }

  console.log(data);

  // Fonction pour découper le texte en chapitres
  function decouperChapitres(content: string) {
    const chapitres = content.split(/Chapitre \d+ :/).filter(Boolean);
    return chapitres.map((contenu) => {
      const lignes = contenu.trim().split('\n');
      return {
        titre: lignes[0].trim(),
        contenu: lignes.slice(1).join('\n').trim()
      };
    });
  }

  // Découpage du texte en chapitres
  const chapters = decouperChapitres(data.content);

  // Affichage des chapitres
  console.log(chapters);

  return (
    <View>
      <View style={{ display: 'flex' }}>
        <View style={{ padding: 20 }}>
          <Image
            source={{ uri: data.cover_image }}
            style={{ width: 150, height: 200 }}
          />
        </View>
        <View style={{ padding: 20 }}>
          <Text>Title: {data.title}</Text>
          <Text>Synopsis: {data.synopsis}</Text>
        </View>
      </View>

      <ScrollView>
        {chapters.map((chapter, index) => (
          <View key={index} style={{ padding: 20 }}>
            <Text>{`Chapitre ${index + 1} : ${chapter.titre}`}</Text>
            <Text>{chapter.contenu}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default StoryScreen

const styles = StyleSheet.create({})