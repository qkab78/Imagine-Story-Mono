import { LoginForm } from '@/components/login/LoginForm'
import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'

const HomeScreen = () => {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground" gap={"xl"}>
      <Text variant="title">Imagine Story</Text>
      <LoginForm />
    </Box>
  )
}

export default HomeScreen