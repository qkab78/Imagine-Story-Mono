import { Pressable, Text, StyleSheet } from 'react-native';
import { DualIcon } from '@/components/ui';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS, PROFILE_ICONS } from '@/constants/profile';

interface LogoutButtonProps {
  onPress: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <DualIcon icon={PROFILE_ICONS.logout} size={18} color={PROFILE_COLORS.danger} />
      <Text style={styles.text}>Se déconnecter</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PROFILE_COLORS.surface,
    borderWidth: 1.5,
    borderColor: PROFILE_COLORS.danger,
    borderRadius: PROFILE_DIMENSIONS.buttonBorderRadius,
    paddingVertical: PROFILE_SPACING.lg,
    paddingHorizontal: PROFILE_SPACING.xxl,
    gap: PROFILE_SPACING.sm,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.danger,
  },
});

export default LogoutButton;
