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
  FadeIn,
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
        size={18}
        color={isActive ? '#FFFFFF' : '#999999'}
        strokeWidth={2.8}
      />
    </AnimatedPressable>
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
      <Animated.View
        style={[
          animatedStyle,
          { transform: [{ scale: isActive ? 1.12 : 1 }] },
        ]}
      >
        <IconComponent
          size={24}
          color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
          fill={isActive ? ACTIVE_COLOR : 'none'}
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
      {isActive && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={styles.activeDot}
        />
      )}
    </AnimatedPressable>
  );
}

/**
 * FloatingTabBar - Choice 3
 *
 * Floating rounded bar detached from edges with rounded corners,
 * active dot indicator, and a premium airy look.
 */
export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={40} tint="light" style={styles.blurContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  blurContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(47, 107, 79, 0.06)',
    shadowColor: 'rgba(47, 107, 79, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 10,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    fontWeight: '800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACTIVE_COLOR,
    marginTop: 1,
  },
  centerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonActive: {
    backgroundColor: GOLD_COLOR,
    shadowColor: GOLD_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  centerButtonInactive: {
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default FloatingTabBar;
