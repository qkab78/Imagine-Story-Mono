import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile';
import useAuthStore from '@/store/auth/authStore';

export default function EmailVerifiedScreen() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const handleGoHome = () => {
    // Update local user state to reflect email verification
    if (user) {
      setUser({ ...user, isEmailVerified: true });
    }

    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color={PROFILE_COLORS.primary} />
        </View>

        <Text style={styles.title}>{t('verification.confirmedTitle')}</Text>
        <Text style={styles.message}>{t('verification.confirmedMessage')}</Text>

        <TouchableOpacity style={styles.button} onPress={handleGoHome} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{t('verification.goToHome')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PROFILE_COLORS.backgroundTop,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PROFILE_SPACING.xxxl,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: PROFILE_SPACING.xxl,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: PROFILE_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: PROFILE_SPACING.lg,
  },
  message: {
    fontSize: 16,
    color: PROFILE_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: PROFILE_SPACING.xxxl,
  },
  button: {
    backgroundColor: PROFILE_COLORS.primary,
    paddingVertical: PROFILE_SPACING.lg,
    paddingHorizontal: PROFILE_SPACING.xxxl,
    borderRadius: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: PROFILE_COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
