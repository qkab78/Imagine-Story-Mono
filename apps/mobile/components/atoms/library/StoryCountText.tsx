import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LIBRARY_COLORS, LIBRARY_TYPOGRAPHY } from '@/constants/library';

interface StoryCountTextProps {
  count: number;
}

export const StoryCountText: React.FC<StoryCountTextProps> = ({ count }) => {
  const label = count === 1 ? 'histoire' : 'histoires';

  return (
    <Text style={styles.text}>
      {count} {label}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...LIBRARY_TYPOGRAPHY.storyCount,
    color: LIBRARY_COLORS.textMuted,
  },
});

export default StoryCountText;
