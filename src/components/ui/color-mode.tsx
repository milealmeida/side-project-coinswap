import { ThemeProvider, useTheme } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export type ColorModeProviderProps = ThemeProviderProps;

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="system"
      enableSystem
      {...props}
    />
  );
}

export type ColorMode = 'light' | 'dark';

export type UseColorModeReturn = {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
};

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme();
  const colorMode = (resolvedTheme === 'dark' ? 'dark' : 'light') as ColorMode;

  const toggleColorMode = () => {
    setTheme(colorMode === 'dark' ? 'light' : 'dark');
  };

  return {
    colorMode,
    setColorMode: setTheme,
    toggleColorMode
  };
}

export function useColorModeValue<T>(lightValue: T, darkValue: T) {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? darkValue : lightValue;
}
