import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n.ts';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import App from './App.tsx';

import { theme } from './styles/global';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
