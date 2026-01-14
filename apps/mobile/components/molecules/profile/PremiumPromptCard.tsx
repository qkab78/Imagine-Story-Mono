import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DualIcon } from '@/components/ui';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS, PROFILE_ICONS } from '@/constants/profile';

interface PremiumPromptCardProps {
  onPress: () => void;
}

export const PremiumPromptCard: React.FC<PremiumPromptCardProps> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={[PROFILE_COLORS.premiumGradientStart, PROFILE_COLORS.premiumGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.iconContainer}>
          <DualIcon icon={PROFILE_ICONS.crown} size={20} color={PROFILE_COLORS.premiumGradientEnd} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Passer à Premium</Text>
          <Text style={styles.description}>
            Histoires illimitées et fonctionnalités exclusives
          </Text>
        </View>
        <DualIcon icon={PROFILE_ICONS.chevronRight} size={16} color="white" />
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: PROFILE_DIMENSIONS.cardBorderRadius,
    padding: PROFILE_SPACING.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: PROFILE_SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Quicksand',
    color: 'white',
  },
  description: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Nunito',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
});

export default PremiumPromptCard;
