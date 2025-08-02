import useAuthStore from "@/store/auth/authStore";
import { Role } from "@imagine-story/api/users/models/role";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HouseIcon, SquarePenIcon, CircleUserRoundIcon, CogIcon } from "lucide-react-native";


export default function TabLayout() {
  const user = useAuthStore(state => state.user);
  const defaultScreenOptions = {
    tabBarActiveBackgroundColor: 'transparent',
    tabBarActiveTintColor: '#6B46C1', // Purple to match magical theme
    tabBarInactiveTintColor: '#A78BFA', // Lighter purple for inactive tabs
    tabBarStyle: {
      backgroundColor: '#F0E6FF', // Light purple background to match home screen
      borderTopColor: '#E8D5FF', // Subtle border
      elevation: 0,
      shadowOpacity: 0,
    },
    headerStyle: {
      backgroundColor: '#F0E6FF', // Light purple header background
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: '#6B46C1', // Purple header text
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={defaultScreenOptions}>
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
          name="stories/creation"
          redirect={user?.role === Role.GUEST}
          options={{
            ...defaultScreenOptions,
            title: 'Hero Selection',
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