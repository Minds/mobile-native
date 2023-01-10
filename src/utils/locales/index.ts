import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { storages } from '~/common/services/storage/storages.service';

i18n.use(initReactI18next).init({
  resources: {
    en: {},
  },
  lng: 'en',
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
  },
});

const language = storages.app.getString('locale');
if (language) {
  i18n.changeLanguage(language);
}

export default i18n;
