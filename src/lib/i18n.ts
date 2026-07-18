import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en.json';
import arTranslation from '../locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    returnEmptyString: false,
  });

const applyDocumentLanguage = (lng: string) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
};

applyDocumentLanguage(i18n.resolvedLanguage || i18n.language || 'en');

i18n.on('languageChanged', applyDocumentLanguage);

export default i18n;
