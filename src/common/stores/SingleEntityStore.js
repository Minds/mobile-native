import {
  observable,
  action,
  reaction,
  computed
} from 'mobx';

/**
 * Single Entity Store
 */
export default class SingleEntityStore {

  @observable entity = {};

  @action
  setEntity(entity) {
    this.entity = entity;
  }
  
  @action
  clear() {
    this.entity = {};
  }
}

