import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

interface StoryTitleProps {
  title: string;
  numberOfLines?: number;
  variant?: 'default' | 'large' | 'small';
}

export const StoryTitle: React.FC<StoryTitleProps> = ({ 
  title, 
  numberOfLines = 1,
  variant = 'default'
}) => {
  const variantStyles = {
    default: styles.titleDefault,
    large: styles.titleLarge,
    small: styles.titleSmall,
  };

  return (
    <Text 
      style={[styles.title, variantStyles[variant]]} 
      numberOfLines={numberOfLines}
    >
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    color: colors.textPrimary,
  },
  titleDefault: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
  },
  titleLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
  },
  titleSmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
});

export default StoryTitle;
