import { observable, action } from 'mobx';

import entitiesService from '../services/entities.service';
import logService from '../services/log.service';
import type BaseModel from '../BaseModel';

/**
 * Single Entity Store
 */
class SingleEntityStore<T extends BaseModel> {
  @observable entity?: T | null;
  @observable errorLoading = false;

  @action
  setEntity(entity: T) {
    this.entity = entity;
  }

  @action
  setErrorLoading(value) {
    this.errorLoading = value;
  }

  async loadEntity(urn, defaultEntity: T | null = null, asActivity = false) {
    this.setErrorLoading(false);
    try {
      const entity: T = (await entitiesService.single(
        urn,
        defaultEntity,
        asActivity,
      )) as T;
      this.setEntity(entity);
    } catch (err) {
      this.setErrorLoading(true);
      logService.exception(err);
    }
  }

  @action
  clear() {
    this.entity = null;
    this.errorLoading = false;
  }
}

export default SingleEntityStore;
