// Constantes de design pour l'écran de lecture

export const READER_COLORS = {
  // Background
  background: '#FFF8F0',

  // Text
  textPrimary: '#1F3D2B',
  textSecondary: '#4A6B5A',
  textMuted: '#8BA598',

  // Accent
  accent: '#F6C177',
  primary: '#2F6B4F',

  // UI Elements
  surface: '#FFFFFF',
  overlay: 'rgba(255, 248, 240, 0.95)',
  separator: 'rgba(127, 184, 160, 0.2)',
  progressBackground: 'rgba(127, 184, 160, 0.3)',

  // Image placeholder gradient
  placeholderGradientStart: '#A8D4C0',
  placeholderGradientEnd: '#7FB8A0',
} as const;

export const READER_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const READER_DIMENSIONS = {
  headerHeight: 50,
  footerHeight: 80,
  navButtonSize: 44,
  backButtonSize: 36,
  chapterImageHeight: 280,
  progressBarHeight: 3,
  progressBarWidth: 120,
  dividerWidth: 60,
  dividerHeight: 3,
} as const;

export const READER_TYPOGRAPHY = {
  chapterIndicator: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  chapterTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
  },
  storyText: {
    fontSize: 18,
    lineHeight: 32,
  },
  dropCap: {
    fontSize: 56,
    fontWeight: '700' as const,
    lineHeight: 48,
  },
  pageNumber: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
} as const;

export const READER_ICONS = {
  back: { sfSymbol: 'chevron.left', lucide: 'ChevronLeft' },
  close: { sfSymbol: 'xmark', lucide: 'X' },
  previous: { sfSymbol: 'chevron.left', lucide: 'ChevronLeft' },
  next: { sfSymbol: 'chevron.right', lucide: 'ChevronRight' },
  menu: { sfSymbol: 'ellipsis', lucide: 'MoreVertical' },
  chapters: { sfSymbol: 'list.bullet', lucide: 'List' },
  check: { sfSymbol: 'checkmark', lucide: 'Check' },
} as const;

// Emojis par défaut pour les placeholders d'images de chapitres
export const CHAPTER_PLACEHOLDER_EMOJIS = [
  '🏰',
  '🌲',
  '🌙',
  '🦋',
  '🌈',
  '🐉',
  '🧚',
  '🌸',
  '🦄',
  '🌟',
] as const;
