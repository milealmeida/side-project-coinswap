import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBr from 'assets/locales/ptBr';
import en from 'assets/locales/en';
import es from 'assets/locales/es';

const handleNavigatorLanguage = () => {
  if (navigator.language === 'es') return 'es';
  if (navigator.language === 'pt-BR') return 'ptBr';

  return 'en';
};

const languageBrowserUser = handleNavigatorLanguage();

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: languageBrowserUser,
  interpolation: {
    escapeValue: false
  },
  resources: { ptBr, en, es }
});

export default i18n;
