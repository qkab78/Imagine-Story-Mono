import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SettingsIcon } from '@/components/atoms/profile';
import { DualIcon, type IconConfig } from '@/components/ui';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_ICONS } from '@/constants/profile';

interface SettingsItemProps {
  icon: IconConfig;
  label: string;
  value?: string;
  onPress: () => void;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  label,
  value,
  onPress,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <SettingsIcon icon={icon} />
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {value && <Text style={styles.value}>{value}</Text>}
      </View>
      <DualIcon icon={PROFILE_ICONS.chevronRight} size={16} color={PROFILE_COLORS.textMuted} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: PROFILE_SPACING.md,
    paddingHorizontal: PROFILE_SPACING.lg,
  },
  content: {
    flex: 1,
    marginLeft: PROFILE_SPACING.md,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textPrimary,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textMuted,
    marginTop: 2,
  },
});

export default SettingsItem;
