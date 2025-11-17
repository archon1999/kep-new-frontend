import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEn from './langs/en.json';
import translationRu from './langs/ru.json';
import translationUz from './langs/uz.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      enUS: { translation: translationEn },
      ruRU: { translation: translationRu },
      uzUZ: { translation: translationUz },
    },
    lng: 'enUS',
    ns: ['translation'],
    fallbackLng: 'enUS',
    debug: false,
  });

export default i18n;
