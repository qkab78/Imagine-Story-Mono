import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ExpirationWarningLevel } from '@/types/subscription';
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile';
import { DualIcon } from '@/components/ui';

interface ExpirationWarningBannerProps {
  daysUntilExpiration: number;
  level: ExpirationWarningLevel;
  onRenewPress: () => void;
  onDismiss?: () => void;
}

const getBannerColors = (level: ExpirationWarningLevel) => {
  switch (level) {
    case 'info':
      return {
        ...PROFILE_COLORS.warningInfo,
        icon: PROFILE_COLORS.warningInfo.border,
      };
    case 'warning':
      return {
        ...PROFILE_COLORS.warningAlert,
        icon: PROFILE_COLORS.warningAlert.border,
      };
    case 'urgent':
      return {
        ...PROFILE_COLORS.warningUrgent,
        icon: PROFILE_COLORS.warningUrgent.border,
      };
    default:
      return {
        ...PROFILE_COLORS.warningInfo,
        icon: PROFILE_COLORS.warningInfo.border,
      };
  }
};

const getMessage = (days: number, level: ExpirationWarningLevel): string => {
  if (level === 'urgent') {
    return days === 1
      ? 'Urgent : votre abonnement expire demain !'
      : `Urgent : votre abonnement expire dans ${days} jours`;
  }
  if (level === 'warning') {
    return `Attention : il vous reste ${days} jours d'abonnement`;
  }
  return `Votre abonnement expire dans ${days} jours`;
};

const getIcon = (level: ExpirationWarningLevel): keyof typeof Ionicons.glyphMap => {
  if (level === 'urgent') return 'warning';
  if (level === 'warning') return 'alert-circle';
  return 'time-outline';
};

export const ExpirationWarningBanner: React.FC<ExpirationWarningBannerProps> = ({
  daysUntilExpiration,
  level,
  onRenewPress,
  onDismiss,
}) => {
  if (level === 'none') return null;

  const colors = getBannerColors(level);
  const message = getMessage(daysUntilExpiration, level);
  const icon = getIcon(level);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.content}>
        <Ionicons name={icon} size={20} color={colors.icon} style={styles.icon} />
        <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={onRenewPress} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Renouveler</Text>
        </TouchableOpacity>
        {onDismiss && (
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss} activeOpacity={0.7}>
            <DualIcon
              icon={{ sfSymbol: 'xmark', lucide: 'X' }}
              size={18}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: PROFILE_SPACING.md,
    paddingHorizontal: PROFILE_SPACING.lg,
    borderBottomWidth: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: PROFILE_SPACING.sm,
  },
  message: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PROFILE_SPACING.sm,
  },
  button: {
    backgroundColor: PROFILE_COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: PROFILE_SPACING.md,
    borderRadius: 16,
  },
  buttonText: {
    color: PROFILE_COLORS.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  dismissButton: {
    padding: PROFILE_SPACING.xs,
  },
});

export default ExpirationWarningBanner;
