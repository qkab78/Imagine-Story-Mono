import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Text } from 'react-native';

interface StatCardProps {
  value: number;
  label: string;
  icon?: string;
  accentColor?: string;
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  accentColor = colors.primaryPink,
  onPress,
}) => {
  const scaleValue = useSharedValue(1);

  const handlePress = () => {
    if (!onPress) return;

    scaleValue.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    runOnJS(onPress)();
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const Card = onPress ? Pressable : Animated.View;

  return (
    <Card onPress={onPress ? handlePress : undefined} style={styles.pressable}>
      <Animated.View style={[styles.container, cardAnimatedStyle]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={styles.content}>
            {icon && (
              <Text style={styles.icon}>{icon}</Text>
            )}
            
            <Text style={[styles.value, { color: accentColor }]}>
              {value}
            </Text>
            
            <Text style={styles.label} numberOfLines={2}>
              {label}
            </Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Card>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  container: {
    flex: 1,
    minHeight: 100,
    borderRadius: 16,
    shadowColor: colors.storyCardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    padding: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: "bold",
    fontFamily: typography.fontFamily.primary,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.primary,
    textAlign: 'center',
    fontWeight: "medium",
  },
  accent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default StatCard;