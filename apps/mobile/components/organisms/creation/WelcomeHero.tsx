import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Text } from 'react-native';
import { FloatingIcon } from '@/components/atoms/creation';
import { colors } from '@/theme/colors';

export interface WelcomeHeroProps {
  /** Titre principal */
  title: string;

  /** Sous-titre/description */
  subtitle: string;

  /** Icône à afficher (emoji) */
  icon?: string;

  /** Taille de l'icône */
  iconSize?: number;
}

/**
 * WelcomeHero - Organism pour l'écran de bienvenue
 *
 * Section centrale de l'écran Welcome avec icône animée et textes.
 * Utilisé pour introduire le workflow de création d'histoire.
 *
 * @example
 * ```tsx
 * <WelcomeHero
 *   icon="✨"
 *   title="Créons une histoire magique"
 *   subtitle="Quelques questions pour personnaliser l'aventure de votre enfant"
 * />
 * ```
 */
export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  title,
  subtitle,
  icon = '✨',
  iconSize = 120,
}) => {
  return (
    <View style={styles.container}>
      <FloatingIcon
        icon={icon}
        size={iconSize}
        gradientColors={[colors.warmAmber, '#E8A957']}
      />

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 12,
    lineHeight: 38,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 25,
    maxWidth: 280,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
});

export default WelcomeHero;
