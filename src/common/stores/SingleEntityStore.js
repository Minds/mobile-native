import {
  observable,
  action
} from 'mobx';

/**
 * Single Entity Store
 */
class SingleEntityStore {

  @observable entity;

  @action
  setEntity(entity) {
    this.entity = entity;
  }

  @action
  clear() {
    this.entity = null;
  }
}

export default SingleEntityStore;

