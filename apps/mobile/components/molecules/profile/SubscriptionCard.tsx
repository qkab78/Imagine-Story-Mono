import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DualIcon } from '@/components/ui';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS, PROFILE_ICONS } from '@/constants/profile';

interface SubscriptionCardProps {
  isPremium: boolean;
  planName: string;
  description: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  isPremium,
  planName,
  description,
}) => {
  return (
    <LinearGradient
      colors={[PROFILE_COLORS.subscriptionGradientStart, PROFILE_COLORS.subscriptionGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.badge}>
        <DualIcon
          icon={isPremium ? PROFILE_ICONS.crown : PROFILE_ICONS.sparkles}
          size={14}
          color="white"
        />
        <Text style={styles.badgeText}>{isPremium ? 'Premium' : 'Gratuit'}</Text>
      </View>
      <Text style={styles.planName}>{planName}</Text>
      <Text style={styles.description}>{description}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: PROFILE_DIMENSIONS.sectionBorderRadius,
    padding: PROFILE_SPACING.xxl,
    marginBottom: PROFILE_SPACING.xl,
    shadowColor: PROFILE_COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: PROFILE_SPACING.md,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: PROFILE_SPACING.md,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: 'white',
  },
  planName: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Quicksand',
    color: 'white',
    marginBottom: PROFILE_SPACING.sm,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Nunito',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
});

export default SubscriptionCard;
