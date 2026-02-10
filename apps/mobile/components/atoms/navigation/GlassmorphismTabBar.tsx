import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import {
  HouseIcon,
  LibraryIcon,
  Compass,
  CircleUserRoundIcon,
  PlusIcon,
} from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const ACTIVE_COLOR = '#2F6B4F';
const INACTIVE_COLOR = '#A0A0A0';
const GOLD_COLOR = '#E8A838';

const TAB_ICONS: Record<string, { icon: typeof HouseIcon; isCenter?: boolean }> = {
  index: { icon: HouseIcon },
  library: { icon: LibraryIcon },
  create: { icon: PlusIcon, isCenter: true },
  'search/index': { icon: Compass },
  settings: { icon: CircleUserRoundIcon },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CenterButton({ isActive, onPress }: { isActive: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.centerButtonContainer}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 15 });
          if (Platform.OS === 'ios') Haptics.selectionAsync();
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
        style={[
          styles.centerButton,
          isActive ? styles.centerButtonActive : styles.centerButtonInactive,
          animatedStyle,
        ]}
      >
        <PlusIcon
          size={22}
          color={isActive ? '#FFFFFF' : '#999999'}
          strokeWidth={2.5}
        />
      </AnimatedPressable>
    </View>
  );
}

function TabButton({
  isActive,
  onPress,
  onLongPress,
  icon: IconComponent,
  label,
  accessibilityState,
}: {
  isActive: boolean;
  onPress: () => void;
  onLongPress: () => void;
  icon: typeof HouseIcon;
  label: string;
  accessibilityState: { selected: boolean };
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        if (Platform.OS === 'ios') Haptics.selectionAsync();
        onPress();
      }}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      style={[styles.tabButton, animatedStyle]}
    >
      <Animated.View style={animatedStyle}>
        <IconComponent
          size={24}
          color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
          strokeWidth={1.8}
        />
      </Animated.View>
      <Text
        style={[
          styles.tabLabel,
          { color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR },
          isActive && styles.tabLabelActive,
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

/**
 * GlassmorphismTabBar - Choice 1
 *
 * Glass morphism style with frosted glass background and
 * a prominent floating center "Create" button.
 */
export function GlassmorphismTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <BlurView intensity={40} tint="light" style={styles.container}>
      <View style={styles.innerContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;
          const tabConfig = TAB_ICONS[route.name];

          if (!tabConfig) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          if (tabConfig.isCenter) {
            return (
              <CenterButton
                key={route.key}
                isActive={isFocused}
                onPress={onPress}
              />
            );
          }

          return (
            <TabButton
              key={route.key}
              isActive={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              icon={tabConfig.icon}
              label={label}
              accessibilityState={{ selected: isFocused }}
            />
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.6)',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    fontWeight: '800',
  },
  centerButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  centerButtonActive: {
    backgroundColor: GOLD_COLOR,
    shadowColor: GOLD_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  centerButtonInactive: {
    backgroundColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default GlassmorphismTabBar;
