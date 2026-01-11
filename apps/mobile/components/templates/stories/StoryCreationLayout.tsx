import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface StoryCreationLayoutProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  onBack: () => void;
  children: React.ReactNode;
  gradientColors?: [string, string];
}

export const StoryCreationLayout: React.FC<StoryCreationLayoutProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  onBack,
  children,
  gradientColors = [colors.backgroundOrange, colors.backgroundPink],
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <NavHeader
          onBack={onBack}
          title="Nouvelle Histoire ✨"
        />
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          title={stepTitle}
        />
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});

export default StoryCreationLayout;
