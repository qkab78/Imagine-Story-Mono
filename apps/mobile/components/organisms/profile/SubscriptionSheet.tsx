import { View, ScrollView, Modal, Pressable, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SheetHeader, SectionTitle, InfoRow } from '@/components/atoms/profile';
import {
  SubscriptionCard,
  FeatureItem,
  AlertBox,
} from '@/components/molecules/profile';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS } from '@/constants/profile';

interface SubscriptionSheetProps {
  visible: boolean;
  onClose: () => void;
  isPremium: boolean;
  price?: string;
  nextPaymentDate?: string;
  willRenew?: boolean;
  isLoading?: boolean;
  onPurchase: () => void;
  onRestore: () => void;
  onCancel: () => void;
}

export const SubscriptionSheet: React.FC<SubscriptionSheetProps> = ({
  visible,
  onClose,
  isPremium,
  price = '9,99€ / mois',
  nextPaymentDate,
  willRenew = true,
  isLoading = false,
  onPurchase,
  onRestore,
  onCancel,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation('subscription');
  const { t: tCommon } = useAppTranslation('common');

  // Features traduites
  const FREE_FEATURES = [
    t('features.free.storiesPerMonth'),
    t('features.free.allThemes'),
    t('features.free.frenchStories'),
  ];

  const PREMIUM_FEATURES = [
    t('features.premium.unlimited'),
    t('features.premium.allThemes'),
    t('features.premium.multilingual'),
    t('features.premium.pdfExport'),
    t('features.premium.noAds'),
  ];

  const handleCancel = () => {
    Alert.alert(
      t('cancelAlert.title'),
      t('cancelAlert.message'),
      [
        { text: tCommon('buttons.cancel'), style: 'cancel' },
        { text: t('cancelAlert.confirm'), style: 'destructive', onPress: onCancel },
      ]
    );
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
          <SheetHeader title={t('sheet.title')} onBack={onClose} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + PROFILE_SPACING.xxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Subscription Card */}
          <SubscriptionCard
            isPremium={isPremium}
            planName={isPremium ? t('sheet.premiumMonthly') : t('sheet.freeAccount')}
            description={
              isPremium
                ? t('sheet.premiumDescription')
                : t('sheet.freeDescription')
            }
          />

          {/* Premium: Renewal Alert */}
          {isPremium && nextPaymentDate && willRenew && (
            <AlertBox
              title={t('renewal.title')}
              text={t('renewal.message', {
                date: nextPaymentDate,
                price: price?.split(' /')[0] || t('plan.priceDefault'),
              })}
            />
          )}

          {/* Current Plan Features */}
          <View style={styles.section}>
            <SectionTitle>
              {isPremium ? t('sections.premiumBenefits') : t('sections.included')}
            </SectionTitle>
            <View style={styles.card}>
              {(isPremium ? PREMIUM_FEATURES : FREE_FEATURES).map((feature, index, arr) => (
                <FeatureItem
                  key={feature}
                  text={feature}
                  isFirst={index === 0}
                  isLast={index === arr.length - 1}
                />
              ))}
            </View>
          </View>

          {/* Free User: Premium Benefits Preview */}
          {!isPremium && (
            <View style={styles.section}>
              <SectionTitle>{t('sections.premiumPreview')}</SectionTitle>
              <View style={styles.card}>
                {PREMIUM_FEATURES.map((feature, index, arr) => (
                  <FeatureItem
                    key={feature}
                    text={feature}
                    isFirst={index === 0}
                    isLast={index === arr.length - 1}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Free User: Monthly Plan */}
          {!isPremium && (
            <View style={styles.section}>
              <SectionTitle>{t('sections.upgradeToPremium')}</SectionTitle>
              <View style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{t('plan.name')}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.planPrice}>{price || t('plan.priceDefault')}</Text>
                    <Text style={styles.planPeriod}>{t('plan.period')}</Text>
                  </View>
                </View>
                <Text style={styles.planDescription}>
                  {t('plan.description')}
                </Text>
              </View>
            </View>
          )}

          {/* Premium User: Management Section */}
          {isPremium && (
            <View style={styles.section}>
              <SectionTitle>{t('sections.management')}</SectionTitle>
              <View style={styles.card}>
                <InfoRow label={t('info.currentPlan')} value={t('plan.name')} isFirst />
                <InfoRow label={t('info.price')} value={price || `${t('plan.priceDefault')} ${t('plan.period')}`} />
                <InfoRow label={t('info.nextPayment')} value={nextPaymentDate || 'N/A'} isLast />
              </View>
            </View>
          )}

          {/* Actions */}
          {!isPremium ? (
            <View style={styles.actionsContainer}>
              <Pressable
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={onPurchase}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.primaryButtonText}>{t('actions.upgrade')}</Text>
                )}
              </Pressable>
              <Pressable
                style={styles.restoreButton}
                onPress={onRestore}
                disabled={isLoading}
              >
                <Text style={styles.restoreButtonText}>{t('actions.restore')}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.dangerButton} onPress={handleCancel}>
              <Text style={styles.dangerButtonText}>{t('actions.cancel')}</Text>
            </Pressable>
          )}
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
  section: {
    marginBottom: PROFILE_SPACING.xl,
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
  planCard: {
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: PROFILE_DIMENSIONS.cardBorderRadius,
    padding: PROFILE_SPACING.xl,
    borderWidth: 2,
    borderColor: PROFILE_COLORS.primary,
    shadowColor: PROFILE_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PROFILE_SPACING.sm,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textPrimary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.primary,
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    gap: PROFILE_SPACING.md,
  },
  primaryButton: {
    backgroundColor: PROFILE_COLORS.primary,
    borderRadius: 12,
    paddingVertical: PROFILE_SPACING.lg,
    alignItems: 'center',
    shadowColor: PROFILE_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: 'white',
  },
  restoreButton: {
    backgroundColor: 'transparent',
    paddingVertical: PROFILE_SPACING.md,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
  dangerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: PROFILE_COLORS.danger,
    borderRadius: 12,
    paddingVertical: PROFILE_SPACING.lg,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.danger,
  },
});

export default SubscriptionSheet;
