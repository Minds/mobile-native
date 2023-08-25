import {
  useTranslation as useAppTranslation,
  UseTranslationOptions,
} from 'react-i18next';
import i18n from 'utils/locales/';

// import en from './en';

const NAME_SPACE = 'AffiliateModule';

const en = {
  screenTitle: 'Affiliate Program',
  screenDescription:
    'You can share links with friends and audience members to purchase products on Minds through customized links and earn money on qualifying purchases.',
};

i18n.addResourceBundle('en', NAME_SPACE, en);

export const useTranslation = (options?: UseTranslationOptions) =>
  useAppTranslation(NAME_SPACE, options);
