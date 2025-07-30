import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import Text from '@/components/ui/Text';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  totalSteps, 
  title 
}) => {
  const progressWidth = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <LinearGradient
            colors={[colors.primaryPink, colors.secondaryOrange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBar, { width: `${progressWidth}%` }]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  
  title: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: spacing.base,
    textAlign: 'center' as const,
  },
  
  progressContainer: {
    alignItems: 'center',
  },
  
  progressBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});

export default StepIndicator;