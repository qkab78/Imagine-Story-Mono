import React from 'react'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import { Dimensions, Image } from 'react-native'
// @ts-ignore
import Logo from "@/assets/images/onboarding/choose.jpg"

const { height } = Dimensions.get("window")

const HEIGHT = height * 0.8

const RegisterScreen = () => {
  return (
    <Box height={HEIGHT} marginTop={"xl"} justifyContent={"center"} alignItems={"center"} gap={"l"}>
      <Text variant="title">Register</Text>
      <Image source={Logo} style={{ width: 200, height: 200, borderRadius: 100 }} />
    </Box>
  )
}

export default RegisterScreen