import { observable, action, extendObservable } from 'mobx'

/**
 * Common infinite scroll list
 */
export default class OffsetListStore {
  /**
   * list entities
   */
  entities = [];

  /**
   * list is refreshing
   */
  @observable refreshing = false;

  /**
   * list loaded
   */
  @observable loaded = false;

  /**
   * list next offset
   * if loaded == true and offset == '' there is no more data
   */
  offset = '';

  /**
   * Constructor
   * @param {string} 'shallow'|'ref'|null
   */
  constructor(type = null) {
    if (type) {
      extendObservable(this, {
        entities: observable[type]([]),
      });
    } else {
      extendObservable(this, {
       entities: observable([])
      });
    }
  }

  @action
  setList(list) {
    this.loaded = true;
    if (list.entities) {
      list.entities.forEach(element => {
        this.entities.push(element);
      });
    }
    this.offset = list.offset;
  }

  @action
  prepend(entity) {
    this.entities.unshift(entity);
  }

  @action
  async clearList(updateLoaded=true) {
    this.entities = [];
    this.offset   = '';
    if (updateLoaded) {
      this.loaded = false;
    }
    return true;
  }

  @action
  async refresh() {
    this.refreshing = true;
    this.entities = [];
    this.offset = '';
    return true;
  }

  @action
  refreshDone() {
    this.refreshing = false;
  }

  cantLoadMore() {
    return this.loaded && !this.offset && !this.refreshing;
  }
}