import React from 'react'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import { LoginForm } from '@/components/login/LoginForm'
import { Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const LoginScreen = () => {
  const bounceValue = React.useRef(new Animated.Value(0)).current
  const sparkleValue = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    )

    const sparkleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    )

    bounceAnimation.start()
    sparkleAnimation.start()

    return () => {
      bounceAnimation.stop()
      sparkleAnimation.stop()
    }
  }, [])

  const bounceTransform = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  })

  const sparkleRotate = sparkleValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  const sparkleScale = sparkleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  })

  return (
    <LinearGradient
      colors={['#E3F2FD', '#F0F8FF']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Box flex={1} paddingHorizontal="l" paddingTop="xl">
        <Box 
          position="absolute" 
          top={50} 
          left={32} 
          backgroundColor="safetyGreen" 
          paddingVertical="s" 
          paddingHorizontal="m" 
          borderRadius="l"
          zIndex={10}
        >
          <Text variant="buttonLabel" color="white" fontSize={12}>3-8 ans</Text>
        </Box>

        <Box flex={1} justifyContent="center" alignItems="center" paddingTop="xl">
          <Box position="relative" marginBottom="l">
            <Animated.View style={{
              transform: [{ translateY: bounceTransform }],
              shadowColor: '#2196F3',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 24,
            }}>
              <LinearGradient
                colors={['#2196F3', '#03DAC6']}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 40 }}>🔐</Text>
              </LinearGradient>
            </Animated.View>
            
            <Animated.View style={{
              position: 'absolute',
              top: -8,
              right: -8,
              transform: [
                { rotate: sparkleRotate },
                { scale: sparkleScale }
              ],
            }}>
              <Text style={{ fontSize: 20 }}>✨</Text>
            </Animated.View>
          </Box>

          <Text 
            variant="title" 
            color="textGreen" 
            textAlign="center" 
            marginBottom="s"
            fontSize={26}
            fontWeight="700"
          >
            Bon retour ! 🔐
          </Text>
          
          <Text 
            variant="body" 
            color="textGray" 
            textAlign="center" 
            marginBottom="xl"
            fontSize={16}
            maxWidth={280}
          >
            Connecte-toi pour retrouver tes histoires magiques
          </Text>

          <LoginForm />
        </Box>
      </Box>
    </LinearGradient>
  )
}

export default LoginScreen