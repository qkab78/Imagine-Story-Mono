import useAuthStore from "@/store/auth/authStore";
import useTabBarDesignStore from "@/store/tabbar/tabBarDesignStore";
import { Role } from "@imagine-story/api/users/models/role";
import { Tabs } from "expo-router";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HouseIcon, CircleUserRoundIcon, Compass, LibraryIcon, PlusIcon } from "lucide-react-native";
import { Platform } from "react-native";
import { useNativeTabsSupport } from "@/hooks/useNativeTabsSupport";
import { useTabHaptics } from "@/hooks/useTabHaptics";
import { GlassmorphismTabBar, FloatingTabBar } from "@/components/atoms/navigation";
import { useAppTranslation } from "@/hooks/useAppTranslation";

/**
 * Shared header options for all tab screens
 */
const headerOptions = {
  headerStyle: {
    backgroundColor: '#FFF8F1',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: '#2F6B4F',
};

/**
 * Custom Tab Bar Tabs Component (iOS 18 / Android)
 *
 * Uses a custom tabBar renderer that switches between
 * Glassmorphism (Choice 1) and Floating (Choice 3) designs.
 */
function CustomTabBarTabs() {
  const user = useAuthStore(state => state.user);
  const design = useTabBarDesignStore(state => state.design);
  const { t } = useAppTranslation('common');

  const TabBarComponent = design === 'glassmorphism' ? GlassmorphismTabBar : FloatingTabBar;

  return (
    <Tabs
      tabBar={(props) => <TabBarComponent {...props} />}
      screenOptions={{
        ...headerOptions,
        tabBarActiveTintColor: '#2F6B4F',
        tabBarInactiveTintColor: '#A0A0A0',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.home'),
          headerShown: false,
          tabBarIcon: ({ color }) => <HouseIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        redirect={user?.role === Role.GUEST}
        options={{
          title: t('navigation.library'),
          headerShown: false,
          tabBarIcon: ({ color }) => <LibraryIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        redirect={user?.role === Role.GUEST}
        options={{
          title: t('navigation.create'),
          headerShown: false,
          tabBarIcon: ({ color }) => <PlusIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          title: t('navigation.explore'),
          headerShown: false,
          tabBarIcon: ({ color }) => <Compass color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('navigation.profile'),
          tabBarIcon: ({ color }) => <CircleUserRoundIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

/**
 * Main Tab Layout Component
 *
 * Uses NativeTabs on iOS 26+ for native performance and SF Symbols.
 * Falls back to custom tab bar designs (Glassmorphism or Floating)
 * on iOS 18 and Android, switchable from the Profile/Settings screen.
 */
export default function TabLayout() {
  const user = useAuthStore(state => state.user);
  const { shouldUseNativeTabs, hasAdvancedFeatures } = useNativeTabsSupport();
  const { t } = useAppTranslation('common');
  useTabHaptics();

  // iOS 26+: Use NativeTabs for native performance and liquid glass support
  if (shouldUseNativeTabs && Platform.OS === 'ios' && hasAdvancedFeatures) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NativeTabs
          minimizeBehavior="onScrollDown"
          disableTransparentOnScrollEdge
        >
          {/* Home Tab */}
          <NativeTabs.Trigger name="index">
            <Icon sf="house.fill" />
            <Label>{t('navigation.home')}</Label>
          </NativeTabs.Trigger>

          {/* Library Tab - Hidden for guests */}
          {user?.role !== Role.GUEST && (
            <NativeTabs.Trigger name="library">
              <Icon sf="books.vertical.fill" />
              <Label>{t('navigation.library')}</Label>
            </NativeTabs.Trigger>
          )}

          {/* Create Tab - Hidden for guests */}
          {user?.role !== Role.GUEST && (
            <NativeTabs.Trigger name="create">
              <Icon sf="square.and.pencil" />
              <Label>{t('navigation.create')}</Label>
            </NativeTabs.Trigger>
          )}

          {/* Explore Tab with role="search" for iOS 26+ */}
          <NativeTabs.Trigger
            name="search/index"
            role="search"
          >
            <Icon sf="safari.fill" />
            <Label>{t('navigation.explore')}</Label>
          </NativeTabs.Trigger>

          {/* Profile Tab */}
          <NativeTabs.Trigger name="settings">
              <Icon sf="person.circle.fill" />
            <Label>{t('navigation.profile')}</Label>
          </NativeTabs.Trigger>
        </NativeTabs>
      </GestureHandlerRootView>
    );
  }

  // iOS 18 / Android: Use custom tab bar designs
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CustomTabBarTabs />
    </GestureHandlerRootView>
  );
}
