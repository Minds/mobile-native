import * as entities from 'entities';

const createTranslateStore = ({ selectorRef }) => {
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
      this.showPicker();
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
    showPicker() {
      selectorRef.current?.show(this.current);
    },
    setCurrentAndTranslate(current) {
      this.current = current;
      this.shouldTranslate = true;
    },
  };
  return store;
};

export default createTranslateStore;
export type TranslateStoreType = ReturnType<typeof createTranslateStore>;
