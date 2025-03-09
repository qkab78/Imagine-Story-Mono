import useAuthStore from "@/store/auth/authStore";
import { FontAwesome } from "@expo/vector-icons";
import { Role } from "@imagine-story/api/users/models/role";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const BackButton = () => {
  const router = useRouter();

  const onPress = () => {
    router.back();
  }

  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, padding: 10 }}>
      <FontAwesome size={20} name="arrow-left" />
    </TouchableOpacity>

  )
}
export default function TabLayout() {
  const user = useAuthStore(state => state.user);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
          }}
        />
        <Tabs.Screen
          name="stories/[slug]"
          redirect={user?.role === Role.GUEST}
          options={{
            href: null,
            headerBackButtonDisplayMode: 'default',
            headerLeft: ({ onPress }) => <BackButton />,
          }}
        />
      </Tabs >
    </GestureHandlerRootView>
  )
}