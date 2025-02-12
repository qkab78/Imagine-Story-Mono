import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LoginForm } from '@/components/login/LoginForm'

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Imagine Story</Text>
      <View style={styles.form}>
        <LoginForm />
      </View>
    </View>
  )
}

export default HomeScreen

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
  form: {
    gap: 20
  }
})