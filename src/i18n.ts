import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBr from 'assets/locales/ptBr';
import en from 'assets/locales/en';
import es from 'assets/locales/es';
import {
  applyDocumentLanguage,
  getInitialLanguage,
  persistLanguage
} from 'utils/userUtils';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: getInitialLanguage(),
  interpolation: {
    escapeValue: false
  },
  resources: { ptBr, en, es }
});

applyDocumentLanguage(i18n.language);
i18n.on('languageChanged', (language) => {
  applyDocumentLanguage(language);
  persistLanguage(language);
});
