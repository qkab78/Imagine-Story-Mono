import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const COLORS = {
  primary: '#2F6B4F',
  textSecondary: '#4A6B5A',
  textPrimary: '#1F3D2B',
};

interface NotificationActionButtonsProps {
  onActivate: () => void;
  onSkip: () => void;
  isLoading?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const NotificationActionButtons: React.FC<NotificationActionButtonsProps> = ({
  onActivate,
  onSkip,
  isLoading = false,
}) => {
  const primaryScale = useSharedValue(1);
  const primaryTranslateY = useSharedValue(0);

  const handlePrimaryPressIn = () => {
    primaryScale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
    primaryTranslateY.value = withTiming(2, { duration: 100 });
  };

  const handlePrimaryPressOut = () => {
    primaryScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    primaryTranslateY.value = withSpring(0, { damping: 18, stiffness: 350 });
  };

  const primaryAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: primaryScale.value },
      { translateY: primaryTranslateY.value },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Bouton primaire */}
      <AnimatedPressable
        style={[styles.primaryButton, primaryAnimatedStyle]}
        onPressIn={handlePrimaryPressIn}
        onPressOut={handlePrimaryPressOut}
        onPress={onActivate}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.primaryText}>Activer les notifications</Text>
        )}
      </AnimatedPressable>

      {/* Bouton secondaire */}
      <Pressable
        style={styles.secondaryButton}
        onPress={onSkip}
        disabled={isLoading}
      >
        <Text style={styles.secondaryText}>Passer</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(47, 107, 79, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  primaryText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Nunito',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: 'Nunito',
  },
});

export default NotificationActionButtons;
