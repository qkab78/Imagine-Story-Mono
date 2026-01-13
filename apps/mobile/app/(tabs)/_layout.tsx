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
    tabBarActiveTintColor: '#6B46C1',
    tabBarInactiveTintColor: '#A78BFA',
    tabBarStyle: {
      backgroundColor: '#F0E6FF',
      borderTopColor: '#E8D5FF',
      elevation: 0,
      shadowOpacity: 0,
    },
    headerStyle: {
      backgroundColor: '#F0E6FF',
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: '#6B46C1',
  };

  return (
    <Tabs screenOptions={defaultScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          ...defaultScreenOptions,
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <HouseIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="stories/creation"
        redirect={user?.role === Role.GUEST}
        options={{
          ...defaultScreenOptions,
          title: 'Hero Selection',
          headerShown: false,
          tabBarIcon: ({ color }) => <SquarePenIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          ...defaultScreenOptions,
          title: 'Search',
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
          title: 'Settings',
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

          {/* Stories Creation Tab - Hidden for guests */}
          {user?.role !== Role.GUEST && (
            <NativeTabs.Trigger name="stories/creation">
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