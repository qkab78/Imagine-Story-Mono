import useAuthStore from "@/store/auth/authStore";
import { FontAwesome } from "@expo/vector-icons";
import { Role } from "@imagine-story/api/users/models/role";
import { Tabs, useRouter } from "expo-router";
import { CircleUserRound, Cog, House, SquarePen } from "@tamagui/lucide-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "tamagui";

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
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', animation: 'shift' }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarStyle: styles.tabBarStyle,
            tabBarActiveBackgroundColor: 'transparent',
            tabBarButton: ({ onPress }) => <Button size={"$6"} icon={House} onPress={onPress} chromeless />,
            headerShown: false,
          }}
        />

        {/* Stories */}
        <Tabs.Screen
          name="stories/[slug]"
          redirect={user?.role === Role.GUEST}
          options={{
            href: null,
            headerBackButtonDisplayMode: 'default',
            headerLeft: () => <BackButton />,
          }}
        />
        {/* Stories */}
        <Tabs.Screen
          name="stories/[slug]/read"
          redirect={user?.role === Role.GUEST}
          options={{
            href: null,
            headerBackButtonDisplayMode: 'default',
            headerLeft: () => <BackButton />,
          }}
        />
        <Tabs.Screen
          name="stories/create"
          redirect={user?.role === Role.GUEST}
          options={{
            tabBarStyle: styles.tabBarStyle,
            tabBarActiveBackgroundColor: 'transparent',
            tabBarButton: ({ onPress }) => <Button onPress={onPress} size={"$6"} icon={SquarePen} chromeless />,
            headerShown: false,
          }}
        />


        <Tabs.Screen
          name="users/profile"
          redirect={user?.role === Role.GUEST}
          options={{
            title: 'Profile',
            tabBarStyle: styles.tabBarStyle,
            tabBarActiveBackgroundColor: 'transparent',
            tabBarButton: ({ onPress }) => <Button onPress={onPress} size={"$6"} icon={CircleUserRound} chromeless />,
            
          }}
        />

        {/* Settings */}
        <Tabs.Screen
          name="settings"
          options={{
            tabBarStyle: styles.tabBarStyle,
            tabBarActiveBackgroundColor: 'transparent',
            tabBarButton: ({ onPress }) => <Button onPress={onPress} size={"$6"} icon={Cog} chromeless />,
            
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  },
})