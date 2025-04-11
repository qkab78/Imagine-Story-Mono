import { Dimensions, Image, StyleSheet } from 'react-native'
import React from 'react'
import { CreatStoryForm } from '@/components/stories/CreateStoryForm'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
// @ts-ignore
import BackgroundLogo from "@/assets/images/onboarding/imagine.jpg"


const { width, height } = Dimensions.get('window')
const IMAGE_HEIGHT = height * 0.3
const IMAGE_WIDTH = width

const CreateStory = () => {
  return (
    <Box flex={1} width={width} height={height}>
      <Box position={"relative"} width={IMAGE_WIDTH} height={IMAGE_HEIGHT}>
        <Image
          source={BackgroundLogo}
          style={styles.backgroundImage}
        />
        <Text
          variant={"subTitle"}
          textAlign={"center"}
          style={styles.title}
          color={"textPrimary"}
          textTransform={"uppercase"}
        >
          Create a new story
        </Text>
      </Box>
      <Box flex={1} padding={"l"} gap={"m"} backgroundColor={"mainBackground"}>
        <CreatStoryForm />
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  },
  title: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  }
})
export default CreateStory