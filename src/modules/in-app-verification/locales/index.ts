import {
  useTranslation as useAppTranslation,
  UseTranslationOptions,
} from 'react-i18next';
import i18n from 'utils/locales';
import 'modules/common/locales';

import en from './en';

const NAME_SPACE = 'InAppVerificationModule';

export const useTranslation = (options?: UseTranslationOptions) =>
  useAppTranslation(['common', NAME_SPACE], options);

export default i18n.addResourceBundle('en', NAME_SPACE, en);
