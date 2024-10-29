import i18n from 'i18next';
import { LanguageDetectorModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  SupportedLanguages,
  findBestAvailableLanguage,
} from '~/common/services/i18n.service';
import sp from '~/services/serviceProvider';

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () => {
    const language = sp.storages.app.getString('locale');
    if (language) {
      return language;
    }

    let { languageTag } = findBestAvailableLanguage(SupportedLanguages) || {
      languageTag: 'en',
    };

    return languageTag;
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    returnNull: false,
    resources: {
      en: {},
      es: {},
    },
    fallbackLng: 'en',
    lng: 'en',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
