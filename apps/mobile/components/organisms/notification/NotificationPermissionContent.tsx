import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationCharacter, NotificationActionButtons } from '@/components/molecules/notification';
import { useAppTranslation } from '@/hooks/useAppTranslation';

const COLORS = {
  textPrimary: '#1F3D2B',
  textSecondary: '#4A6B5A',
  backgroundTop: '#FFF8F0',
  backgroundBottom: '#FFE5E5',
};

interface NotificationPermissionContentProps {
  onActivate: () => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export const NotificationPermissionContent: React.FC<NotificationPermissionContentProps> = ({
  onActivate,
  onSkip,
  isLoading = false,
}) => {
  const { t } = useAppTranslation('common');
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[COLORS.backgroundTop, COLORS.backgroundBottom]}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        {/* Hero section */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>{t('notifications.title')}</Text>
          <Text style={styles.subtitle}>
            {t('notifications.subtitle')}
          </Text>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <NotificationCharacter />
          </View>
        </View>

        {/* Boutons */}
        <View style={styles.buttonsContainer}>
          <NotificationActionButtons
            onActivate={onActivate}
            onSkip={onSkip}
            isLoading={isLoading}
          />
        </View>

        {/* Home indicator placeholder */}
        <View style={styles.homeIndicator} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Quicksand',
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    maxWidth: 280,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    marginTop: 'auto',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 100,
    opacity: 0.3,
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default NotificationPermissionContent;
