import { Pressable, View, Text, StyleSheet } from 'react-native';
import { EXPLORE_COLORS, EXPLORE_SPACING, EXPLORE_DIMENSIONS } from '@/constants/explore';
import type { AgeGroup } from '@/types/explore';

interface AgeGroupCardProps {
  ageGroup: AgeGroup;
  isSelected?: boolean;
  onPress: () => void;
}

export const AgeGroupCard: React.FC<AgeGroupCardProps> = ({
  ageGroup,
  isSelected = false,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: isSelected ? ageGroup.color : 'transparent' },
      ]}
    >
      <View style={[styles.emojiContainer, { backgroundColor: ageGroup.color }]}>
        <Text style={styles.emoji}>{ageGroup.emoji}</Text>
      </View>
      <Text style={styles.label}>{ageGroup.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: EXPLORE_COLORS.surface,
    borderRadius: 16,
    padding: EXPLORE_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: EXPLORE_DIMENSIONS.ageGroupCardHeight,
    borderWidth: 2,
    shadowColor: EXPLORE_COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: EXPLORE_SPACING.sm,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textPrimary,
    textAlign: 'center',
  },
});

export default AgeGroupCard;
