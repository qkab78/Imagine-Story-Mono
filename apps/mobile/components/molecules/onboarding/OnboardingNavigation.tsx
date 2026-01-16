import { View, StyleSheet } from 'react-native';
import { NavigationButton } from '@/components/atoms/onboarding/NavigationButton';
import { ProgressBar } from '@/components/atoms/onboarding/ProgressBar';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  onPrimary: () => void;
  primaryLabel: string;
  showBackButton?: boolean;
  showNextButton?: boolean;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onPrimary,
  primaryLabel,
  showBackButton = true,
  showNextButton = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        {showBackButton && onBack ? (
          <NavigationButton variant="back" onPress={onBack} />
        ) : (
          <View style={styles.placeholder} />
        )}

        <NavigationButton
          variant="primary"
          onPress={onPrimary}
          label={primaryLabel}
        />

        {showNextButton && onNext ? (
          <NavigationButton variant="next" onPress={onNext} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar totalSteps={totalSteps} currentStep={currentStep} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    gap: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  placeholder: {
    width: 48,
  },
  progressContainer: {
    alignItems: 'center',
  },
});

export default OnboardingNavigation;
