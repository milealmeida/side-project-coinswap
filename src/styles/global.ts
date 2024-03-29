import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const colors = {
  primary: '#02A724',
  middleGray: '#94A3B8'
};

export const light = {
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  surfaceSecondary: '#94A3B8',
  graphicElements: '#94A3B8',
  bgColor: '#F8FAFC',
  iconExchange: '#0F172A',
  red: '#fa5252'
};

export const dark = {
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  surfaceSecondary: '#334155',
  graphicElements: '#334155',
  bgColor: '#0F172A',
  iconExchange: '#F8FAFC',
  red: '#ff6b6b'
};

const fonts = {
  body: `'Inter', sans-serif`,
  heading: `'Inter', sans-serif`,
  mono: `'Inter', sans-serif`
};

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: false
};

const styles = {
  global: {
    html: {
      fontSize: '62.5%'
    }
  }
};

export const theme = extendTheme({ colors, fonts, config, styles });
