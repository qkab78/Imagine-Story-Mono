import { View, Text, Pressable, StyleSheet } from 'react-native';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS } from '@/constants/profile';

interface PlanOptionProps {
  name: string;
  price: string;
  period: string;
  description: string;
  isSelected?: boolean;
  onPress: () => void;
}

export const PlanOption: React.FC<PlanOptionProps> = ({
  name,
  price,
  period,
  description,
  isSelected = false,
  onPress,
}) => {
  return (
    <Pressable
      style={[styles.container, isSelected && styles.selected]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.period}>{period}</Text>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: PROFILE_DIMENSIONS.cardBorderRadius,
    padding: PROFILE_SPACING.xl,
    borderWidth: 2,
    borderColor: PROFILE_COLORS.inputBorder,
    marginBottom: PROFILE_SPACING.md,
  },
  selected: {
    borderColor: PROFILE_COLORS.accent,
    backgroundColor: 'rgba(246, 193, 119, 0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PROFILE_SPACING.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Quicksand',
    color: PROFILE_COLORS.textPrimary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.primary,
  },
  period: {
    fontSize: 13,
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textMuted,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default PlanOption;
