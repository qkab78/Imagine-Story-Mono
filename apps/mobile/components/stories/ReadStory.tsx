import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import MagicalStoryHeader from './MagicalStoryHeader';
import MagicalChapter from './MagicalChapter';
import { BookOpen, Heart, Star } from 'lucide-react-native';
import { Story } from '@imagine-story/api/app/stories/entities';

interface ReadStoryProps {
  story: Story
}


const ReadStory = ({ story }: ReadStoryProps) => {
  const theme = useTheme<Theme>();
  
  return (
    <Box>
      {/* Magical Story Header */}
      <MagicalStoryHeader story={story} />
      
      {/* Reading Instructions */}
      <Box 
        backgroundColor="white" 
        marginHorizontal="m" 
        marginTop="l" 
        padding="m" 
        borderRadius="l"
        style={styles.instructionCard}
      >
        <Box flexDirection="row" alignItems="center" justifyContent="center" marginBottom="s">
          <BookOpen size={20} color={theme.colors.darkBlue} />
          <Text variant="body" fontWeight="600" marginLeft="s" color="textPrimary">
            Tape sur un chapitre pour le lire!
          </Text>
        </Box>
        <Text variant="body" fontSize={12} textAlign="center" color="gray">
          Chaque chapitre s'ouvre comme par magie ✨
        </Text>
      </Box>
      
      {/* Magical Chapters */}
      <Box marginTop="m">
        {story.chapters.map((chapter, index) => (
          <MagicalChapter
            key={`${chapter.title}-${index}`}
            chapter={chapter}
            index={index}
          />
        ))}
        
        {/* Magical Conclusion */}
        {story.conclusion && (
          <Box marginTop="m">
            <Box 
              backgroundColor="primaryCardBackground"
              marginHorizontal="m"
              borderRadius="l"
              style={styles.conclusionCard}
            >
              <Box 
                flexDirection="row" 
                alignItems="center" 
                justifyContent="center"
                padding="m"
                borderBottomWidth={1}
                borderBottomColor="secondaryCardBackground"
              >
                <Star size={20} color="#F59E0B" />
                <Text 
                  variant="subTitle" 
                  fontSize={18} 
                  fontWeight="bold"
                  marginHorizontal="s"
                  color="textPrimary"
                >
                  Fin de l'Histoire
                </Text>
                <Star size={20} color="#F59E0B" />
              </Box>
              
              <Box 
                backgroundColor="white"
                margin="s"
                padding="m"
                borderRadius="m"
                style={styles.contentContainer}
              >
                <Text 
                  variant="body" 
                  fontSize={15}
                  lineHeight={24}
                  textAlign="justify"
                  color="textPrimary"
                >
                  {story.conclusion}
                </Text>
                
                {/* Happy ending hearts */}
                <Box flexDirection="row" justifyContent="center" marginTop="m">
                  <Heart size={16} color="#EF4444" fill="#EF4444" />
                  <Heart size={20} color="#EF4444" fill="#EF4444" style={{ marginHorizontal: 4 }} />
                  <Heart size={16} color="#EF4444" fill="#EF4444" />
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      
      {/* Thank you message */}
      <Box 
        alignItems="center" 
        marginTop="xl" 
        marginBottom="l"
        paddingHorizontal="m"
      >
        <Text 
          variant="subTitle" 
          fontSize={16} 
          textAlign="center" 
          color="textPrimary"
          style={styles.thankYouText}
        >
          ✨ Merci d'avoir lu cette histoire magique! ✨
        </Text>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  instructionCard: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conclusionCard: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  contentContainer: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  thankYouText: {
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default ReadStory;