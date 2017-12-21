import { observable, action } from 'mobx'

/**
 * Common infinite scroll list
 */
export default class OffsetListStore {
  /**
   * list entities
   */
  @observable entities = [];

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
  clearList(updateLoaded=true) {
    this.entities = [];
    this.offset   = '';
    if (updateLoaded) {
      this.loaded = false;
    }
  }

  @action
  refresh() {
    this.refreshing = true;
    this.entities = [];
    this.offset = '';
  }

  @action
  refreshDone() {
    this.refreshing = false;
  }

  cantLoadMore() {
    return this.loaded && !this.offset && !this.refreshing;
  }
}