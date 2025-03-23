import { createTheme } from "@shopify/restyle"

const palette = {
  black: '#141414',
  white: '#EEF0F2',
  blue: '#0D21A1',
  darkblue: '#011638',
  yellow: '#EEC643',
  green: '#00A878',
  red: '#FF3D00',
}

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    primaryCardBackground: palette.blue,
    secondaryCardBackground: palette.yellow,
    textPrimary: palette.black,
    textSecondary: palette.white,
    textTertiary: palette.yellow,
    success: palette.green,
    error: palette.red,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    title: {
      fontSize: 32,
      fontFamily: 'SpaceMono-Regular',
      color: 'textPrimary',
    },
    subTitle: {
      fontSize: 24,
      fontFamily: 'SpaceMono-Regular',
      color: 'textPrimary',
    },
    body: {
      fontSize: 16,
      fontFamily: 'SpaceMono-Regular',
      color: 'textPrimary',
    },
    defaults: {
      fontSize: 16,
      fontFamily: 'SpaceMono-Regular',
      color: 'textPrimary',
    },
    'form-error': {
      fontSize: 14,
    }
  },
  borderRadii: {
    s: 4,
    m: 10,
    l: 25,
    xl: 75,
  },
});

const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBackground: palette.black,
    primaryCardBackground: palette.yellow,
    secondaryCardBackground: palette.darkblue,
    textPrimary: palette.white,
    textSecondary: palette.black,
    textTertiary: palette.yellow,
  },
};

export type Theme = typeof theme

export { theme, darkTheme }