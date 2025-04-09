import { createTheme } from "@shopify/restyle"

const palette = {
  black: '#141414',
  white: '#FFFFFF',
  lemon: '#FAF0CA',
  lightBlue: '#B7D7F6',
  blue: '#93C3F1',
  darkblue: '#6FAFEC',
  yellow: '#F4D35E',
  green: '#00A878',
  red: '#FF3D00',
  brown: '#EE964B',
  tomato: '#F8764F',
  gray: '#0C0D34',
}

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    primaryCardBackground: palette.white,
    secondaryCardBackground: palette.brown,
    textPrimary: palette.black,
    textSecondary: palette.white,
    textTertiary: palette.yellow,
    success: palette.green,
    error: palette.red,
    tomato: palette.tomato,
    white: palette.white,
    blue: palette.blue,
    lightBlue: palette.lightBlue,
    darkBlue: palette.darkblue,
    yellow: palette.yellow,
    primary: palette.blue,
    gray: palette.gray,
    lightGray: "rgba(191, 195, 177, 0.4)",
    black: palette.black,
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
      fontFamily: 'SpaceMono-Bold',
      color: 'textPrimary',
    },
    subTitle: {
      fontSize: 24,
      fontFamily: 'SpaceMono-Bold',
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
      fontFamily: 'SpaceMono-Bold',
      color: 'textPrimary',
    },
    cardTitle: {
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