import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/ui/IconSymbol';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import useAuthStore from '@/store/auth/authStore';
import { Role } from '@imagine-story/api/users/models/role';
import { ThemeProvider, useTheme } from '@shopify/restyle';
import { darkTheme, type Theme } from '@/config/theme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function DrawerLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [loaded] = useFonts({
    SpaceMonoRegular: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    SpaceMonoBold: require('../../assets/fonts/SpaceMono-Bold.ttf'),
    SpaceMonoItalic: require('../../assets/fonts/SpaceMono-Italic.ttf'),
    SpaceMonoBoldItalic: require('../../assets/fonts/SpaceMono-BoldItalic.ttf'),
  });
  const user = useAuthStore(state => state.user);
  const theme = useTheme<Theme>();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            drawerStyle: { backgroundColor: theme.colors.mainBackground }
          }}
        >
          <Drawer.Screen name="home" options={{
            title: 'Accueil',
            drawerLabel: 'Accueil',
            drawerIcon(props) {
              return <IconSymbol name="house.fill" {...props} />;
            },
          }} />
          <Drawer.Screen
            name="stories/index"
            redirect={user?.role === Role.GUEST}
            options={{
              title: 'Stories',
              drawerLabel: 'Stories',
              drawerIcon(props) {
                return <IconSymbol name="book.fill" {...props} />;
              },
            }} />
          <Drawer.Screen
            name="stories/[slug]"
            redirect={user?.role === Role.GUEST}
            options={{
              drawerItemStyle: { display: 'none' }
            }} />
        </Drawer>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
