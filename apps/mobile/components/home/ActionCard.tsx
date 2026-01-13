import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GlassCard } from '@/components/molecules/glass/GlassCard';
import type { ActionCardProps } from '@/types/home';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  iconGradient,
  onPress,
  testID,
}) => {
  const scaleAnimation = useSharedValue(1);
  const opacityAnimation = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scaleAnimation.value = withTiming(0.98, { duration: 100 });
    opacityAnimation.value = withTiming(0.8, { duration: 100 });
  }, []);

  const handlePressOut = useCallback(() => {
    scaleAnimation.value = withTiming(1, { duration: 100 });
    opacityAnimation.value = withTiming(1, { duration: 100 });
  }, []);

  const handlePress = useCallback(() => {
    runOnJS(onPress)();
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
    opacity: opacityAnimation.value,
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint="Appuyez pour continuer"
    >
      <GlassCard
        glassStyle="regular"
        tintColor="rgba(107, 70, 193, 0.1)"
        borderRadius={20}
        padding={24}
        style={styles.card}
      >
        {/* Gradient overlay subtil pour la profondeur */}
        <LinearGradient
          colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
          style={styles.gradientOverlay}
        />

        <View style={styles.content}>
          <LinearGradient
            colors={iconGradient as [string, string]}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.icon}>{icon}</Text>
          </LinearGradient>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </GlassCard>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#616161',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    lineHeight: 20,
  },
});

export default ActionCard;