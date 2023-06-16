import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const colors = {
  primary: '#02A724'
}

export const light = {
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  surfaceSecondary: '#94A3B8',
  graphicElements: '#94A3B8',
  bgColor: '#F8FAFC'
}

export const dark = {
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  surfaceSecondary: '#334155',
  graphicElements: '#334155',
  bgColor: '#0F172A'
}

const fonts = {
  body: `'Inter', sans-serif`,
  heading: `'Inter', sans-serif`,
  mono: `'Inter', sans-serif`
}

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: false
}

export const theme = extendTheme({ colors, fonts, config })
