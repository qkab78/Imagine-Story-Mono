import { createTheme } from "@shopify/restyle"

const palette = {
  black: '#141414',
  white: '#FAF0CA',
  blue: '#0D3B66',
  darkblue: '#011638',
  yellow: '#F4D35E',
  green: '#00A878',
  red: '#FF3D00',
  brown: '#EE964B',
  orange: '#F95738',
}

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    primaryCardBackground: palette.black,
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
    formError: {
      fontSize: 14,
    },
    buttonLabel: {
      fontSize: 16,
      fontFamily: 'SpaceMono-Regular',
      color: 'textPrimary',
    },
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
    primaryCardBackground: palette.white,
    secondaryCardBackground: palette.blue,
    textPrimary: palette.white,
    textSecondary: palette.black,
    textTertiary: palette.yellow,
  },
};

export type Theme = typeof theme

export { theme, darkTheme }