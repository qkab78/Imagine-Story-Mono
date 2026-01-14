import { Pressable, Text, StyleSheet } from 'react-native';
import { DualIcon } from '@/components/ui';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_ICONS } from '@/constants/profile';

interface DeleteAccountButtonProps {
  onPress: () => void;
}

export const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <DualIcon icon={PROFILE_ICONS.delete} size={16} color={PROFILE_COLORS.danger} />
      <Text style={styles.text}>Supprimer mon compte</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PROFILE_SPACING.md,
    gap: PROFILE_SPACING.xs,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.danger,
  },
});

export default DeleteAccountButton;
