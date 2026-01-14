import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import { LIBRARY_COLORS, LIBRARY_SPACING } from '@/constants/library';

interface FilterToggleProps {
  emoji: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({
  emoji,
  title,
  description,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: '#E5E5E5',
          true: LIBRARY_COLORS.accent,
        }}
        thumbColor={Platform.OS === 'android' ? 'white' : undefined}
        ios_backgroundColor="#E5E5E5"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: LIBRARY_SPACING.lg,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: LIBRARY_SPACING.md,
  },
  emoji: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: LIBRARY_COLORS.textPrimary,
  },
  description: {
    fontSize: 14,
    color: LIBRARY_COLORS.textSecondary,
    marginTop: 2,
  },
});

export default FilterToggle;
