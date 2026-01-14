import { View, Text, StyleSheet } from 'react-native';
import { DualIcon } from '@/components/ui';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_ICONS } from '@/constants/profile';

interface FeatureItemProps {
  text: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({
  text,
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
      <View style={styles.iconContainer}>
        <DualIcon icon={PROFILE_ICONS.check} size={14} color={PROFILE_COLORS.primary} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: PROFILE_SPACING.md,
    paddingVertical: PROFILE_SPACING.md,
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
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PROFILE_COLORS.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  text: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textPrimary,
    lineHeight: 22,
  },
});

export default FeatureItem;
