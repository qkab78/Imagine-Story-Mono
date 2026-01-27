import { View, ScrollView, Modal, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SheetHeader, InfoRow, SectionTitle } from '@/components/atoms/profile';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS } from '@/constants/profile';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PersonalInfoSheetProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  email: string;
  registrationDate: string;
  storiesCount: number;
}

export const PersonalInfoSheet: React.FC<PersonalInfoSheetProps> = ({
  visible,
  onClose,
  name,
  email,
  registrationDate,
  storiesCount,
}) => {
  const insets = useSafeAreaInsets();
  const { t, language } = useAppTranslation('profile');

  // Pluralisation pour le nombre d'histoires
  const storiesLabel =
    language === 'en'
      ? `${storiesCount} ${storiesCount === 1 ? 'story' : 'stories'}`
      : `${storiesCount} histoire${storiesCount > 1 ? 's' : ''}`;

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
          <SheetHeader title={t('personalInfo.title')} onBack={onClose} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + PROFILE_SPACING.xxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <InfoRow label={t('personalInfo.name')} value={name} isFirst />
            <InfoRow label={t('personalInfo.email')} value={email} />
            <InfoRow label={t('personalInfo.registrationDate')} value={registrationDate} />
            <InfoRow
              label={t('personalInfo.storiesCount')}
              value={storiesLabel}
              isLast
            />
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
  card: {
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: PROFILE_DIMENSIONS.cardBorderRadius,
    padding: PROFILE_SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default PersonalInfoSheet;
