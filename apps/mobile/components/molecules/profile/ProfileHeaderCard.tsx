import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ProfileAvatar } from '@/components/atoms/profile';
import { DualIcon } from '@/components/ui';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS, PROFILE_ICONS } from '@/constants/profile';

interface ProfileHeaderCardProps {
  name: string;
  avatarUrl?: string;
  onEditPress: () => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  name,
  avatarUrl,
  onEditPress,
}) => {
  return (
    <Pressable style={styles.container} onPress={onEditPress}>
      <ProfileAvatar name={name} imageUrl={avatarUrl} size={PROFILE_DIMENSIONS.avatarSize} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.editLabel}>Modifier le profil</Text>
      </View>
      <DualIcon icon={PROFILE_ICONS.chevronRight} size={16} color={PROFILE_COLORS.textMuted} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: PROFILE_DIMENSIONS.cardBorderRadius,
    padding: PROFILE_SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginLeft: PROFILE_SPACING.md,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Quicksand',
    color: PROFILE_COLORS.textPrimary,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.primary,
    marginTop: 2,
  },
});

export default ProfileHeaderCard;
