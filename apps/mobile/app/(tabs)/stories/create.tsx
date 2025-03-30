import { Dimensions } from 'react-native'
import React from 'react'
import { CreatStoryForm } from '@/components/stories/CreateStoryForm'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'

const { width, height } = Dimensions.get('window')
const CreateStory = () => {
  return (
    <Box padding={"xl"} width={width} height={height} gap={"m"}>
      <Box>
        <Text variant={"subTitle"}>Create a new story</Text>
        <CreatStoryForm />
      </Box>
    </Box>
  )
}

export default CreateStory