// Constantes de design pour la bibliothèque

export const LIBRARY_COLORS = {
  primary: '#2F6B4F',
  primaryLight: '#3D7A5E',
  secondary: '#7FB8A0',
  accent: '#F6C177',
  accentWarm: '#E8A957',
  textPrimary: '#1F3D2B',
  textSecondary: '#4A6B5A',
  textMuted: '#8BA598',
  surface: '#FFF8F1',
  surfaceElevated: '#FFFFFF',
  backgroundTop: '#FFF8F0',
  backgroundBottom: '#FFE5E5',
  error: '#FF6B6B',
  success: '#4CAF50',
} as const;

export const LIBRARY_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const LIBRARY_TYPOGRAPHY = {
  title: {
    fontFamily: 'Quicksand',
    fontSize: 32,
    fontWeight: '700' as const,
  },
  storyCount: {
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  filterTab: {
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  cardTitle: {
    fontFamily: 'Quicksand',
    fontSize: 15,
    fontWeight: '700' as const,
  },
  cardMeta: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  badge: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '700' as const,
  },
} as const;

export const LIBRARY_DIMENSIONS = {
  cardCoverHeight: 180,
  cardBorderRadius: 20,
  cardInfoPadding: 12,
  badgeBorderRadius: 12,
  filterTabBorderRadius: 16,
  filterContainerBorderRadius: 20,
  searchButtonSize: 40,
  searchButtonBorderRadius: 12,
  progressBarHeight: 6,
  spinnerSize: 32,
  emojiSize: 48,
} as const;
