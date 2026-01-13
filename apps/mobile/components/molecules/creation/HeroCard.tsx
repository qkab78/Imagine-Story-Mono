import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Hero } from '@/domain/stories/value-objects/Hero';
import { HeroEmoji } from '@/components/atoms/creation/HeroEmoji';
import { GlassCard } from '@/components/molecules/glass/GlassCard';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface HeroCardProps {
  hero: Hero;
  isSelected: boolean;
  onPress: (hero: Hero) => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ hero, isSelected, onPress }) => {
  return (
    <GlassCard
      glassStyle="clear"
      tintColor={isSelected ? 'rgba(107, 70, 193, 0.1)' : 'rgba(255, 255, 255, 0.05)'}
      onPress={() => onPress(hero)}
      borderRadius={16}
      padding={0}
      style={[
        styles.heroOption,
        isSelected && styles.heroSelected,
      ]}
    >
      <View
        accessibilityLabel={`Choisir ${hero.name}`}
        accessibilityRole="button"
      >
        <LinearGradient
          colors={
            isSelected
              ? [colors.primaryPink, colors.secondaryOrange]
              : [colors.secondaryOrange, '#FF8A65']
          }
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <HeroEmoji emoji={hero.emoji} />
          <Text style={styles.heroName}>{hero.name}</Text>
        </LinearGradient>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  heroOption: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: spacing.base,
    overflow: 'hidden',
    // borderRadius, borderWidth handled by GlassCard
  },
  heroSelected: {
    borderColor: colors.primaryPink,
    borderWidth: 3,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 16,
  },
  heroName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default HeroCard;
