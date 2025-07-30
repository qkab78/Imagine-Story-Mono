import React from 'react';
import { Stack } from 'expo-router';



export const CreationNavigator: React.FC = () => {
  return (
    <Stack
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="HeroSelection" 
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen   
        name="ThemeSelection" 
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="ToneSelection" 
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="StoryGeneration" 
        options={{
          animationTypeForReplace: 'push',
        }}
      />
    </Stack>
  );
};