import React from 'react'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import { LoginForm } from '@/components/login/LoginForm'

const LoginScreen = () => {
  return (
    <Box flex={1} backgroundColor={"mainBackground"} justifyContent={"center"} alignItems={"center"} gap={"l"}>
      <Text variant="title">Imagine Story</Text>
      <LoginForm />
    </Box>
  )
}

export default LoginScreen