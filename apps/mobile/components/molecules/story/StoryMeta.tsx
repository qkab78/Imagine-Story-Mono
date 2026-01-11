import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

interface StoryMetaProps {
  numberOfChapters: number;
  timeAgo: string;
}

export const StoryMeta: React.FC<StoryMetaProps> = ({ numberOfChapters, timeAgo }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.meta}>
        {numberOfChapters} chapitres
      </Text>
      <Text style={styles.timestamp}>
        {timeAgo}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  meta: {
    fontSize: typography.fontSize.sm,
    fontWeight: '400',
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  timestamp: {
    fontSize: typography.fontSize.sm,
    fontWeight: '400',
    color: colors.textTertiary,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
});

export default StoryMeta;
