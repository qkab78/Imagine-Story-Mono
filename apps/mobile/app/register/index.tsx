import React from 'react'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import { Dimensions, Image } from 'react-native'
// @ts-ignore
import Logo from "@/assets/images/onboarding/choose.jpg"
import { RegisterForm } from '@/components/register/RegisterForm'
const { height } = Dimensions.get("window")

const HEIGHT = height * 0.9

const RegisterScreen = () => {
  return (
    <Box height={HEIGHT} marginTop={"xl"} justifyContent={"center"} alignItems={"center"} gap={"l"}>
      <Image source={Logo} style={{ width: 200, height: 200, borderRadius: 100 }} />
      <RegisterForm />
    </Box>
  )
}

export default RegisterScreen