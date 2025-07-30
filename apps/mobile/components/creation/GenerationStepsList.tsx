import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import Text from '@/components/ui/Text';

export interface GenerationStep {
  id: string;
  title: string;
  icon: string;
  status: 'pending' | 'active' | 'completed';
  duration?: number;
}

interface GenerationStepsListProps {
  steps: GenerationStep[];
}

const GenerationStepItem: React.FC<{ step: GenerationStep }> = React.memo(({ step }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = step.status === 'pending' ? 0.5 : 1;
    const borderColor = interpolateColor(
      step.status === 'active' ? 1 : step.status === 'completed' ? 2 : 0,
      [0, 1, 2],
      [colors.cardBorder, colors.primaryPink, colors.safetyGreen]
    );
    
    return {
      opacity: withTiming(opacity, { duration: 300 }),
      borderColor: withTiming(borderColor as any, { duration: 300 }),
      backgroundColor: withTiming(
        step.status === 'completed' 
          ? 'rgba(76,175,80,0.1)' 
          : colors.cardBackground,
        { duration: 300 }
      ),
    };
  });

  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: withTiming(
      step.status === 'active' ? 0.2 : 0,
      { duration: 300 }
    ),
  }));

  return (
    <Animated.View 
      style={[
        styles.stepContainer,
        animatedStyle,
        step.status === 'active' && styles.stepActive,
        shadowStyle
      ]}
    >
      <Text style={styles.stepIcon}>{step.icon}</Text>
      <Text style={[
        styles.stepTitle,
        step.status === 'completed' && styles.stepTitleCompleted
      ]}>
        {step.title}
      </Text>
    </Animated.View>
  );
});

GenerationStepItem.displayName = 'GenerationStepItem';

const GenerationStepsList: React.FC<GenerationStepsListProps> = React.memo(({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step) => (
        <GenerationStepItem key={step.id} step={step} />
      ))}
    </View>
  );
});

GenerationStepsList.displayName = 'GenerationStepsList';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.base,
  },
  
  stepContainer: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  
  stepActive: {
    borderColor: colors.primaryPink,
  },
  
  stepIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  
  stepTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '500',
    color: colors.textSecondary,
    flex: 1,
  },
  
  stepTitleCompleted: {
    color: colors.safetyGreen,
    fontWeight: '600',
  },
});

export default GenerationStepsList;