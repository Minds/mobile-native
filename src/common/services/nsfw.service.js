import { AsyncStorage } from "react-native";

class NsfwService {
  constructor(target) {
    if (!target) {
      throw new Error('Service target not specified');
    }

    this.target = target;
  }

  /**
   * @returns {Promise<number[]>}
   */
  async get() {
    try {
      const value = await AsyncStorage.getItem(this._getStorageKey());
      return value ? JSON.parse(value) : [];
    } catch (err) {
      return [];
    }
  }

  /**
   * @param {number[]} value
   * @returns {Promise<void>}
   */
  async set(value) {
    await AsyncStorage.setItem(this._getStorageKey(), JSON.stringify(value || []));
  }

  /**
   * @returns {string}
   * @private
   */
  _getStorageKey() {
    return `NsfwService:${this.target}`;
  }
}

export const consumerNsfwService = new NsfwService('CONSUMER');
export const creatorNsfwService = new NsfwService('CREATOR');
