//@ts-nocheck
import storage from './storage.service';
import api from './api.service';
import logService from './log.service';

const storageNamespace = 'translation';

/**
 * Translaction service
 */
class TranslationService {

  defaultLanguage = 'en';
  languagesReady = null;

  /**
   * Class constructor
   */
  constructor() {
    // initial caching
    if (process.env.JEST_WORKER_ID === undefined) {
      this.getLanguages();
    }
  }

  /**
   * Get languages from cache or endpoint
   */
  async getLanguages() {
    if (!this.languagesReady) {
      let cached = await storage.getItem(`${storageNamespace}:languages:${this.defaultLanguage}`);
      if (cached && cached.length > 0) {
        this.languagesReady = cached;
        return cached;
      } else {
        try {
          const response = await api.get(`api/v1/translation/languages`, { target: this.defaultLanguage });
          if (!response.languages) {
            throw new Error('No languages array');
          }
          await storage.setItem(`${storageNamespace}:languages:${this.defaultLanguage}`, response.languages);
          await storage.setItem(`${storageNamespace}:userDefault`, response.userDefault);
          return response.languages;
        } catch (e) {
          logService.exception('[TranslationService]', e);
        }
      }
    }

    return this.languagesReady;
  }

  /**
   * Get user default languague
   */
  async getUserDefaultLanguage() {
    const languages = await this.getLanguages();
    return await storage.getItem(`${storageNamespace}:userDefault`);
  }

  /**
   * Purge languages cache
   */
  async purgeLanguagesCache() {
    this.languagesReady = void 0;
    await storage.setItem(`${storageNamespace}:languages:${this.defaultLanguage}`, '');
    await storage.setItem(`${storageNamespace}:userDefault`, null);
  }

  /**
   * Get language name
   * @param {string} query
   */
  async getLanguageName(query) {
    if (!query) {
      return 'None';
    }

    const languages = await this.getLanguages();

    const language = languages.find(lang => lang.language === query);

    if (language) {
      return language.name;
    }

    return 'Unknown';
  }

  /**
   * Is entity translatable
   * @param {object} entity
   */
  isTranslatable(entity) {
    if (!entity.guid) {
      return false;
    }

    // Message should exist and have content
    if (entity.text) {
      return true;
    } else if (entity.type === 'comment' && entity.description) {
      return true;
    } else if (
      entity.custom_type &&
      (
        (typeof entity.title !== 'undefined' && entity.title) ||
        (typeof entity.blurb !== 'undefined' && entity.blurb)
      )
    ) {
      return true;
    }

    if (entity.remind_object) return this.isTranslatable(entity.remind_object);

    return false;
  }

  /**
   * Translate
   * @param {string} guid
   * @param {string} language
   */
  async translate(guid, language) {
    const response = await api.get(`api/v1/translation/translate/${guid}`, { target: language });
    const defaultLanguage = await storage.getItem(`${storageNamespace}:userDefault`);

    if (!defaultLanguage !== language) {
      // update it async
      storage.setItem(`${storageNamespace}:userDefault`, language);
    }

    if (response.purgeLanguagesCache) {
      this.purgeLanguagesCache();
    }

    if (
      !response.translation ||
      Object.keys(response.translation).length === 0
    ) {
      throw new Error('No translation available');
    }

    return response.translation;
  }
}

export default new TranslationService();