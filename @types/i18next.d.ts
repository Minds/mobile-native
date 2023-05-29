// i18next.d.ts
import _ from 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
