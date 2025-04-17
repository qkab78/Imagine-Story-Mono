import { useRouter } from 'expo-router'
import React from 'react'
import useAuthStore from '@/store/auth/authStore'
import { H3, Text, View, YStack } from 'tamagui'

import { logout } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import Button from '@/components/ui/Button'
import { ShoppingBag } from 'lucide-react-native'
import Box from '@/components/ui/Box'
import { Dimensions } from 'react-native'
import { useMMKVString } from 'react-native-mmkv'
import { Role } from '@/constants/Role'

const { width } = Dimensions.get("window")
const WIDTH = width * .5; 

const UserProfilePage = () => {
  const { user, token } = useAuthStore()
  const [, setUserToken] = useMMKVString('user.token');
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: () => logout(token!),
    onSuccess: () => {
      setUserToken(undefined);
      router.replace('/login')
    }
  })

  const handleUserSubscriptionUpgrade = () => {
    alert('Upgrade user subscription')
  }

  const handleLogout = () => {
    mutation.mutate()
  }

  const isPremiumUser = user?.role && user.role >= 3

  return (
    <Box flex={1} padding={"l"} gap={"l"}>
      <YStack gap={20} display='flex' flexDirection='row' flexWrap='wrap' justifyContent='flex-start'>
        <View gap={10}>
          <H3>Informations</H3>
          <Text>{user?.fullname}</Text>
          <Text>{user?.email}</Text>
        </View>
      </YStack>

      <YStack gap={20} display='flex' flexDirection='row' flexWrap='wrap' justifyContent='flex-start'>
        <View gap={10}>
          <H3>Favorite books</H3>
          {/* @todo: display favorite books on horizontal scrollView with circles or cards */}
        </View>
      </YStack>

      <YStack gap={20} display='flex' flexDirection='row' flexWrap='wrap' justifyContent='flex-start'>
        <View gap={10}>
          <H3>Abonnement</H3>
          <Text>{Role[user?.role as keyof typeof Role]}</Text>
          {!isPremiumUser && (
            <Button label='Upgrade' bgColor='yellow' onPress={handleUserSubscriptionUpgrade} Icon={ShoppingBag} />
          )}
        </View>
      </YStack>

      <Box justifyContent="center" alignItems="center" width={WIDTH}>
        <Button label='Logout' onPress={handleLogout} bgColor='tomato' />
      </Box>
    </Box>
  )
}

export default UserProfilePage