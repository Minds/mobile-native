import {
  observable,
  action
} from 'mobx';

import entitiesService from '../services/entities.service';

/**
 * Single Entity Store
 */
class SingleEntityStore {

  @observable entity;
  @observable errorLoading = false;

  @action
  setEntity(entity) {
    this.entity = entity;
  }

  @action
  setErrorLoading(value) {
    this.errorLoading = value;
  }

  async loadEntity(urn, defaultEntity, asActivity = false) {
    this.setErrorLoading(false);
    try {
      const entity = await entitiesService.single(urn, defaultEntity, asActivity);
      this.setEntity(entity);
    } catch (err) {
      this.setErrorLoading(true);
    }
  }

  @action
  clear() {
    this.entity = null;
    this.errorLoading = false;
  }
}

export default SingleEntityStore;

