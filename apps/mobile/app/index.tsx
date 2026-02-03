import { authenticate } from '@/api/auth'
import Box from '@/components/ui/Box'
import { theme } from '@/config/theme'
import useAuthStore from '@/store/auth/authStore'
import { transformApiUserToAuthUser } from '@/utils/userTransform'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { useMMKVString } from 'react-native-mmkv'
import KidOnboardingContainer from '@/components/Onboarding/KidOnboardingContainer'


const Onboarding = () => {
  const { setToken, setUser } = useAuthStore((state) => state);
  const [userToken, setUserToken] = useMMKVString('user.token');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['authenticate', userToken],
    queryFn: ({ queryKey }) => authenticate(queryKey[1]!),
    enabled: !!userToken && userToken.length > 0,
    retry: false,
  })

  // Nettoyer le token MMKV invalide en cas d'échec d'authentification
  useEffect(() => {
    if (isError && userToken) {
      setUserToken(undefined);
    }
  }, [isError, userToken, setUserToken])
  
  useEffect(() => {
    if (data?.user) {
      setToken(`Bearer ${data.user.currentAccessToken.token}`);
      setUser(transformApiUserToAuthUser(data.user));
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