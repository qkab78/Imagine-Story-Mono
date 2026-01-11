import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Hero } from '@/domain/stories/value-objects/Hero';
import { HeroEmoji } from '@/components/atoms/creation/HeroEmoji';
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
    <TouchableOpacity
      style={[
        styles.heroOption,
        isSelected && styles.heroSelected,
      ]}
      onPress={() => onPress(hero)}
      activeOpacity={0.8}
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  heroOption: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: spacing.base,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  heroSelected: {
    borderColor: colors.primaryPink,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
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
