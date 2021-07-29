import api from './api.service';
import logService from './log.service';
import { storages } from './storage/storages.service';

type Language = {
  language: string;
  name: string;
  isPreferred?: boolean;
};

/**
 * Translation service
 */
class TranslationService {
  defaultLanguage = 'en';
  languagesReady: Array<Language> | null = null;

  // /**
  //  * Class constructor
  //  */
  // constructor() {
  //   // initial caching
  //   if (process.env.JEST_WORKER_ID === undefined) {
  //     //this.getLanguages();
  //   }
  // }

  /**
   * Get languages from cache or endpoint
   */
  async getLanguages() {
    if (!this.languagesReady) {
      const cached = storages.app.getArray<Language>(
        `translation:languages:${this.defaultLanguage}`,
      );
      if (cached && cached.length > 0) {
        this.languagesReady = cached;
        return cached;
      } else {
        try {
          const response: any = await api.get('api/v1/translation/languages', {
            target: this.defaultLanguage,
          });
          if (!response.languages) {
            throw new Error('No languages array');
          }
          storages.app.setArray(
            `translation:languages:${this.defaultLanguage}`,
            response.languages,
          );
          storages.app.setString(
            'translation:userDefault',
            response.userDefault,
          );
          return response.languages;
        } catch (e) {
          logService.exception('[TranslationService]', e);
        }
      }
    }

    return this.languagesReady;
  }

  /**
   * Get user default language
   */
  async getUserDefaultLanguage() {
    await this.getLanguages();
    return storages.app.getString('translation:userDefault');
  }

  /**
   * Purge languages cache
   */
  async purgeLanguagesCache() {
    this.languagesReady = null;
    storages.app.removeItem(`translation:languages:${this.defaultLanguage}`);
    storages.app.removeItem('translation:userDefault');
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
      ((typeof entity.title !== 'undefined' && entity.title) ||
        (typeof entity.blurb !== 'undefined' && entity.blurb))
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
    const response: any = await api.get(
      `api/v1/translation/translate/${guid}`,
      {
        target: language,
      },
    );
    const defaultLanguage = storages.app.getString('translation:userDefault');

    if (!defaultLanguage !== language) {
      // update it async
      storages.app.setString('translation:userDefault', language);
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
