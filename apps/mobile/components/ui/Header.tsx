import { TouchableOpacity } from 'react-native'
import useAuthStore from '@/store/auth/authStore'
import Box from '@/components/ui/Box'
import { theme } from '@/config/theme'
import Text from './Text'
import { Search } from 'lucide-react-native'
import { Link } from 'expo-router'

const Header = () => {
  const user = useAuthStore(state => state.user);

  return (
    <Box>
      {user && (
        <Box justifyContent={"space-between"} gap={"m"}>
          <Box flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Text variant={"body"} fontSize={14}>Hello {user.fullname.split(' ')[0]}</Text>
            <Link href={"/search"} asChild>
              <TouchableOpacity>
                <Search color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </Link>
          </Box>

          <Box gap={"s"}>
            <Text variant={"body"} style={{ fontSize: 16 }}>
              Imagine, Write, Share your stories
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Header