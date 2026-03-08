import { authenticate, NetworkError } from '@/api/auth'
import Box from '@/components/ui/Box'
import { theme } from '@/config/theme'
import useAuthStore from '@/store/auth/authStore'
import { transformApiUserToAuthUser } from '@/utils/userTransform'
import { hasCompletedOnboarding } from '@/store/onboarding/onboardingStorage'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { useMMKVString } from 'react-native-mmkv'
import KidOnboardingContainer from '@/components/Onboarding/KidOnboardingContainer'


const Onboarding = () => {
  const { setToken, setUser } = useAuthStore((state) => state);
  const [userToken, setUserToken] = useMMKVString('user.token');
  const onboardingCompleted = hasCompletedOnboarding();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['authenticate', userToken],
    queryFn: ({ queryKey }) => authenticate(queryKey[1]!),
    enabled: !!userToken && userToken.length > 0,
    retry: false,
  })

  // Gérer les erreurs d'authentification
  useEffect(() => {
    if (isError && userToken) {
      if (error instanceof NetworkError) {
        // Hors ligne : utiliser les données cachées si disponibles
        const cachedUser = useAuthStore.getState().user;
        if (cachedUser) {
          setToken(userToken);
          router.replace("/(tabs)");
          return;
        }
      }
      // Token invalide ou pas de données cachées : déconnecter
      setUserToken(undefined);
    }
  }, [isError, error, userToken, setUserToken])

  useEffect(() => {
    if (data?.user) {
      setToken(`Bearer ${data.user.currentAccessToken.token}`);
      setUser(transformApiUserToAuthUser(data.user));
      router.replace("/(tabs)");
    }
  }, [data?.user])

  // Onboarding déjà complété mais pas de token → aller au login
  useEffect(() => {
    if (onboardingCompleted && !userToken && !isLoading) {
      router.replace('/login');
    }
  }, [onboardingCompleted, userToken, isLoading])

  // Afficher le loading pendant l'auto-authentification
  if (isLoading || (onboardingCompleted && userToken)) {
    return <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="lavender">
      <ActivityIndicator size={'large'} color={theme.colors.primaryPink} />
    </Box>
  }

  // Première utilisation : afficher l'onboarding
  if (!onboardingCompleted) {
    return <KidOnboardingContainer />
  }

  return null;
}

export default Onboarding