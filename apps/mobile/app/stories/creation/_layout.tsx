import { Stack } from 'expo-router';

/**
 * Layout pour le workflow de création d'histoire
 *
 * Ce layout est séparé du tab bar pour permettre une expérience
 * plein écran sans être caché par la navigation en bas.
 */
export default function CreationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="hero-selection" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="theme-selection" />
      <Stack.Screen name="tone-selection" />
      <Stack.Screen name="summary" />
      <Stack.Screen name="story-generation" />
    </Stack>
  );
}
