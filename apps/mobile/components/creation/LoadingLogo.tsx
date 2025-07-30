import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import Text from '@/components/ui/Text';

interface LoadingLogoProps {
  size?: number;
  primaryEmoji: string;
  sparkleEmoji?: string;
}

const LoadingLogo: React.FC<LoadingLogoProps> = React.memo(({ 
  size = 120, 
  primaryEmoji,
  sparkleEmoji = '✨'
}) => {
  const logoScale = useSharedValue(1);
  const logoRotation = useSharedValue(0);
  const sparkleScale = useSharedValue(1);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    // Animation bounce du logo principal
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    );
    
    // Animation rotation sparkle
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 1500 }),
      -1,
      false
    );
    
    // Animation scale sparkle
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(0.8, { duration: 800 })
      ),
      -1,
      true
    );
  }, [logoScale, logoRotation, sparkleScale, sparkleRotation]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: sparkleScale.value },
      { rotate: `${sparkleRotation.value}deg` }
    ],
  }));

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, logoAnimatedStyle]}>
      <LinearGradient
        colors={[colors.primaryPink, colors.secondaryOrange]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: size * 0.208 }]} // 25/120 = 0.208
      >
        <Text style={[styles.primaryEmoji, { fontSize: size * 0.5 }]}>
          {primaryEmoji}
        </Text>
      </LinearGradient>
      
      <Animated.View style={[styles.sparkle, sparkleAnimatedStyle]}>
        <Text style={[styles.sparkleEmoji, { fontSize: size * 0.25 }]}>
          {sparkleEmoji}
        </Text>
      </Animated.View>
    </Animated.View>
  );
});

LoadingLogo.displayName = 'LoadingLogo';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  primaryEmoji: {
    textAlign: 'center',
  },
  
  sparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  
  sparkleEmoji: {
    textAlign: 'center',
  },
});

export default LoadingLogo;