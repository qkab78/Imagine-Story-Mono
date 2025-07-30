import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import Text from '@/components/ui/Text';
import { Tone } from '@/types/creation';

interface ToneOptionProps {
  tone: Tone;
  isSelected: boolean;
  onSelect: (tone: Tone) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ToneOption: React.FC<ToneOptionProps> = React.memo(({ tone, isSelected, onSelect }) => {
  const scaleValue = useSharedValue(1);
  const borderColorValue = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    scaleValue.value = withSpring(0.98);
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    scaleValue.value = withSpring(1);
  }, [scaleValue]);

  const handlePress = useCallback(() => {
    onSelect(tone);
  }, [onSelect, tone]);

  React.useEffect(() => {
    borderColorValue.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected, borderColorValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: isSelected ? colors.accentBlue : colors.cardBorder,
    backgroundColor: isSelected ? 'rgba(33,150,243,0.05)' : 'rgba(255,255,255,0.8)',
    shadowOpacity: isSelected ? 0.2 : 0,
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle, animatedBorderStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Sélectionner l'ambiance ${tone.title}`}
    >
      <View style={styles.emojiContainer}>
        <LinearGradient
          colors={[colors.secondaryOrange, '#FF8A65']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emojiBackground}
        >
          <Text style={styles.emoji}>{tone.emoji}</Text>
        </LinearGradient>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{tone.title}</Text>
        <Text style={styles.description}>{tone.description}</Text>
      </View>
    </AnimatedTouchableOpacity>
  );
});

ToneOption.displayName = 'ToneOption';

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.accentBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 4,
  },
  
  emojiContainer: {
    marginRight: 16,
  },
  
  emojiBackground: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  emoji: {
    fontSize: 24,
  },
  
  textContainer: {
    flex: 1,
  },
  
  title: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  
  description: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.primary,
    color: colors.textTertiary,
    lineHeight: 18,
  },
});

export default ToneOption;