import { View, Text, StyleSheet } from 'react-native';
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile';

interface InfoRowProps {
  label: string;
  value: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  isFirst = false,
  isLast = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        isFirst && styles.first,
        isLast && styles.last,
        !isLast && styles.withBorder,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: PROFILE_SPACING.lg,
  },
  first: {
    paddingTop: 0,
  },
  last: {
    paddingBottom: 0,
  },
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: PROFILE_COLORS.separatorLight,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textMuted,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: PROFILE_SPACING.md,
  },
});

export default InfoRow;
