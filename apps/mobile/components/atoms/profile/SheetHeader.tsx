import { View, Text, Pressable, StyleSheet } from 'react-native';
import { DualIcon } from '@/components/ui';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_ICONS } from '@/constants/profile';

interface SheetHeaderProps {
  title: string;
  onBack: () => void;
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({ title, onBack }) => {
  return (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <DualIcon icon={PROFILE_ICONS.chevronLeft} size={20} color={PROFILE_COLORS.textPrimary} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PROFILE_SPACING.xl,
    paddingVertical: PROFILE_SPACING.lg,
    gap: PROFILE_SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PROFILE_COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Quicksand',
    color: PROFILE_COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
});

export default SheetHeader;
