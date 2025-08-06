import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  activeColor?: string;
  inactiveColor?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  activeColor = '#4CAF50',
  inactiveColor = '#E0E0E0',
}) => {
  const animation = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    animation.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [value, animation]);

  const handlePress = () => {
    if (disabled) return;
    
    const newValue = !value;
    animation.value = withSpring(newValue ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
    
    runOnJS(onValueChange)(newValue);
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { width: 44, height: 24, thumbSize: 18 };
      case 'large':
        return { width: 60, height: 34, thumbSize: 28 };
      default:
        return { width: 52, height: 28, thumbSize: 22 };
    }
  };

  const sizeConfig = getSizeConfig();

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animation.value,
      [0, 1],
      [inactiveColor, activeColor]
    );

    return {
      backgroundColor,
      opacity: disabled ? 0.5 : 1,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = animation.value * (sizeConfig.width - sizeConfig.thumbSize - 6);
    
    return {
      transform: [{ translateX }],
      shadowOpacity: disabled ? 0.2 : 0.3,
    };
  });

  const trackStyle = [
    styles.track,
    {
      width: sizeConfig.width,
      height: sizeConfig.height,
      borderRadius: sizeConfig.height / 2,
    },
  ];

  const thumbStyle = [
    styles.thumb,
    {
      width: sizeConfig.thumbSize,
      height: sizeConfig.thumbSize,
      borderRadius: sizeConfig.thumbSize / 2,
    },
  ];

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View style={[trackStyle, trackAnimatedStyle]}>
        <Animated.View style={[thumbStyle, thumbAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  thumb: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});

export default Toggle;