import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

export const light = {
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  surfaceSecondary: '#94A3B8',
  graphicElements: '#94A3B8',
  bgColor: '#F8FAFC',
  iconExchange: '#0F172A'
};

export const dark = {
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  surfaceSecondary: '#334155',
  graphicElements: '#334155',
  bgColor: '#0F172A',
  iconExchange: '#F8FAFC'
};

export const system = createSystem(
  defaultConfig,
  defineConfig({
    globalCss: {
      html: {
        fontSize: '62.5%'
      },
      '[data-sr-only]': {
        border: '0',
        clip: 'rect(0, 0, 0, 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: '0',
        position: 'absolute',
        width: '1px',
        whiteSpace: 'nowrap'
      },
      '[data-sr-only]:focus': {
        clip: 'auto',
        height: 'auto',
        width: 'auto',
        margin: '0',
        padding: '0.8rem 1.2rem',
        position: 'absolute',
        insetInlineStart: '1.6rem',
        insetBlockStart: '1.6rem',
        zIndex: 20,
        backgroundColor: 'bgColor',
        color: 'textPrimary'
      }
    },
    theme: {
      tokens: {
        colors: {
          primary: { value: '#02A724' },
          middleGray: { value: '#94A3B8' },
          accent: { value: '#7C3AED' }
        },
        fonts: {
          body: { value: `'Inter', sans-serif` },
          heading: { value: `'Inter', sans-serif` },
          mono: { value: `'Inter', sans-serif` }
        }
      },
      semanticTokens: {
        colors: {
          textPrimary: {
            value: { _light: light.textPrimary, _dark: dark.textPrimary }
          },
          textSecondary: {
            value: { _light: light.textSecondary, _dark: dark.textSecondary }
          },
          surfaceSecondary: {
            value: {
              _light: light.surfaceSecondary,
              _dark: dark.surfaceSecondary
            }
          },
          graphicElements: {
            value: {
              _light: light.graphicElements,
              _dark: dark.graphicElements
            }
          },
          bgColor: {
            value: { _light: light.bgColor, _dark: dark.bgColor }
          },
          iconExchange: {
            value: { _light: light.iconExchange, _dark: dark.iconExchange }
          }
        }
      }
    }
  })
);
