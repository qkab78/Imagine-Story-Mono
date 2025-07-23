import { Stack } from "expo-router";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { theme } from "@/config/theme";

const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  headerTintColor: theme.colors.textPrimary,
}

export default function StoriesLayout() {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="[slug]/index" />
      <Stack.Screen name="[slug]/read" />
    </Stack>
  )
}
