// Constantes de design pour l'écran profil

export const PROFILE_COLORS = {
  // Background
  backgroundTop: '#FFF8F0',
  backgroundBottom: '#FFE5E5',
  surface: '#FFFFFF',

  // Premium gradient
  premiumGradientStart: '#F6C177',
  premiumGradientEnd: '#E8A957',

  // Avatar gradient
  avatarGradientStart: '#2F6B4F',
  avatarGradientEnd: '#7FB8A0',

  // Text
  textPrimary: '#1F3D2B',
  textSecondary: '#4A6B5A',
  textMuted: '#8BA598',

  // Icons
  iconBackground: 'rgba(47, 107, 79, 0.08)',
  iconColor: '#2F6B4F',

  // Separators
  separator: 'rgba(127, 184, 160, 0.1)',

  // Actions
  primary: '#2F6B4F',
  accent: '#F6C177',
  danger: '#FF6B6B',
  dangerLight: 'rgba(255, 107, 107, 0.1)',
} as const;

export const PROFILE_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const PROFILE_DIMENSIONS = {
  avatarSize: 48,
  avatarSizeLarge: 80,
  iconContainerSize: 40,
  iconSize: 20,
  cardBorderRadius: 16,
  sectionBorderRadius: 20,
  buttonBorderRadius: 16,
  toggleHeight: 28,
} as const;

export const PROFILE_ICONS = {
  // Account
  user: { sfSymbol: 'person.fill', lucide: 'User' },
  subscription: { sfSymbol: 'creditcard.fill', lucide: 'CreditCard' },
  edit: { sfSymbol: 'pencil', lucide: 'Pencil' },
  chevronRight: { sfSymbol: 'chevron.right', lucide: 'ChevronRight' },

  // Preferences
  notifications: { sfSymbol: 'bell.fill', lucide: 'Bell' },
  language: { sfSymbol: 'globe', lucide: 'Globe' },

  // Support
  help: { sfSymbol: 'message.fill', lucide: 'MessageCircle' },
  rating: { sfSymbol: 'star.fill', lucide: 'Star' },
  terms: { sfSymbol: 'doc.text.fill', lucide: 'FileText' },
  privacy: { sfSymbol: 'lock.fill', lucide: 'Lock' },

  // Premium
  crown: { sfSymbol: 'crown.fill', lucide: 'Crown' },

  // Actions
  logout: { sfSymbol: 'rectangle.portrait.and.arrow.right', lucide: 'LogOut' },
  delete: { sfSymbol: 'trash.fill', lucide: 'Trash2' },
} as const;

// @todo: add external urls
export const PROFILE_EXTERNAL_URLS = {
  help: 'mailto:support@imaginestory.app',
  terms: 'https://imaginestory.app/terms',
  privacy: 'https://imaginestory.app/privacy',
} as const;
