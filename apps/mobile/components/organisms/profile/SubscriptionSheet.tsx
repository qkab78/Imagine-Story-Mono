import { useState } from 'react';
import { View, ScrollView, Modal, Pressable, Text, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SheetHeader, SectionTitle, InfoRow } from '@/components/atoms/profile';
import {
  SubscriptionCard,
  FeatureItem,
  PlanOption,
  AlertBox,
} from '@/components/molecules/profile';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS } from '@/constants/profile';

type PlanType = 'monthly' | 'yearly';

interface SubscriptionSheetProps {
  visible: boolean;
  onClose: () => void;
  isPremium: boolean;
  currentPlan?: string;
  nextPaymentDate?: string;
  price?: string;
  onUpgrade: (plan: PlanType) => void;
  onChangePlan: () => void;
  onCancel: () => void;
}

const FREE_FEATURES = [
  '3 histoires personnalisées par mois',
  'Tous les thèmes et ambiances',
  'Histoires en français',
];

const PREMIUM_FEATURES = [
  'Histoires illimitées',
  'Tous les thèmes et ambiances',
  'Multilingue',
  'Export en PDF',
  'Sans publicité',
];

export const SubscriptionSheet: React.FC<SubscriptionSheetProps> = ({
  visible,
  onClose,
  isPremium,
  currentPlan = 'Premium Mensuel',
  nextPaymentDate = '14 février 2026',
  price = '9,99€ / mois',
  onUpgrade,
  onChangePlan,
  onCancel,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');

  const handleUpgrade = () => {
    onUpgrade(selectedPlan);
  };

  const handleCancel = () => {
    Alert.alert(
      'Résilier l\'abonnement',
      'Êtes-vous sûr de vouloir résilier votre abonnement Premium ? Vous conserverez l\'accès jusqu\'à la fin de la période en cours.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Résilier', style: 'destructive', onPress: onCancel },
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
          <SheetHeader title="Abonnement" onBack={onClose} />
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
            planName={isPremium ? currentPlan : 'Compte Gratuit'}
            description={
              isPremium
                ? 'Histoires illimitées et fonctionnalités exclusives'
                : "Profitez de 3 histoires par mois pour découvrir la magie d'Imagine Story"
            }
          />

          {/* Premium: Renewal Alert */}
          {isPremium && (
            <AlertBox
              title="Renouvellement automatique"
              text={`Votre abonnement se renouvellera le ${nextPaymentDate} pour ${price?.split(' /')[0]}`}
            />
          )}

          {/* Current Plan Features */}
          <View style={styles.section}>
            <SectionTitle>{isPremium ? 'Vos avantages Premium' : 'Ce qui est inclus'}</SectionTitle>
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
              <SectionTitle>Avantages Premium</SectionTitle>
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

          {/* Free User: Plan Options */}
          {!isPremium && (
            <View style={styles.section}>
              <SectionTitle>Passer à Premium</SectionTitle>
              <PlanOption
                name="Premium Mensuel"
                price="9,99€"
                period="par mois"
                description="Histoires illimitées, langues multiples et fonctionnalités exclusives"
                isSelected={selectedPlan === 'monthly'}
                onPress={() => setSelectedPlan('monthly')}
              />
              <PlanOption
                name="Premium Annuel"
                price="99,99€"
                period="par an"
                description="Économisez 17% • 2 mois offerts"
                isSelected={selectedPlan === 'yearly'}
                onPress={() => setSelectedPlan('yearly')}
              />
            </View>
          )}

          {/* Premium User: Management Section */}
          {isPremium && (
            <View style={styles.section}>
              <SectionTitle>Gestion de l'abonnement</SectionTitle>
              <View style={styles.card}>
                <InfoRow label="Plan actuel" value={currentPlan} isFirst />
                <InfoRow label="Prix" value={price} />
                <InfoRow label="Prochain paiement" value={nextPaymentDate} isLast />
              </View>
            </View>
          )}

          {/* Actions */}
          {!isPremium ? (
            <Pressable style={styles.primaryButton} onPress={handleUpgrade}>
              <Text style={styles.primaryButtonText}>Passer à Premium</Text>
            </Pressable>
          ) : (
            <>
              <Pressable style={styles.secondaryButton} onPress={onChangePlan}>
                <Text style={styles.secondaryButtonText}>Changer de formule</Text>
              </Pressable>
              <Pressable style={styles.dangerButton} onPress={handleCancel}>
                <Text style={styles.dangerButtonText}>Résilier mon abonnement</Text>
              </Pressable>
            </>
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
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: PROFILE_COLORS.inputBorder,
    borderRadius: 12,
    paddingVertical: PROFILE_SPACING.lg,
    alignItems: 'center',
    marginBottom: PROFILE_SPACING.md,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
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
