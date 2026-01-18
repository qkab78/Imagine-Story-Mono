import { View, Modal, Pressable, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { DualIcon } from '@/components/ui'
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS, PROFILE_ICONS } from '@/constants/profile'
import { formatShortDate } from '@/utils/dateFormatter'

interface QuotaExceededModalProps {
  visible: boolean
  onClose: () => void
  onUpgrade: () => void
  resetDate: string | null
  limit: number | null
}

export const QuotaExceededModal: React.FC<QuotaExceededModalProps> = ({
  visible,
  onClose,
  onUpgrade,
  resetDate,
  limit,
}) => {
  const insets = useSafeAreaInsets()
  const formattedDate = formatShortDate(resetDate)

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { marginBottom: insets.bottom }]}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[PROFILE_COLORS.subscriptionGradientStart, PROFILE_COLORS.subscriptionGradientEnd]}
              style={styles.iconGradient}
            >
              <Text style={styles.iconEmoji}>📚</Text>
            </LinearGradient>
          </View>

          <Text style={styles.title}>Limite mensuelle atteinte</Text>

          <Text style={styles.description}>
            Tu as utilisé tes {limit} histoires gratuites ce mois-ci.
          </Text>

          {formattedDate && (
            <View style={styles.resetInfo}>
              <DualIcon
                icon={{ sfSymbol: 'calendar', lucide: 'Calendar' }}
                size={16}
                color={PROFILE_COLORS.textSecondary}
              />
              <Text style={styles.resetText}>
                Ton quota sera renouvelé le {formattedDate}
              </Text>
            </View>
          )}

          <View style={styles.premiumBenefits}>
            <Text style={styles.benefitsTitle}>Avec Premium, profite de :</Text>
            <View style={styles.benefitItem}>
              <DualIcon
                icon={PROFILE_ICONS.sparkles}
                size={14}
                color={PROFILE_COLORS.primary}
              />
              <Text style={styles.benefitText}>Histoires illimitées</Text>
            </View>
            <View style={styles.benefitItem}>
              <DualIcon
                icon={{ sfSymbol: 'globe', lucide: 'Globe' }}
                size={14}
                color={PROFILE_COLORS.primary}
              />
              <Text style={styles.benefitText}>Toutes les langues</Text>
            </View>
            <View style={styles.benefitItem}>
              <DualIcon
                icon={{ sfSymbol: 'sparkle', lucide: 'Sparkle' }}
                size={14}
                color={PROFILE_COLORS.primary}
              />
              <Text style={styles.benefitText}>Fonctionnalités exclusives</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={onUpgrade}>
              <DualIcon
                icon={PROFILE_ICONS.crown}
                size={18}
                color="white"
              />
              <Text style={styles.primaryButtonText}>Passer à Premium</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Plus tard</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: PROFILE_SPACING.xl,
  },
  container: {
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: PROFILE_DIMENSIONS.sectionBorderRadius,
    padding: PROFILE_SPACING.xxl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: PROFILE_SPACING.xl,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Quicksand',
    color: PROFILE_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: PROFILE_SPACING.md,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: PROFILE_SPACING.lg,
  },
  resetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PROFILE_COLORS.iconBackground,
    paddingHorizontal: PROFILE_SPACING.md,
    paddingVertical: PROFILE_SPACING.sm,
    borderRadius: 12,
    marginBottom: PROFILE_SPACING.xl,
  },
  resetText: {
    fontSize: 13,
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
  },
  premiumBenefits: {
    width: '100%',
    backgroundColor: `${PROFILE_COLORS.primary}08`,
    borderRadius: 12,
    padding: PROFILE_SPACING.lg,
    marginBottom: PROFILE_SPACING.xl,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textPrimary,
    marginBottom: PROFILE_SPACING.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: PROFILE_SPACING.sm,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
  },
  actions: {
    width: '100%',
    gap: PROFILE_SPACING.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PROFILE_COLORS.primary,
    borderRadius: 12,
    paddingVertical: PROFILE_SPACING.lg,
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
    alignItems: 'center',
    paddingVertical: PROFILE_SPACING.md,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
  },
})

export default QuotaExceededModal
