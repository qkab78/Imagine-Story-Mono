import useAuthStore from "@/store/auth/authStore";
import useTabBarDesignStore from "@/store/tabbar/tabBarDesignStore";
import { Role } from "@imagine-story/api/users/models/role";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HouseIcon, CircleUserRoundIcon, Compass, LibraryIcon, PlusIcon } from "lucide-react-native";
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
 * Custom Tab Bar Tabs Component
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
 * Uses custom tab bar designs (Glassmorphism or Floating)
 * switchable from the Profile/Settings screen.
 */
export default function TabLayout() {
  useTabHaptics();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CustomTabBarTabs />
    </GestureHandlerRootView>
  );
}
