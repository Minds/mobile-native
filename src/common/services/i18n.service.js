import I18n, {
  getLanguages
} from 'react-native-i18n';
import { AsyncStorage } from 'react-native';

// languages
import en from '../../../locales/en';
import es from '../../../locales/es';



I18n.fallbacks = true;

I18n.translations = {
  en,
  es,
};

const namespace = '@Minds:Locale'

class I18nService {

  constructor() {

    // Get configured locale
    AsyncStorage.getItem(namespace)
      .then(locale => {
        if (locale) {
          I18n.locale = locale;
        } else {

          // Get default locale from device
          getLanguages().then(languages => {
            I18n.locale = languages[0].substr(0, 2);
          })
        }
      });
  }

  /**
   * Translate
   */
  t(scope, opt) {
    return I18n.t(scope, opt);
  }
  /**
   * Localize
   */
  l(scope, value, options) {
    return I18n.l(scope, value, options);
  }
  /**
   * Pluralize
   */
  p(count, scope, options){
    return I18n.p(count, scope, options);
  }

  /**
   * Get current locale
   */
  getCurrentLocale() {
    return I18n.currentLocale();
  }

  /**
   * Set locale
   * @param {string} locale
   */
  setLocale(locale) {
    AsyncStorage.setItem(namespace, locale);
    I18n.locale = locale;
  }

  /**
   * get supported locales
   */
  getSupportedLocales() {
    return [
      { name: 'Spanish', value: 'es' },
      { name: 'English', value: 'en' },
    ]
  }
}

export default new I18nService;