import React from 'react';
import { Stack, useRouter } from 'expo-router';
import HomeScreen from '@/components/home/HomeScreen';
import { useSearchContext } from '@/hooks/useSearchContext';

export default function TabHomeScreen() {
  const router = useRouter();
  const setCurrentPage = useSearchContext((state) => state.setCurrentPage);

  React.useEffect(() => {
    setCurrentPage('index');
  }, [setCurrentPage]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          // Uncomment for header search bar:
          // headerShown: true,
          // headerSearchBarOptions: {
          //   placeholder: 'Rechercher des histoires...',
          //   onChangeText: (event) => {
          //     const query = event.nativeEvent.text;
          //     if (query.length > 0) {
          //       router.push(`/search?q=${encodeURIComponent(query)}`);
          //     }
          //   },
          //   autoCapitalize: 'none',
          //   hideWhenScrolling: true,
          // },
        }}
      />
      <HomeScreen />
    </>
  );
}