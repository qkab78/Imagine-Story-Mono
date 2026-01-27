import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { LIBRARY_COLORS, LIBRARY_TYPOGRAPHY } from '@/constants/library';

interface StoryCountTextProps {
  count: number;
}

export const StoryCountText: React.FC<StoryCountTextProps> = ({ count }) => {
  const { t } = useAppTranslation('stories');

  return (
    <Text style={styles.text}>
      {count === 1
        ? t('library.storyCount', { count })
        : t('library.storiesCount', { count })}
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
