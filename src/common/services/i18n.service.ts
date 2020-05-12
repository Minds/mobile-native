import React from 'react';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import { memoize } from 'lodash';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('../../../locales/en.json'),
  es: () => require('../../../locales/es.json'),
  ar: () => require('../../../locales/ar.json'),
  de: () => require('../../../locales/de.json'),
  fr: () => require('../../../locales/fr.json'),
  hi: () => require('../../../locales/hi.json'),
  it: () => require('../../../locales/it.json'),
  ja: () => require('../../../locales/ja.json'),
  pt: () => require('../../../locales/pt.json'),
  ru: () => require('../../../locales/ru.json'),
  vi: () => require('../../../locales/vi.json'),
  zh: () => require('../../../locales/zh.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const namespace = '@Minds:Locale';

class I18nService {
  constructor() {
    if (process.env.JEST_WORKER_ID === undefined) {
      this.init();
    }
    i18n.fallbacks = true;
    i18n.defaultLocale = 'en';
  }

  async init() {
    let language = await AsyncStorage.getItem(namespace);

    if (!language) {
      // fallback if no available language fits
      const fallback = { languageTag: 'en' };
      let { languageTag } =
        RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
        fallback;
      language = languageTag;
    }

    this.setLocale(language, false);
  }

  /**
   * Handle localization changes
   */
  handleLocalizationChange = () => {
    this.init();
  };

  /**
   * Translate
   */
  t(scope: string, options?: object) {
    return translate(scope, options);
  }

  /**
   * Localize
   */
  l(scope: string, value, options?: object) {
    return i18n.l(scope, value, options);
  }

  /**
   * Pluralize
   */
  p(count: number, scope: string, options?: object) {
    return i18n.p(count, scope, options);
  }

  /**
   * Translate string and interpolate objects
   */
  to(scope: string, opt, values: object) {
    let translation = i18n.t(scope, opt);
    const keys = Object.keys(values);
    const placeHolders = {};
    keys.forEach((key) => (placeHolders[key] = `{{${key}}}`));
    const splitted: Array<string> = translation.split(/(?:&\{)(.*?)(?:\}&)/gm);
    const result: Array<string | React.ReactNode> = [];

    splitted.forEach((str: string, idx: number) => {
      if (idx % 2 === 0) {
        result.push(str);
      } else {
        result.push(React.cloneElement(values[str], { key: idx }));
      }
    });
    return result;
  }

  /**
   * Get current locale
   */
  getCurrentLocale() {
    return i18n.currentLocale();
  }

  /**
   * Set locale
   * @param {string} locale
   */
  setLocale(locale: string, store = true) {
    if (store) {
      AsyncStorage.setItem(namespace, locale);
    }
    // clear translation cache
    translate.cache.clear();
    // update layout direction
    I18nManager.forceRTL(false);

    // set i18n-js config
    if (locale === 'en') {
      i18n.translations = { [locale]: translationGetters[locale]() };
    } else {
      i18n.translations = {
        [locale]: translationGetters[locale](),
        en: translationGetters.en(),
      };
    }
    i18n.locale = locale;
  }

  getCurrentLanguageName() {
    const locale = i18n.currentLocale();
    const obj = this.getSupportedLocales().find((l) => l.value === locale);
    if (obj) {
      return obj.name;
    }
    return '';
  }

  /**
   * get supported locales
   */
  getSupportedLocales() {
    return [
      { name: 'Spanish', value: 'es' },
      { name: 'English', value: 'en' },
      { name: 'Arabic', value: 'ar' },
      { name: 'German', value: 'de' },
      { name: 'French', value: 'fr' },
      { name: 'Hindi', value: 'hi' },
      { name: 'Italian', value: 'it' },
      { name: 'Japanese', value: 'ja' },
      { name: 'Portuguese', value: 'pt' },
      { name: 'Russian', value: 'ru' },
      { name: 'Vietnamese', value: 'vi' },
      { name: 'Chinese', value: 'zh' },
      { name: 'Slovak', value: 'sk' },
    ];
  }
}

export default new I18nService();
