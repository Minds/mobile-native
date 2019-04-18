
import { AsyncStorage } from 'react-native';
import _ from 'lodash';

/**
 * Model storage list
 */
export default class ModelStorageList {
  storageName;
  index;
  limit;

  /**
   * Constructor
   * @param {string} storageName List name
   * @param {integer} limit 0 for unlimeted list
   */
  constructor(storageName, limit = 0) {
    this.storageName = 'model:'+ storageName;
    this.limit = limit;
    this.loadIndex();
  }

  /**
   * Load index from storage
   */
  async loadIndex() {
    try {
      this.index = JSON.parse(await AsyncStorage.getItem(this.indexKey).then());
      if (!this.index) {
        this.index = [];
      }
    } catch (err) {
      console.log('Error loading index for '+ this.storageName, err);
    }
  }

  /**
   * Add the model to the end of list
   * return false on error or void if item already exist
   * @param {object} model
   */
  async push(model) {
    if (this.exist(model.guid)) return -1;
    this.index.push(model.guid);

    if (this.limit && this.index.length > this.limit) {
      const guid = this.index.shift();
      await AsyncStorage.removeItem(this._getKeyGuid(guid));
    }

    return this._persist(model);
  }

  /**
   * Add the model to the beginning of list
   * @param {object} model
   */
  async unshift(model) {
    if (this.exist(model.guid)) return -1;
    this.index.unshift(model.guid);

    if (this.limit && this.index.length > this.limit) {
      const guid = this.index.pop();
      await AsyncStorage.removeItem(this._getKeyGuid(guid));
    }

    await this._persist(model);
    return 0;
  }

  /**
   * Remove an item
   * @param {string} guid
   */
  async remove(guid) {
    _.pull(this.index, guid);
    await AsyncStorage.removeItem(this._getKeyGuid(guid));
    await AsyncStorage.setItem(this.indexKey, this.indexString);
  }

  /**
   * Move the index of guid to last position
   * @param {string} guid
   */
  async moveLast(guid) {
    const i = this.index.indexOf(guid);
    if(i > -1 && i + 1 < this.index.length) {
      _.pull(this.index, guid);
      this.index.push(guid);
      await AsyncStorage.setItem(this.indexKey, this.indexString);
    }
  }

  /**
   * Move the index of guid to first position
   * @param {string} guid
   */
  async moveFirst(guid) {
    const i = this.index.indexOf(guid);
    if (i > 0) {
      _.pull(this.index, guid);
      this.index.unshift(guid);
      await AsyncStorage.setItem(this.indexKey, this.indexString);
    }
  }

  /**
   * Clear the list
   */
  async clear() {
    try {
      await AsyncStorage.multiRemove(this._getKeys(this.index));
      this.index = [];
      await AsyncStorage.setItem(this.indexKey, this.indexString);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Returns model object, null if it not exist or false on read error
   *
   * @param {string} guid
   */
  async get(guid) {
    if (!this.exist(guid)) return null;
    try {
      const data = await AsyncStorage.getItem(this._getKeyGuid(guid));
      return JSON.parse(data);
    } catch (err) {
      return false;
    }
  }

  /**
   * Return the firsts elements
   * @param {integer} count
   */
  async first(count = 1) {
    const items = _.slice(this.index, 0, count);
    if (items.length == 0) return [];
    return this.getMany(items);
  }

  /**
   * Return the lasts elements
   * @param {integer} count
   */
  async last(count = 1) {
    if (count > this.index.length) count = this.index.length;
    const items = _.slice(this.index, this.index.length - count);
    if (items.length == 0) return [];
    return this.getMany(items);
  }

  /**
   * return all the items
   */
  async all() {
    return this.getMany(this.index);
  }

  /**
   * Returns if guid exists in index
   * @param {string} guid
   */
  exist(guid) {
    return this.index.indexOf(guid) > -1;
  }


  /**
   * Return many items
   * @param {array} guids array of guids
   */
  async getMany(guids) {
    try {
      const data = await AsyncStorage.multiGet(this._getKeys(guids));
      return data.map(item => JSON.parse(item[1]));
    } catch (err) {
      return false;
    }
  }

  /**
   * persist model and index
   * @param {object} model
   */
  async _persist(model) {
    try {
      errors = await AsyncStorage.multiSet([
        [this.indexKey, this.indexString],
        [this._getKey(model), this._serialize(model)]
      ]);
      if (!errors) return this.index.length;
    } catch (err) { }
    return -1;
  }


  _serialize(model) {
    return JSON.stringify(model);
  }

  _getKey(model) {
    return this.storageName + ':' + model.guid;
  }

  _getKeyGuid(guid) {
    return this.storageName + ':' + guid;
  }

  _getKeys(guids) {
    return guids.map(i => this._getKeyGuid(i));
  }

  get indexKey() {
    return this.storageName + ':index';
  }

  get indexString() {
    return JSON.stringify(this.index);
  }
}