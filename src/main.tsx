import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n.ts';

import { Provider } from 'components/ui/provider';

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
