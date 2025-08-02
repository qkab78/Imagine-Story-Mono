import { Slot, Stack } from "expo-router";
import { theme } from "@/config/theme";

const defaultScreenOptions = {
  headerShown: false,
  headerTintColor: theme.colors.textPrimary,
}

export default function StoriesLayout() {
  return (
    <Slot />
  )
}
