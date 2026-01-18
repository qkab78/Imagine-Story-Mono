import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, Dimensions } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface MagicalButtonProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  size?: 'large' | 'medium';
  icon?: React.ReactNode;
}
const { width } = Dimensions.get('window')
const BUTTON_WIDTH = width * 0.8;

const MagicalButton: React.FC<MagicalButtonProps> = ({
  title,
  subtitle,
  onPress,
  size = 'large',
  icon,
  disabled
}) => {
  const theme = useTheme<Theme>();
  const scale = useSharedValue(1);
  const glowAnimation = useSharedValue(0);
  const { trigger: triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    glowAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    triggerHaptic('medium');
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(glowAnimation.value, [0, 1], [0.6, 1]);
    
    return {
      transform: [{ scale: scale.value }],
      shadowOpacity: glowOpacity * 0.4,
    };
  });

  const buttonHeight = size === 'large' ? 80 : 60;
  const buttonWidth = size === 'large' ? BUTTON_WIDTH : 200;

  return (
    <Animated.View style={[animatedButtonStyle]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Box
          style={[
            styles.button,
            {
              height: buttonHeight,
              width: buttonWidth,
              shadowColor: theme.colors.tomato,
              backgroundColor: theme.colors.tomato,
              opacity: disabled ? 0.5 : 1,
            }
          ]}
        >
          <Box 
            flexDirection="row" 
            alignItems="center" 
            justifyContent="center"
            gap="s"
          >
            {icon}
            <Box alignItems="center">
              <Text 
                variant="buttonLabel" 
                color="white"
                fontSize={size === 'large' ? 20 : 18}
                fontWeight="bold"
                textAlign="center"
              >
                {title}
              </Text>
              {subtitle && (
                <Text 
                  variant="body" 
                  color="white"
                  fontSize={12}
                  opacity={0.9}
                >
                  {subtitle}
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MagicalButton;