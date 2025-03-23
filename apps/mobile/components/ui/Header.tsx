import { Dimensions, Image } from 'react-native'
import useAuthStore from '@/store/auth/authStore'
import Box from '@/components/ui/Box'
import { theme } from '@/config/theme'
import Text from './Text'

const SIZE = 50
const HEIGHT = theme.borderRadii.l * 2
const WIDTH = Dimensions.get('window').width

const Header = () => {
  const user = useAuthStore(state => state.user);

  return (
    <Box height={HEIGHT} alignSelf={"flex-start"} width={WIDTH} paddingHorizontal={"m"}>
      {user && (
        <Box flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
          <Image
            source={{ uri: user.avatar || "https://images.unsplash.com/photo-1497124401559-3e75ec2ed794?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
            style={{ width: SIZE, height: SIZE, borderRadius: SIZE }}
          />
          <Box>
            <Text>Hello</Text>
            <Text color={"textPrimary"}>{user.fullname}</Text> 
          </Box>

        </Box>
      )}
    </Box>
  )
}

export default Header