import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '@/components/ui/Text';
import { spacing } from '@/theme/spacing';

interface HeroEmojiProps {
  emoji: string;
  size?: number;
}

export const HeroEmoji: React.FC<HeroEmojiProps> = ({ emoji, size = 32 }) => {
  return (
    <Text style={[styles.emoji, { fontSize: size }]}>
      {emoji}
    </Text>
  );
};

const styles = StyleSheet.create({
  emoji: {
    marginBottom: spacing.xs,
  },
});

export default HeroEmoji;
