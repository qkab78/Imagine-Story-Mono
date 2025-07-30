import { Stack } from 'expo-router';

export default function CreationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="hero-selection" 
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="theme-selection" 
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="story-generation" 
        options={{
          animationTypeForReplace: 'push',
        }}
      />
    </Stack>
  );
}