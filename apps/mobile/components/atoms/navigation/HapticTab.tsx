import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleProp, ViewStyle } from 'react-native';

/**
 * HapticTab - Atom for tab bar button with haptic feedback
 *
 * Provides a soft haptic feedback when pressing down on tab bar buttons.
 * Only triggers haptics on iOS for native feel.
 */
export const HapticTab = ({
  children,
  style,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  accessibilityRole,
  accessibilityState,
  testID,
}: BottomTabBarButtonProps) => {
  return (
    <Pressable
      style={style as StyleProp<ViewStyle>}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressOut={onPressOut}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      testID={testID}
      onPressIn={(event) => {
        if (Platform.OS === 'ios') {
          Haptics.selectionAsync();
        }
        onPressIn?.(event);
      }}
    >
      {children}
    </Pressable>
  );
};

export default HapticTab;
