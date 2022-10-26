import {
  useTranslation as useAppTranslation,
  UseTranslationOptions,
} from 'react-i18next';
import i18n from 'utils/locales';

import en from './en';
import fr from './fr';

const NAME_SPACE = 'mainContainer';

export const useTranslation = (options?: UseTranslationOptions) =>
  useAppTranslation(NAME_SPACE, options);

export default i18n
  .addResourceBundle('en', NAME_SPACE, en)
  .addResourceBundle('fr', NAME_SPACE, fr);
