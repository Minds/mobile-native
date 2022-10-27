---
to: "<%= absPath%>/locales/index.ts"
---
import {
  useTranslation as useAppTranslation,
  UseTranslationOptions,
} from 'react-i18next';
import i18n from 'utils/locales';

import en from './en';
import es from './es';

const NAME_SPACE = '<%=camelName%>Module';

export const useTranslation = (options?: UseTranslationOptions) =>
  useAppTranslation(NAME_SPACE, options);

export default i18n
  .addResourceBundle('en', NAME_SPACE, en)
  .addResourceBundle('es', NAME_SPACE, es);
