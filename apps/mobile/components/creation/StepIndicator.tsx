import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { colors } from '@/theme/colors';
import Text from '@/components/ui/Text';
import { ProgressSegment } from '@/components/atoms/creation';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

/**
 * StepIndicator - Indicateur de progression
 *
 * Affiche une barre de progression avec segments individuels et le texte "Étape X sur Y".
 * Supporte maintenant 4 étapes avec les nouveaux ProgressSegment atoms.
 *
 * @example
 * ```tsx
 * <StepIndicator currentStep={2} totalSteps={4} />
 * ```
 */
const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <View style={styles.container}>
      {/* Progress bar avec segments */}
      <View style={styles.progressBar}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          let status: 'pending' | 'active' | 'completed' = 'pending';

          if (currentStep > stepNumber) {
            status = 'completed';
          } else if (currentStep === stepNumber) {
            status = 'active';
          }

          return (
            <ProgressSegment
              key={index}
              status={status}
              flex={1}
            />
          );
        })}
      </View>

      {/* Label du step */}
      <Text style={styles.stepLabel}>
        Étape {currentStep} sur {totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
});

export default StepIndicator;
