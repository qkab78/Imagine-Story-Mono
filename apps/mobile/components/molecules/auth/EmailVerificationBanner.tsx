import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile';
import { DualIcon } from '@/components/ui';
import { useTranslation } from 'react-i18next';

interface EmailVerificationBannerProps {
  onResendPress: () => void;
  onDismiss: () => void;
  isResending?: boolean;
}

export const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
  onResendPress,
  onDismiss,
  isResending = false,
}) => {
  const { t } = useTranslation('auth');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="mail-outline" size={20} color={PROFILE_COLORS.warningAlert.border} style={styles.icon} />
        <Text style={styles.message}>{t('verification.bannerMessage')}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, isResending && styles.buttonDisabled]}
          onPress={onResendPress}
          activeOpacity={0.7}
          disabled={isResending}
        >
          {isResending ? (
            <ActivityIndicator size="small" color={PROFILE_COLORS.surface} />
          ) : (
            <Text style={styles.buttonText}>{t('verification.resendButton')}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss} activeOpacity={0.7}>
          <DualIcon
            icon={{ sfSymbol: 'xmark', lucide: 'X' }}
            size={18}
            color={PROFILE_COLORS.warningAlert.text}
          />
        </TouchableOpacity>
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
    backgroundColor: PROFILE_COLORS.warningAlert.background,
    borderBottomWidth: 2,
    borderBottomColor: PROFILE_COLORS.warningAlert.border,
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
    color: PROFILE_COLORS.warningAlert.text,
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
    minWidth: 80,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
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

export default EmailVerificationBanner;
