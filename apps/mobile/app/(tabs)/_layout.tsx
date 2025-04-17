import useAuthStore from "@/store/auth/authStore";
import { Role } from "@imagine-story/api/users/models/role";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/config/theme";
import { HouseIcon, SquarePenIcon, CircleUserRoundIcon, CogIcon } from "lucide-react-native";


export default function TabLayout() {
  const user = useAuthStore(state => state.user);
  const theme = useTheme<Theme>();
  const defaultScreenOptions: BottomTabNavigationOptions = {
    tabBarActiveBackgroundColor: 'transparent',
    tabBarActiveTintColor: theme.colors.darkBlue,
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', animation: 'shift' }}>
        <Tabs.Screen
          name="index"
          options={{
            ...defaultScreenOptions,
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused, color }) => <HouseIcon color={color} />,
          }}
        />

        <Tabs.Screen
          name="stories/create"
          redirect={user?.role === Role.GUEST}
          options={{
            ...defaultScreenOptions,
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ focused, color }) => <SquarePenIcon color={color} />,
          }}
        />

        <Tabs.Screen
          name="users/profile"
          redirect={user?.role === Role.GUEST}
          options={{
            ...defaultScreenOptions,
            title: 'Profile',
            tabBarIcon: ({ focused, color }) => <CircleUserRoundIcon color={color} />,

          }}
        />

        {/* Settings */}
        <Tabs.Screen
          name="settings"
          options={{
            ...defaultScreenOptions,
            title: 'Settings',
            tabBarIcon: ({ focused, color }) => <CogIcon color={color} />,

          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  )
}