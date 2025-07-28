import { Platform } from 'react-native';

// Couleurs spécifiques à l'écran d'accueil
export const HOME_COLORS = {
  // Background
  gradientStart: '#FFF8E1',
  gradientEnd: '#FFE0F0',
  
  // Texte
  primaryText: '#2E7D32', // Vert foncé pour titres
  secondaryText: '#424242', // Contenu
  tertiaryText: '#616161', // Descriptions
  metaText: '#9E9E9E', // Meta infos
  
  // Avatar/Icônes
  avatarGradientStart: '#FF6B9D', // Rose
  avatarGradientEnd: '#FFB74D', // Orange
  
  // Badge âge
  ageBadge: '#4CAF50', // Vert sécurité
  
  // Cards
  cardBackground: 'rgba(255,255,255,0.9)',
  cardBorder: 'rgba(255,193,7,0.2)',
  
  // Icône lecture
  readingIconStart: '#2196F3', // Bleu kids
  readingIconEnd: '#03DAC6', // Cyan
  
  // États
  loading: '#FF6B9D',
  shadow: '#000',
} as const;

// Typographie iOS native
export const HOME_TYPOGRAPHY = {
  fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  
  // Tailles de police
  greeting: 24,
  subtitle: 16,
  cardTitle: 18,
  cardDescription: 14,
  storyTitle: 16,
  meta: 12,
  badge: 12,
  loading: 16,
  
  // Poids de police
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

// Espacements et dimensions
export const HOME_SPACING = {
  // Padding et margins
  screenHorizontal: 20,
  cardHorizontal: 20,
  cardVertical: 16,
  headerTop: 40,
  headerBottom: 32,
  
  // Tailles d'éléments
  avatar: 60,
  icon: 56,
  storyThumbnail: 48,
  ageBadge: {
    horizontal: 12,
    vertical: 6,
    radius: 16,
  },
  
  // Rayons de bordure
  cardRadius: 20,
  buttonRadius: 16,
  avatarRadius: 30,
  iconRadius: 28,
  
  // Ombres
  shadow: {
    offset: { width: 0, height: 4 },
    opacity: 0.08,
    radius: 16,
    elevation: 8,
  },
} as const;

// Durées d'animation
export const HOME_ANIMATIONS = {
  // Durées en millisecondes
  bounce: 600,
  press: 100,
  hover: 150,
  
  // Types d'animation
  springConfig: {
    damping: 20,
    stiffness: 400,
  },
  
  timingConfig: {
    duration: 100,
  },
} as const;

// Breakpoints responsive
export const HOME_BREAKPOINTS = {
  small: 375, // iPhone SE
  medium: 414, // iPhone Pro Max
  large: 768, // iPad
} as const;