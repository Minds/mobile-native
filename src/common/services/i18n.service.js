import React from 'react';
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import { memoize } from "lodash";
import { I18nManager } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require("../../../locales/en.json"),
  es: () => require("../../../locales/es.json"),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const namespace = '@Minds:Locale'

i18n.fallbacks = true;
i18n.defaultLocale = 'en';

class I18nService {

  constructor() {
    if(process.env.JEST_WORKER_ID === undefined) {
      this.init();
    }
  }

  async init() {
    let language = await AsyncStorage.getItem(namespace);

    if (!language) {
      // fallback if no available language fits
      const fallback = {languageTag: 'en'};
      let { languageTag } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
      language = languageTag;
    }

    this.setLocale(language, false)
  }

  handleLocalizationChange = () => {
    this.init();
  }

  /**
   * Translate
   */
  t(scope, opt) {
    return translate(scope, opt);
  }

  /**
   * Localize
   */
  l(scope, value, options) {
    return i18n.l(scope, value, options);
  }

  /**
   * Pluralize
   */
  p(count, scope, options){
    return i18n.p(count, scope, options);
  }

  /**
   * Translate string and interpolate objects
   */
  to(scope, opt, values) {
    let translation = i18n.t(scope, opt);
    const keys = Object.keys(values);
    const placeHolders = {};
    keys.forEach((key) => placeHolders[key] = `{{${key}}}`);
    const splitted = translation.split(/(?:&\{)(.*?)(?:\}&)/gm);
    const result = [];

    splitted.forEach((str, idx) => {
      if ((idx % 2) === 0) {
        result.push(str)
      } else {
        result.push(React.cloneElement(values[str], { key: idx }))
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
  setLocale(locale, store = true) {
    if (store) AsyncStorage.setItem(namespace, locale);
    // clear translation cache
    translate.cache.clear();
    // update layout direction
    I18nManager.forceRTL(false);

    // set i18n-js config
    if (locale === 'en') {
      i18n.translations = { [locale]: translationGetters[locale]() };
    } else {
      i18n.translations = { [locale]: translationGetters[locale](), en: translationGetters.en() };
    }
    i18n.locale = locale;
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