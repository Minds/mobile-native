import { showNotification } from 'AppMessages';
import * as entities from 'entities';
import sp from '~/services/serviceProvider';

const createTranslateStore = () => {
  const i18n = sp.i18n;
  const store = {
    show: false,
    translating: false,
    languages: null as any,
    translated: false as boolean | Array<any>,
    translatedFrom: null as any,
    current: null,
    shouldTranslate: false,
    isTranslating() {
      this.translating = true;
      this.translatedFrom = null;
    },
    async translate(language: string, guid: string) {
      const translationService = sp.resolve('translation');
      let translatedFrom = null;
      try {
        const translation = await translationService.translate(guid, language);
        for (let field in translation) {
          if (translatedFrom === null && translation[field].source) {
            translatedFrom = await translationService.getLanguageName(
              translation[field].source,
            );
          }
        }
        this.finishTranslation(translation, translatedFrom);
      } catch (e) {
        this.setTranslating(false);
        showNotification(
          i18n.t('translate.error') + '\n' + i18n.t('pleaseTryAgain'),
        );
      }
    },
    finishTranslation(translation, translatedFrom) {
      this.translated = translation;
      this.translatedFrom = translatedFrom;
      this.translating = false;
    },
    setShow(show: boolean) {
      this.show = show;
    },
    setTranslating(translating: boolean) {
      this.translating = translating;
    },
    setLanguages(languages) {
      this.languages = languages;
    },
    setCurrent(current) {
      this.current = current;
    },
    setLanguagesAndCurrent(languages, current) {
      this.languages = languages;
      this.current = current;
    },
    getTranslated(field) {
      if (!this.translated || !this.translated[field]) {
        return '';
      }

      return this.translated[field].content;
    },
    getDataFromTranslation() {
      const message = entities
          .decodeHTML(
            this.getTranslated('message') || this.getTranslated('title'),
          )
          .trim(),
        description = entities
          .decodeHTML(this.getTranslated('description'))
          .trim(),
        body = entities.decodeHTML(this.getTranslated('body')).trim();
      return [message, description, body];
    },
    hide() {
      this.translated = false;
      this.show = false;
    },
  };
  return store;
};

export default createTranslateStore;
export type TranslateStoreType = ReturnType<typeof createTranslateStore>;
