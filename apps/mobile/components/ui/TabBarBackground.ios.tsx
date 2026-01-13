import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';

export default function BlurTabBarBackground() {
  const { hasGlassSupport } = useLiquidGlass();

  // iOS 26+ - Use liquid glass effect
  if (hasGlassSupport) {
    return (
      <GlassView
        glassEffectStyle="clear"
        tintColor="#F0E6FF"
        style={StyleSheet.absoluteFill}
      />
    );
  }

  // iOS < 26 - Fallback to system blur
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
