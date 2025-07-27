import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';

interface KidAnimatedLogoProps {
  emoji: string;
  size?: number;
  backgroundColor?: string;
}

const KidAnimatedLogo: React.FC<KidAnimatedLogoProps> = ({ 
  emoji, 
  size = 110,
  backgroundColor = '#FFB74D'
}) => {
  const bounceAnimation = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);
  const sparkleScale = useSharedValue(1);

  useEffect(() => {
    // Bounce animation
    bounceAnimation.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000 }),
        withTiming(1, { duration: 400 }),
        withTiming(0.7, { duration: 200 }),
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 1200 })
      ),
      -1,
      false
    );

    // Sparkle animations
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 1500 }),
      -1,
      false
    );
    
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 750 }),
        withTiming(1, { duration: 750 })
      ),
      -1,
      true
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(bounceAnimation.value, [0, 1], [0, -8]);
    const scale = interpolate(bounceAnimation.value, [0, 1], [1, 1.05]);
    
    return {
      transform: [
        { translateY },
        { scale },
      ],
    };
  });

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${sparkleRotation.value}deg` },
      { scale: sparkleScale.value },
    ],
  }));

  return (
    <Box alignItems="center" justifyContent="center" style={{ position: 'relative' }}>
      <Animated.View style={[
        {
          width: size,
          height: size,
          backgroundColor,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          ...styles.logoShadow,
        },
        logoAnimatedStyle
      ]}>
        <Text style={{ fontSize: size * 0.4 }}>{emoji}</Text>
      </Animated.View>
      
      {/* Sparkle effect */}
      <Animated.View style={[
        {
          position: 'absolute',
          top: -8,
          right: -8,
        },
        sparkleAnimatedStyle
      ]}>
        <Text style={{ fontSize: 24 }}>✨</Text>
      </Animated.View>
    </Box>
  );
};

const styles = StyleSheet.create({
  logoShadow: {
    shadowColor: '#FFB74D',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
});

export default KidAnimatedLogo;