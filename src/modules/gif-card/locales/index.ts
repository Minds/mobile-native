import {
  useTranslation as useAppTranslation,
  UseTranslationOptions,
} from 'react-i18next';
import i18n from 'utils/locales';

import en from './en';

const NAME_SPACE = 'GiftCardModule';

export const useTranslation = (options?: UseTranslationOptions) =>
  useAppTranslation(NAME_SPACE, options);

export default i18n.addResourceBundle('en', NAME_SPACE, en);
