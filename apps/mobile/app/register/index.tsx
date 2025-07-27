import React from 'react'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import { Animated, ScrollView } from 'react-native'
import { RegisterForm } from '@/components/register/RegisterForm'
import { LinearGradient } from 'expo-linear-gradient'

const RegisterScreen = () => {
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
      colors={['#FFF8E1', '#FFE0F0']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Box flex={1}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
            paddingTop: 80,
            paddingBottom: 40
          }}
          showsVerticalScrollIndicator={false}
        >
          <Box position="relative" marginBottom="l">
            <Box flexDirection="row" justifyContent="flex-start" alignItems="center" gap="l">
              <Box
                backgroundColor="safetyGreen"
                paddingVertical="s"
                paddingHorizontal="m"
                borderRadius="l"
                zIndex={10}
              >
                <Text variant="buttonLabel" color="white" fontSize={12}>3-8 ans</Text>
              </Box>
              <Animated.View style={{
                transform: [{ translateY: bounceTransform }],
                shadowColor: '#FF6B9D',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 24,
              }}>
                <LinearGradient
                  colors={['#FF6B9D', '#FFB74D']}
                  style={{
                    width: 100,
                    height: 60,
                    borderRadius: 22,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 40 }}>✨</Text>
                </LinearGradient>
              </Animated.View>
            </Box>

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

          <Box width="100%" alignItems="center">
            <Text
              variant="title"
              color="textGreen"
              textAlign="center"
              marginBottom="s"
              fontSize={24}
              fontWeight="bold"
            >
              Rejoins l'aventure ! ✨
            </Text>

            <Text
              variant="body"
              color="textGray"
              textAlign="center"
              marginBottom="l"
              fontSize={16}
            >
              Crée ton compte pour sauvegarder tes histoires magiques
            </Text>
          </Box>

          <RegisterForm />
        </ScrollView>
      </Box>
    </LinearGradient>
  )
}

export default RegisterScreen