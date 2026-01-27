import { Text, StyleSheet } from 'react-native';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile';

interface VersionBadgeProps {
  version: string;
}

export const VersionBadge: React.FC<VersionBadgeProps> = ({ version }) => {
  const { t } = useAppTranslation('profile');

  return <Text style={styles.version}>{t('version', { version })}</Text>;
};

const styles = StyleSheet.create({
  version: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textMuted,
    textAlign: 'center',
    marginTop: PROFILE_SPACING.xxl,
    marginBottom: PROFILE_SPACING.lg,
  },
});

export default VersionBadge;
