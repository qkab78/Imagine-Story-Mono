import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getStoryBySlug } from '@/api/stories';
import { splitChapters } from '@/utils/story.utils';
import { ScrollView, Dimensions, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';
import Text from '@/components/ui/Text';
import Box from '@/components/ui/Box';
import ReadStory from '@/components/stories/ReadStory';

const { width, height } = Dimensions.get('window');
type Chapter = {
  title: string
  content: string
}

const MagicalReadingPage = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [conclusion, setConclusion] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);
  const theme = useTheme<Theme>();

  const navigation = useNavigation();
  const { slug } = useLocalSearchParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug as string),
  });

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }, [navigation, data]);

  useEffect(() => {
    if (data) {
      const payload = splitChapters(data.content);
      setChapters(payload.chapters);
      setConclusion(payload.conclusion);
    }
  }, [data]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F0E6FF' }]}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={theme.colors.darkBlue} />
          <Text variant="body" marginTop="m" color="textPrimary">
            Chargement de ton histoire magique...
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F0E6FF' }]}>
        <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="l">
          <Text variant="subTitle" color="error" textAlign="center">
            Oups! Il y a eu un problème
          </Text>
          <Text variant="body" marginTop="s" color="textPrimary" textAlign="center">
            Nous n'arrivons pas à charger ton histoire. Peux-tu réessayer?
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F0E6FF' }]}>
      <ScrollView 
        ref={scrollViewRef} 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {data && (
          <ReadStory story={data} chapters={chapters} conclusion={conclusion} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});

export default MagicalReadingPage;