import useAuthStore from "@/store/auth/authStore";
import { Role } from "@imagine-story/api/users/models/role";
import { Tabs } from "expo-router";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HouseIcon, SquarePenIcon, CircleUserRoundIcon, CogIcon, SearchIcon } from "lucide-react-native";
import { Platform } from "react-native";
import { useNativeTabsSupport } from "@/hooks/useNativeTabsSupport";

/**
 * Legacy JavaScript Tabs Component (Fallback for Android)
 */
function LegacyJavaScriptTabs() {
  const user = useAuthStore(state => state.user);
  const defaultScreenOptions = {
    tabBarActiveBackgroundColor: 'transparent',
    tabBarActiveTintColor: '#2F6B4F', // Forêt Magique - vert forêt
    tabBarInactiveTintColor: '#7FB8A0', // Forêt Magique - vert menthe
    tabBarStyle: {
      backgroundColor: '#FFF8F1', // Forêt Magique - crème chaleureux
      borderTopColor: 'rgba(127, 184, 160, 0.2)', // Forêt Magique - bordure menthe
      elevation: 0,
      shadowOpacity: 0,
    },
    headerStyle: {
      backgroundColor: '#FFF8F1', // Forêt Magique - crème chaleureux
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: '#2F6B4F', // Forêt Magique - vert forêt
  };

  return (
    <Tabs screenOptions={defaultScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          ...defaultScreenOptions,
          title: 'Accueil',
          headerShown: false,
          tabBarIcon: ({ color }) => <HouseIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        redirect={user?.role === Role.GUEST}
        options={{
          ...defaultScreenOptions,
          title: 'Créer',
          headerShown: false,
          tabBarIcon: ({ color }) => <SquarePenIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          ...defaultScreenOptions,
          title: 'Recherche',
          headerShown: false,
          tabBarIcon: ({ color }) => <SearchIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        redirect={user?.role === Role.GUEST}
        options={{
          ...defaultScreenOptions,
          title: 'Profil',
          headerShown: false,
          tabBarIcon: ({ color }) => <CircleUserRoundIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          ...defaultScreenOptions,
          title: 'Réglages',
          tabBarIcon: ({ color }) => <CogIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

/**
 * Main Tab Layout Component
 *
 * Uses NativeTabs on iOS for native performance and SF Symbols.
 * Falls back to JavaScript Tabs on Android.
 */
export default function TabLayout() {
  const user = useAuthStore(state => state.user);
  const { shouldUseNativeTabs, hasAdvancedFeatures } = useNativeTabsSupport();

  // iOS: Use NativeTabs for native performance and liquid glass support
  if (shouldUseNativeTabs && Platform.OS === 'ios') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NativeTabs
          minimizeBehavior={hasAdvancedFeatures ? "onScrollDown" : undefined}
          disableTransparentOnScrollEdge
        >
          {/* Home Tab */}
          <NativeTabs.Trigger name="index">
            <Icon sf="house.fill" />
            <Label>Accueil</Label>
          </NativeTabs.Trigger>

          {/* Create Tab - Hidden for guests */}
          {user?.role !== Role.GUEST && (
            <NativeTabs.Trigger name="create">
              <Icon sf="square.and.pencil" />
              <Label>Créer</Label>
            </NativeTabs.Trigger>
          )}

          {/* Search Tab with role="search" for iOS 26+ */}
          <NativeTabs.Trigger
            name="search/index"
            role={hasAdvancedFeatures ? "search" : undefined}
          >
            <Icon sf="magnifyingglass" />
            <Label>Recherche</Label>
          </NativeTabs.Trigger>

          {/* Profile Tab - Hidden for guests */}
          {user?.role !== Role.GUEST && (
            <NativeTabs.Trigger name="profile/index">
              <Icon sf="person.circle.fill" />
              <Label>Profil</Label>
            </NativeTabs.Trigger>
          )}

          {/* Settings Tab */}
          <NativeTabs.Trigger name="settings">
            <Icon sf="gearshape.fill" />
            <Label>Réglages</Label>
          </NativeTabs.Trigger>
        </NativeTabs>
      </GestureHandlerRootView>
    );
  }

  // Android/Fallback: Use JavaScript Tabs
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LegacyJavaScriptTabs />
    </GestureHandlerRootView>
  );
}
