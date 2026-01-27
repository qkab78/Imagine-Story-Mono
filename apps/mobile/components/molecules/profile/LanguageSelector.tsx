/**
 * LanguageSelector - Composant pour la sélection de la langue de l'application
 * Respecte le design system du profil
 */

import { View, Text, Pressable, StyleSheet, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SheetHeader } from '@/components/atoms/profile';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS } from '@/constants/profile';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import type { SupportedLanguage } from '@/locales/types';

/**
 * Options de langue disponibles
 */
const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'fr', label: 'Francais', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { t, language, changeLanguage } = useAppTranslation('profile');

  const handleSelectLanguage = (code: SupportedLanguage) => {
    changeLanguage(code);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[PROFILE_COLORS.backgroundTop, PROFILE_COLORS.backgroundBottom]}
        style={styles.container}
      >
        <View style={{ paddingTop: insets.top }}>
          <SheetHeader title={t('languageSelector.title')} onBack={onClose} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + PROFILE_SPACING.xxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.description}>{t('languageSelector.description')}</Text>

          <View style={styles.optionsContainer}>
            {LANGUAGE_OPTIONS.map((option) => (
              <Pressable
                key={option.code}
                style={[
                  styles.option,
                  language === option.code && styles.optionSelected,
                ]}
                onPress={() => handleSelectLanguage(option.code)}
              >
                <Text style={styles.flag}>{option.flag}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    language === option.code && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {language === option.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: PROFILE_SPACING.xl,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
    marginBottom: PROFILE_SPACING.xl,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: PROFILE_SPACING.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: PROFILE_DIMENSIONS.cardBorderRadius,
    padding: PROFILE_SPACING.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: PROFILE_COLORS.primary,
    backgroundColor: `${PROFILE_COLORS.primary}10`,
  },
  flag: {
    fontSize: 28,
    marginRight: PROFILE_SPACING.md,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textPrimary,
  },
  optionLabelSelected: {
    color: PROFILE_COLORS.primary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PROFILE_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LanguageSelector;
