import { View } from 'tamagui'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import { Dimensions, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import React from 'react'
import { Stories } from '@imagine-story/api/types/db'
import BackButton from '../ui/BackButton'

interface ReadStoryProps {
  story: Stories
  chapters: Array<{ title: string, content: string }>
  conclusion: string
}

const { width, height } = Dimensions.get('window');
const HEADER_WIDTH = width * 0.9;
const SEARCH_INPUT_HEIGHT = height * 0.04;
const IMAGE_WIDTH = width * 1;
const IMAGE_HEIGHT = height * 0.4;

const styles = StyleSheet.create({
  backButton: {
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  title: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 10,
  }
})

const ReadStory = ({ story, chapters, conclusion }: ReadStoryProps) => {
  const { title, cover_image } = story
  
  return (
    <>
      <Box
        flexDirection={"row"}
        justifyContent="flex-start"
        alignItems="center"
        alignSelf={"center"}
        width={HEADER_WIDTH}
        height={SEARCH_INPUT_HEIGHT}
        position={"absolute"}
        top={0}
        left={0}
        right={0}
        zIndex={1000}
      >
        <BackButton style={styles.backButton} />
      </Box>

      <Box position={"relative"} height={IMAGE_HEIGHT} width={IMAGE_WIDTH} alignSelf={"center"}>
        <Animated.Image
          source={{ uri: cover_image }}
          style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
        />
        <Text variant={"title"} color={"white"} style={styles.title}>{`${title?.trim()}`}</Text>
      </Box>

      <Box justifyContent={'space-between'} alignItems={'center'} gap={'m'} marginTop={"l"}>
        <Box padding={"s"}>
          {chapters.map((currentChapter) => {
            return (
              <View key={currentChapter.title} style={{ width: '100%', padding: 10, gap: 10 }}>
                <Text variant={"subTitle"}>{`${currentChapter.title?.trim()}`}</Text>
                <Text variant={"body"} style={{ fontSize: 14, lineHeight: 34, textAlign: 'justify' }}>{currentChapter.content}</Text>
              </View>
            )
          })}

          {conclusion && (
            <View style={{ width: '100%', padding: 10, gap: 10 }}>
              <Text variant={"subTitle"}>Conclusion</Text>
              <Text variant={"body"} style={{ fontSize: 14, lineHeight: 34, textAlign: 'justify' }}>{conclusion}</Text>
            </View>
          )}
        </Box>
      </Box>
    </>
  )
}

export default ReadStory