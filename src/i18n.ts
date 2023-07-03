import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from 'constants/resources';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false
  },
  resources: { ...resources }
});

export default i18n;
