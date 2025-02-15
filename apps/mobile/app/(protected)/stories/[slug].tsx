import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const StoryScreen = () => {
  const { slug } = useLocalSearchParams()
  // @todo: Get Story by slug

  return (
    <View>
      <Text>{slug}</Text>
    </View>
  )
}

export default StoryScreen

const styles = StyleSheet.create({})