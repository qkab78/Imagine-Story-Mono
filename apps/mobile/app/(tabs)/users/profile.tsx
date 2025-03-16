
import React from 'react'
import useAuthStore from '@/store/auth/authStore'
import { Button, H3, ScrollView, Text, View, YStack } from 'tamagui'
import { ShoppingBag } from '@tamagui/lucide-icons'

const UserProfilePage = () => {
  const { user } = useAuthStore()

  const handleUserSubscriptionUpgrade = () => {
    alert('Upgrade user subscription')
  }
  return (
    <ScrollView flex={1} padding={20}>
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
          <Text>Free</Text>
          <Button onPress={handleUserSubscriptionUpgrade} icon={ShoppingBag}>Upgrade</Button>
        </View>
      </YStack>
    </ScrollView>
  )
}

export default UserProfilePage