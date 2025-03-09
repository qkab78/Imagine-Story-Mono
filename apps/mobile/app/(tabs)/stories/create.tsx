import { View } from 'react-native'
import React from 'react'
import { CreatStoryForm } from '@/components/stories/CreateStoryForm'

const CreateStory = () => {
  return (
    <View style={{ padding: 20 }}>
      <CreatStoryForm />
    </View>
  )
}

export default CreateStory