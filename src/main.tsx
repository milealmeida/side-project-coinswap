import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n.ts';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import App from './App.tsx';

import { theme } from './styles/global';

import { QueryClientProvider } from 'react-query';
import { queryClient } from 'services/queryClient.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
