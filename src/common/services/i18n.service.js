import React from 'react';
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import { memoize } from "lodash";
import { I18nManager } from "react-native";

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

class I18nService {

  constructor() {
    this.init();
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
  }

  init() {
    // fallback if no available language fits
    const fallback = { languageTag: "en", isRTL: false };

    const { languageTag, isRTL } =
      RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
      fallback;

    // clear translation cache
    translate.cache.clear();
    // update layout direction
    I18nManager.forceRTL(isRTL);

    // set i18n-js config
    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
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
    return I18n.l(scope, value, options);
  }

  /**
   * Pluralize
   */
  p(count, scope, options){
    return I18n.p(count, scope, options);
  }

  /**
   * Translate string and interpolate objects
   */
  to(scope, opt, values) {
    let translation = I18n.t(scope, opt);
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