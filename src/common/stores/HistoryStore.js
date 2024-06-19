import { observable, action } from 'mobx';
import { storagesService } from '~/common/services';

/**
 * History store with persistence
 */
export default class HistoryStore {
  @observable loaded = false;
  @observable history = [];
  max = 12;
  key;

  /**
   * Constructor
   * @param {string} key storage key
   * @param {number} max history max length
   */
  constructor(key, max) {
    this.key = key;
    this.max = max;
    this.load();
  }

  /**
   * Load data
   */
  async load() {
    const data = storagesService.user?.getArray(this.key);
    if (data) {
      this.setHistory(data);
    }
  }

  /**
   * Clear
   */
  @action
  clear = () => {
    this.history = [];
    storagesService.user?.setArray(this.key, this.history);
  };

  /**
   * Set history
   * @param {array} data
   */
  @action
  setHistory(data) {
    this.history = data;
    this.loaded = true;
  }

  /**
   * Add an item
   * @param {any} item
   */
  @action
  add(item) {
    const index = this.history.indexOf(item);
    if (index !== -1) {
      this.history.splice(index, 1);
    }
    if (this.history.unshift(item) > this.max) {
      this.history.pop();
    }
    storagesService.user?.setArray(this.key, this.history);
  }
}
