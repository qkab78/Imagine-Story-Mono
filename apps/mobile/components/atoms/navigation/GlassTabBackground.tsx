import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';

/**
 * GlassTabBackground - Atom for tab bar background with glass effect
 *
 * Uses native glass effect on iOS 26+, BlurView fallback on iOS < 26,
 * and solid background on Android.
 *
 * This can be used with NativeTabs or JavaScript Tabs.
 */
export const GlassTabBackground: React.FC = () => {
  const { hasGlassSupport, shouldUseBlur } = useLiquidGlass();

  // iOS 26+: Use native liquid glass effect
  if (hasGlassSupport && Platform.OS === 'ios') {
    return (
      <GlassView
        glassEffectStyle="clear"
        tintColor="#F0E6FF"
        style={StyleSheet.absoluteFill}
      />
    );
  }

  // iOS < 26: Fallback to BlurView
  if (shouldUseBlur && Platform.OS === 'ios') {
    return (
      <BlurView
        tint="systemChromeMaterial"
        intensity={100}
        style={StyleSheet.absoluteFill}
      />
    );
  }

  // Android: Solid background
  return <View style={[StyleSheet.absoluteFill, styles.solidBackground]} />;
};

const styles = StyleSheet.create({
  solidBackground: {
    backgroundColor: '#F0E6FF',
  },
});

export default GlassTabBackground;
