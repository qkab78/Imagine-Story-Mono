import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const StoriesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stories Screen</Text>
    </View>
  )
}

export default StoriesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
})