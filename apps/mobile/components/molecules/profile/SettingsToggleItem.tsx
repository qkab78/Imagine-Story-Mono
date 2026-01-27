import { View, Text, Switch, StyleSheet } from 'react-native';
import { SettingsIcon } from '@/components/atoms/profile';
import { type IconConfig } from '@/components/ui';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile';

interface SettingsToggleItemProps {
  icon: IconConfig;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const SettingsToggleItem: React.FC<SettingsToggleItemProps> = ({
  icon,
  label,
  value,
  onValueChange,
}) => {
  const { t } = useAppTranslation('common');

  return (
    <View style={styles.container}>
      <SettingsIcon icon={icon} />
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.status}>{value ? t('toggle.enabled') : t('toggle.disabled')}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: '#E0E0E0',
          true: PROFILE_COLORS.primary,
        }}
        thumbColor="white"
        ios_backgroundColor="#E0E0E0"
      />
    </View>
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
  status: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textMuted,
    marginTop: 2,
  },
});

export default SettingsToggleItem;
