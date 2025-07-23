import { View, Text, Image } from 'react-native'
import React from 'react'
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '@/store/auth/authStore';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const colorScheme = useColorScheme();
  const { bottom } = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);
  const filteredRoutes = props.state.routes
  const filteredRoutesNames = props.state.routeNames
  const filteredProps = { ...props, state: { ...props.state, routes: filteredRoutes, routeNames: filteredRoutesNames } };
  
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...filteredProps}
        scrollEnabled={false}
      >
        <View style={{ padding: 20 }}>
          <Image
            source={{
              uri: user?.avatar || "https://images.unsplash.com/photo-1497124401559-3e75ec2ed794?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }}
            style={{ width: 100, height: 100, alignSelf: 'center', borderRadius: 50 }}
          />
          <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 10, color: '#fff' }}>{user?.fullname}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <DrawerItemList {...filteredProps} />
          <DrawerItem
            label="Help"
            onPress={() => alert('Link to help')}
          />
        </View>
      </DrawerContentScrollView >
      <View style={{ padding: 20, borderTopColor: '#dde3fe', borderWidth: 1, paddingBottom: 20 + bottom }}>
        <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>Mikabs</Text>
        <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>Version {process.env.EXPO_PUBLIC_APP_VERSION}</Text>
      </View>
    </View >
  )
}

export default CustomDrawerContent