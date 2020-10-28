import * as entities from 'entities';

const createTranslateStore = () => {
  const store = {
    show: false,
    translating: false,
    languages: null as any,
    translated: false as boolean | Array<any>,
    translatedFrom: null as any,
    setShow(show: boolean) {
      this.show = show;
    },
    setTranslating(translating: boolean) {
      this.translating = translating;
    },
    setLanguages(languages) {
      this.languages = languages;
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
  };
  return store;
};

export default createTranslateStore;
export type TranslateStoreType = ReturnType<typeof createTranslateStore>;
