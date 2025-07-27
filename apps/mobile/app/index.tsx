import { authenticate } from '@/api/auth'
import Box from '@/components/ui/Box'
import { theme } from '@/config/theme'
import useAuthStore from '@/store/auth/authStore'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { useMMKVString } from 'react-native-mmkv'
import KidOnboardingContainer from '@/components/Onboarding/KidOnboardingContainer'


const Onboarding = () => {
  const { setToken, setUser } = useAuthStore((state) => state);
  const [userToken] = useMMKVString('user.token');
  const { data, isLoading } = useQuery({
    queryKey: ['authenticate', userToken],
    queryFn: ({ queryKey }) => authenticate(queryKey[1]!),
    enabled: userToken !== undefined,
  })

  useEffect(() => {
    if (data?.user) {
      setToken(`Bearer ${data.user.currentAccessToken.token}`);
      setUser({
        id: String(data.user.id),
        email: data.user.email,
        fullname: data.user.firstname + " " + data.user.lastname,
        role: Number(data.user.role),
        avatar: '',
      });
      router.push("/(tabs)");
    }
  }, [data?.user])

  if (isLoading) {
    return <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="lavender">
      <ActivityIndicator size={'large'} color={theme.colors.primaryPink} />
    </Box>
  }

  return <KidOnboardingContainer />
}

export default Onboarding