import { Stack } from 'expo-router';
import { LibraryScreen } from '@/components/screens/library';

export default function TabLibraryScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <LibraryScreen />
    </>
  );
}
