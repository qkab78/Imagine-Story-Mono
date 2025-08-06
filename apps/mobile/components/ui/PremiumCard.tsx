import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
  withRepeat,
  withDelay,
} from 'react-native-reanimated';

// Theme
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface PremiumCardProps {
  onUpgrade: () => void;
}

interface FeatureItemProps {
  icon: string;
  text: string;
}

// Composant FeatureItem
const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
};

// Composant principal PremiumCard
const PremiumCard: React.FC<PremiumCardProps> = ({ onUpgrade }) => {
  const buttonScale = useSharedValue(1);
  const crownRotation = useSharedValue(0);
  const shimmerTranslateX = useSharedValue(-100);

  // Animation de la couronne
  React.useEffect(() => {
    crownRotation.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 500 }),
        withTiming(-10, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      false
    );
  }, []);

  // Animation shimmer
  React.useEffect(() => {
    shimmerTranslateX.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(100, { duration: 2000 }),
          withDelay(3000, withTiming(-100, { duration: 0 }))
        ),
        -1,
        false
      )
    );
  }, []);

  const handleUpgradePress = () => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    runOnJS(onUpgrade)();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const crownAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${crownRotation.value}deg` }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslateX.value }],
  }));

  return (
    <View style={styles.premiumSection}>
      <View style={styles.premiumCard}>
        {/* Effet shimmer */}
        <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
        
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
          style={styles.premiumContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header Premium */}
          <View style={styles.premiumHeader}>
            <View style={styles.premiumTitle}>
              <Animated.Text style={[styles.crownIcon, crownAnimatedStyle]}>
                👑
              </Animated.Text>
              <Text style={styles.premiumTitleText}>Premium</Text>
            </View>
            <View style={styles.premiumBadge}>
              <Text style={styles.badgeText}>-50%</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.premiumDescription}>
            Débloquez toutes les histoires et fonctionnalités pour une expérience magique illimitée !
          </Text>

          {/* Features Grid */}
          <View style={styles.premiumFeatures}>
            <FeatureItem icon="📚" text="Histoires illimitées" />
            <FeatureItem icon="🎨" text="Personnalisation" />
            <FeatureItem icon="📱" text="Mode hors-ligne" />
            <FeatureItem icon="👥" text="Profils multiples" />
          </View>

          {/* Pricing */}
          <LinearGradient
            colors={['rgba(255, 107, 157, 0.1)', 'rgba(255, 107, 157, 0.05)']}
            style={styles.premiumPricing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.priceHeader}>
              <Text style={styles.priceAmount}>4,99</Text>
              <Text style={styles.priceCurrency}>€</Text>
            </View>
            <Text style={styles.pricePeriod}>par mois</Text>
            <Text style={styles.priceSubtitle}>au lieu de 9,99€</Text>
            <View style={styles.priceSavings}>
              <Text style={styles.savingsText}>Économisez 60€/an</Text>
            </View>
          </LinearGradient>

          {/* Upgrade Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable onPress={handleUpgradePress}>
              <LinearGradient
                colors={[colors.primaryPink, '#C44CF1']}
                style={styles.premiumButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>🚀 Passer Premium</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Trial Info */}
          <View style={styles.premiumTrial}>
            <Text style={styles.trialText}>
              <Text style={styles.trialLink}>7 jours d'essai gratuit</Text>
              <Text> • Annulable à tout moment</Text>
            </Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  premiumSection: {
    marginBottom: spacing.xl,
  },
  premiumCard: {
    borderRadius: 24,
    padding: 2,
    backgroundColor: `linear-gradient(135deg, ${colors.primaryPink} 0%, ${colors.secondaryOrange} 50%, #C44CF1 100%)`,
    shadowColor: colors.primaryPink,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    zIndex: 1,
  },
  premiumContent: {
    borderRadius: 22,
    padding: spacing.xl,
    position: 'relative',
    zIndex: 2,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  premiumTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  crownIcon: {
    fontSize: 24,
  },
  premiumTitleText: {
    fontSize: typography.fontSize.xl,
    fontWeight: "bold",
    color: colors.primaryPink,
    fontFamily: typography.fontFamily.primary,
    letterSpacing: -0.3,
  },
  premiumBadge: {
    backgroundColor: colors.secondaryOrange,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    shadowColor: colors.secondaryOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: "bold",
    fontFamily: typography.fontFamily.primary,
  },
  premiumDescription: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
    marginBottom: spacing.lg,
    textAlign: 'center',
    fontFamily: typography.fontFamily.primary,
  },
  premiumFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
    width: '47%',
  },
  featureIcon: {
    fontSize: 16,
    color: colors.safetyGreen,
  },
  featureText: {
    fontSize: typography.fontSize.xs,
    fontWeight: "semibold",
    color: colors.textPrimary,
    flex: 1,
    fontFamily: typography.fontFamily.primary,
  },
  premiumPricing: {
    borderRadius: 16,
    padding: spacing.base,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.3)',
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs / 2,
    marginBottom: spacing.xs / 2,
  },
  priceAmount: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: "bold",
    color: colors.primaryPink,
    letterSpacing: -0.2,
    fontFamily: typography.fontFamily.primary,
  },
  priceCurrency: {
    fontSize: typography.fontSize.lg,
    fontWeight: "bold",
    color: colors.primaryPink,
    fontFamily: typography.fontFamily.primary,
  },
  pricePeriod: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    fontWeight: "medium",
    fontFamily: typography.fontFamily.primary,
  },
  priceSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.primary,
  },
  priceSavings: {
    backgroundColor: colors.safetyGreen,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: 8,
  },
  savingsText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: typography.fontFamily.primary,
  },
  premiumButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryPink,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.base + 1,
    fontWeight: "bold",
    fontFamily: typography.fontFamily.primary,
    letterSpacing: -0.2,
  },
  premiumTrial: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  trialText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.primary,
  },
  trialLink: {
    color: colors.primaryPink,
    fontWeight: "semibold",
  },
});

export default PremiumCard;