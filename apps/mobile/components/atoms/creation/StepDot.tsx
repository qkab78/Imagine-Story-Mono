import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface StepDotProps {
  isActive: boolean;
  size?: number;
}

export const StepDot: React.FC<StepDotProps> = ({ 
  isActive, 
  size = 8 
}) => {
  return (
    <View 
      style={[
        styles.dot, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: isActive ? colors.primaryPink : colors.cardBorder 
        }
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    marginHorizontal: spacing.xs,
  },
});

export default StepDot;
