import React from 'react';
import get from 'lodash/get';
import memoize from 'lodash/memoize';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import { I18nManager, NativeModules, Platform } from 'react-native';
import moment from 'moment-timezone';
import { action, observable } from 'mobx';
import { storages } from './storage/storages.service';
// importing directly to use the type
import enLocale from '../../../locales/en.json';
import i18next from 'utils/locales';

// get all possible key paths
type DeepKeys<T> = T extends object
  ? {
      // @ts-ignore
      [K in keyof T]-?: `${K & string}` | Concat<K & string, DeepKeys<T[K]>>;
    }[keyof T]
  : '';

// or: only get leaf and no intermediate key path
type DeepLeafKeys<T> = T extends object
  ? // @ts-ignore
    { [K in keyof T]-?: Concat<K & string, DeepKeys<T[K]>> }[keyof T]
  : '';
type Concat<K extends string, P extends string> = `${K}${'' extends P
  ? ''
  : '.'}${P}`;

export type LocaleType = typeof enLocale;

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => {
    return enLocale;
  },
  es: () => {
    require('moment/locale/es');
    moment.locale('es');
    return require('../../../locales/es.json');
  },
  ar: () => {
    require('moment/locale/ar');
    moment.locale('ar');
    return require('../../../locales/ar.json');
  },
  de: () => {
    require('moment/locale/de');
    moment.locale('de');
    return require('../../../locales/de.json');
  },
  fr: () => {
    require('moment/locale/fr');
    moment.locale('fr');
    return require('../../../locales/fr.json');
  },
  hi: () => {
    require('moment/locale/hi');
    moment.locale('hi');
    return require('../../../locales/hi.json');
  },
  it: () => {
    require('moment/locale/it');
    moment.locale('it');
    return require('../../../locales/it.json');
  },
  ja: () => {
    require('moment/locale/ja');
    moment.locale('ja');
    return require('../../../locales/ja.json');
  },
  pt: () => {
    require('moment/locale/pt');
    moment.locale('pt');
    return require('../../../locales/pt.json');
  },
  ru: () => {
    require('moment/locale/ru');
    moment.locale('ru');
    return require('../../../locales/ru.json');
  },
  th: () => {
    require('moment/locale/th');
    moment.locale('th');
    return require('../../../locales/th.json');
  },
  vi: () => {
    require('moment/locale/vi');
    moment.locale('vi');
    return require('../../../locales/vi.json');
  },
  zh: () => {
    require('moment/locale/zh-cn');
    moment.locale('zh-cn');
    return require('../../../locales/zh.json');
  },
  sk: () => {
    require('moment/locale/sk');
    moment.locale('sk');
    return require('../../../locales/sk.json');
  },
};

export const SupportedLanguages = Object.keys(translationGetters);

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

type DateFormat = {
  date: string;
  short: string;
  nameDay: string;
  datetime: string;
};

class I18nService {
  @observable locale = 'en';
  bestLocale = 'en';
  dateFormat?: DateFormat;

  constructor() {
    if (process.env.JEST_WORKER_ID === undefined) {
      this.init();
    }
    i18n.fallbacks = true;
    i18n.defaultLocale = 'en';
  }

  /**
   * Initialize service
   */
  init() {
    // read locale from storage
    let language = storages.app.getString('locale');
    // get best available language when app start
    this.bestLocale = this.getBestLanguage();

    if (!language) {
      language = this.bestLocale;
    }

    this.setLocale(language, false);
  }

  /**
   * Get best available language
   */
  getBestLanguage() {
    // fallback if no available language fits
    const fallback = { languageTag: 'en' };
    let { languageTag } =
      RNLocalize.findBestAvailableLanguage(SupportedLanguages) || fallback;
    return languageTag;
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
  t<P extends DeepLeafKeys<LocaleType>>(scope: P, options?: object): string {
    return translate(scope, options);
  }

  /**
   * Translate with fallback
   */
  tf(scope: string, fallback: string, options?: object) {
    const translation = translate(scope, options);
    if (
      translation.includes('missing') &&
      translation.includes('translation')
    ) {
      return fallback;
    }
    return translation;
  }

  /**
   * Localize
   */
  l(scope: string, value, options?: object) {
    return i18n.l(scope, value, options);
  }

  date(
    value: moment.MomentInput,
    format: 'date' | 'nameDay' | 'time' | 'friendly' | 'datetime' = 'datetime',
    timezone = '',
    suffix = false, // for friendly format
  ) {
    if (!this.dateFormat) {
      return '';
    }

    let options;
    const date = moment(value);

    if (timezone) {
      date.tz(timezone);
    }

    switch (format) {
      case 'date':
        options = this.dateFormat.date;
        break;
      case 'nameDay':
        if (date.isSame(moment().subtract(1, 'day'), 'day')) {
          return i18n.t('yesterday');
        }
        options = this.dateFormat.nameDay;
        break;
      case 'time':
        options = 'hh:mm';
        break;
      case 'friendly':
        const now = moment();
        const diff = moment.duration(date.diff(now));

        if (diff.asMilliseconds() > -86400000) {
          return diff.humanize(suffix);
        }
        return now.year() === date.year()
          ? date.format(this.dateFormat.short)
          : date.format(this.dateFormat.date);
      case 'datetime':
      default:
        options = this.dateFormat.datetime;
    }

    return date.format(options);
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
    keys.forEach(key => (placeHolders[key] = `{{${key}}}`));
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
  @action
  setLocale(locale: string, store = true) {
    if (store) {
      storages.app.setString('locale', locale);
    }

    i18next.changeLanguage(locale);

    // clear translation cache
    if (translate.cache !== undefined && translate.cache.clear !== undefined) {
      translate.cache.clear();
    }
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

    if (locale === 'en' || locale === 'es') {
      moment.updateLocale(locale, {
        relativeTime: {
          s: '%ds',
          ss: '%ds',
          m: '%dm',
          mm: '%dm',
          h: '%dh',
          hh: '%dh',
        },
      });
    }

    // least number of hours to be considered a day.
    moment.relativeTimeThreshold('h', 24); // default is 22
    moment.relativeTimeThreshold('m', 50); // default is 45

    this.dateFormat = {
      date:
        get(i18n.translations[locale], 'dateformats.date') ||
        get(i18n.translations.en, 'dateformats.date'),
      nameDay:
        get(i18n.translations[locale], 'dateformats.nameDay') ||
        get(i18n.translations.en, 'dateformats.nameDay'),
      datetime:
        get(i18n.translations[locale], 'dateformats.datetime') ||
        get(i18n.translations.en, 'dateformats.datetime'),
      short:
        get(i18n.translations[locale], 'dateformats.short') ||
        get(i18n.translations.en, 'dateformats.short'),
    };

    // update observable to fire app reload
    this.locale = locale;

    if (store) {
      this.setLocaleBackend();
    }
  }

  /**
   * Send locale to the backend
   */
  setLocaleBackend() {
    // test fails if we use import
    const api = require('./api.service').default;
    api.post('api/v1/settings', {
      language: this.locale,
    });
  }

  getCurrentLanguageName() {
    const locale = i18n.currentLocale();
    const obj = this.getSupportedLocales().find(l => l.value === locale);
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
      { name: 'Thai', value: 'th' },
      { name: 'Vietnamese', value: 'vi' },
      { name: 'Chinese', value: 'zh' },
      { name: 'Slovak', value: 'sk' },
    ];
  }

  getDeviceLocale() {
    return (
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages?.[0]
        : NativeModules.I18nManager.localeIdentifier
    ).replace(/_/g, '-');
  }
}

export default new I18nService();
