import { extendTheme } from '@chakra-ui/react';

const colors = {
  highlight: '#02A724',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  surfacePrimary: '#FFFFFF',
  surfaceSsecondary: '#94A3B8',
  graphicElements: '#94A3B8',
  bgColor: '#F8FAFC',
};

const fonts = {
  body: `'Inter', sans-serif`,
  heading: `'Inter', sans-serif`,
  mono: `'Inter', sans-serif`,
};

export const theme = extendTheme({ colors, fonts });