// Design constants for the Explore screen

export const EXPLORE_COLORS = {
  // Background gradient
  backgroundTop: '#FFF8F0',
  backgroundMiddle: '#FFEEE8',
  backgroundBottom: '#FFE5E5',

  // Text
  textPrimary: '#1F3D2B',
  textSecondary: '#4A6B5A',
  textMuted: '#8BA598',
  textLight: '#FFFFFF',

  // Accent
  accent: '#F6C177',
  accentDark: '#E8A957',
  primary: '#2F6B4F',
  primaryLight: '#3D7A5E',
  secondary: '#7FB8A0',

  // UI Elements
  surface: '#FFFFFF',
  cardShadow: 'rgba(31, 61, 43, 0.06)',
  searchBackground: '#FFFFFF',
  chipActiveStart: '#2F6B4F',
  chipActiveEnd: '#3D7A5E',
  chipInactive: '#FFFFFF',

  // Badge
  badgeNew: '#2F6B4F',
  badgePopular: '#F6C177',

  // Rating
  starFilled: '#F6C177',
  starEmpty: '#E0E0E0',

  // Decorative
  goldLine: '#F6C177',
} as const;

export const EXPLORE_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
} as const;

export const EXPLORE_DIMENSIONS = {
  // Header
  headerTitleSize: 34,
  goldLineWidth: 50,
  goldLineHeight: 4,

  // Search
  searchHeight: 52,
  searchBorderRadius: 16,

  // Cards
  featuredCardHeight: 320,
  featuredCardBorderRadius: 24,
  newReleaseCardWidth: 140,
  newReleaseCardHeight: 180,
  themeCardMinWidth: 130,
  themeCardHeight: 100,
  recommendedCardWidth: 200,
  recommendedCardHeight: 180,
  ageGroupCardHeight: 100,

  // Top stories
  topStoryCoverSize: 48,
  topStoryRankSize: 28,
} as const;

export const EXPLORE_TYPOGRAPHY = {
  headerTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  badge: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  searchPlaceholder: {
    fontSize: 15,
    fontWeight: '400' as const,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
} as const;

export const EXPLORE_ICONS = {
  // Navigation & Actions
  search: { sfSymbol: 'magnifyingglass', lucide: 'Search' },
  chevronRight: { sfSymbol: 'chevron.right', lucide: 'ChevronRight' },
  play: { sfSymbol: 'play.fill', lucide: 'Play' },
  book: { sfSymbol: 'book.fill', lucide: 'Book' },
  bookOpen: { sfSymbol: 'book.pages.fill', lucide: 'BookOpen' },
  close: { sfSymbol: 'xmark', lucide: 'X' },
  clock: { sfSymbol: 'clock.fill', lucide: 'Clock' },

  // Stars
  starFill: { sfSymbol: 'star.fill', lucide: 'Star' },
  star: { sfSymbol: 'star', lucide: 'Star' },

  // Categories
  sparkles: { sfSymbol: 'sparkles', lucide: 'Sparkles' },
  wand: { sfSymbol: 'wand.and.stars', lucide: 'Wand2' },
  map: { sfSymbol: 'map.fill', lucide: 'Map' },
  pawprint: { sfSymbol: 'pawprint.fill', lucide: 'PawPrint' },
  heart: { sfSymbol: 'heart.fill', lucide: 'Heart' },
  graduationcap: { sfSymbol: 'graduationcap.fill', lucide: 'GraduationCap' },

  // Sections
  flame: { sfSymbol: 'flame.fill', lucide: 'Flame' },
  crown: { sfSymbol: 'crown.fill', lucide: 'Crown' },
  palette: { sfSymbol: 'paintpalette.fill', lucide: 'Palette' },
  person: { sfSymbol: 'person.fill', lucide: 'User' },

  // Tab bar
  compass: { sfSymbol: 'safari.fill', lucide: 'Compass' },
} as const;

export const EXPLORE_CATEGORIES = [
  { id: 'all', name: 'Tout', emoji: '✨', icon: EXPLORE_ICONS.sparkles },
  { id: 'magic', name: 'Magie', emoji: '🪄', icon: EXPLORE_ICONS.wand },
  { id: 'adventure', name: 'Aventure', emoji: '🗺️', icon: EXPLORE_ICONS.map },
  { id: 'animals', name: 'Animaux', emoji: '🦁', icon: EXPLORE_ICONS.pawprint },
  { id: 'friendship', name: 'Amitié', emoji: '💕', icon: EXPLORE_ICONS.heart },
  { id: 'school', name: 'École', emoji: '📚', icon: EXPLORE_ICONS.graduationcap },
] as const;

export const AGE_GROUPS = [
  { id: '3-5', label: '3-5 ans', emoji: '🧒', color: '#FF9AA2' },
  { id: '5-7', label: '5-7 ans', emoji: '👦', color: '#F6C177' },
  { id: '6-8', label: '6-8 ans', emoji: '🧒', color: '#7FB8A0' },
] as const;

export const THEME_COLORS: Record<string, [string, string]> = {
  forest: ['#2F6B4F', '#7FB8A0'],
  fairy: ['#FF9AA2', '#FFB7B2'],
  pirate: ['#2F4858', '#4A6B5A'],
  space: ['#7B68EE', '#9B7BB8'],
  ocean: ['#4A90D9', '#7FB8D9'],
  dinosaur: ['#8B4513', '#D2691E'],
  princess: ['#FFB6C1', '#FFC0CB'],
  superhero: ['#DC143C', '#FF6347'],
  default: ['#2F6B4F', '#7FB8A0'],
} as const;

// Default gradient colors for stories
export const DEFAULT_STORY_GRADIENTS: [string, string][] = [
  ['#2F6B4F', '#7FB8A0'],
  ['#FF9AA2', '#FFB7B2'],
  ['#7B68EE', '#9B7BB8'],
  ['#4A90D9', '#7FB8D9'],
  ['#F6C177', '#FFD9A0'],
] as const;

// Emojis for story cards
export const STORY_EMOJIS = [
  '🏰',
  '🦄',
  '🐉',
  '🧚',
  '🌲',
  '🌙',
  '🦋',
  '🌈',
  '🌸',
  '🌟',
  '🐻',
  '🦁',
  '🐰',
  '🦊',
  '🐧',
] as const;
