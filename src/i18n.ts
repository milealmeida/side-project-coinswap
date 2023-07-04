import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBr from 'constants/ptBr';
import en from 'constants/en';
import es from 'constants/es';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false
  },
  resources: { ptBr, en, es }
});

export default i18n;
