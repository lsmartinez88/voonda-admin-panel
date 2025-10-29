import { arTranslation } from './translations/ar';
import { enTranslation } from './translations/en';
import { esTranslation } from './translations/es';
import { frTranslation } from './translations/fr';
import { itTranslation } from './translations/it';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { zhTranslation } from './translations/zh';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: enTranslation,
    },
    ar: {
      translation: arTranslation,
    },
    es: {
      translation: esTranslation,
    },
    fr: {
      translation: frTranslation,
    },
    it: {
      translation: itTranslation,
    },
    zh: {
      translation: zhTranslation,
    },
  },
});

export default i18n;
