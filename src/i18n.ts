import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { getNavigatorLanguage } from 'utils/getNavigatorLanguage';

import ptBr from 'assets/locales/ptBr';
import en from 'assets/locales/en';
import es from 'assets/locales/es';

const languageBrowserUser = getNavigatorLanguage();

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: languageBrowserUser,
  interpolation: {
    escapeValue: false
  },
  resources: { ptBr, en, es }
});
