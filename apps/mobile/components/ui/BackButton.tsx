import React from 'react'
import { theme } from '@/config/theme'
import { ChevronLeft } from 'lucide-react-native' 
import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    borderRadius: 100,
    backgroundColor: theme.colors.mainBackground,
    padding: 14,
  }
})

const BackButton = ({ style }: { style?: any }) => {
  const router = useRouter();

  return (
    <ChevronLeft
      size={24}
      color={theme.colors.black}
      onPress={() => router.back()}
      style={{
        ...styles.backButton,
        ...style,
      }}
    />
  )
}

export default BackButton