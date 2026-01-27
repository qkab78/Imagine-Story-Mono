import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LIBRARY_COLORS, LIBRARY_SPACING } from '@/constants/library';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface EmptyLibraryStateProps {
  onCreateStory: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const EmptyLibraryState: React.FC<EmptyLibraryStateProps> = ({ onCreateStory }) => {
  const { t } = useAppTranslation('stories');
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📚</Text>
      <Text style={styles.title}>{t('library.empty')}</Text>
      <Text style={styles.description}>
        {t('library.emptySubtitle')}
      </Text>

      <AnimatedPressable
        style={[styles.button, animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onCreateStory}
      >
        <Text style={styles.buttonText}>{t('library.createFirst')}</Text>
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: LIBRARY_SPACING.xxxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: LIBRARY_SPACING.lg,
  },
  title: {
    fontFamily: 'Quicksand',
    fontSize: 20,
    fontWeight: '700',
    color: LIBRARY_COLORS.textPrimary,
    marginBottom: LIBRARY_SPACING.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: LIBRARY_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: LIBRARY_SPACING.xxl,
    lineHeight: 22,
  },
  button: {
    backgroundColor: LIBRARY_COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    shadowColor: LIBRARY_COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  buttonText: {
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});

export default EmptyLibraryState;
