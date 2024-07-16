import { observable, action } from 'mobx';

import type BaseModel from '../BaseModel';
import sp from '~/services/serviceProvider';
/**
 * Single Entity Store
 */
class SingleEntityStore<T extends BaseModel> {
  @observable entity?: T | null;
  @observable errorLoading = false;

  @action
  setEntity(entity: T | null) {
    this.entity = entity;
  }

  @action
  setErrorLoading(value) {
    this.errorLoading = value;
  }

  async loadEntity(urn, defaultEntity: T | null = null, asActivity = false) {
    this.setErrorLoading(false);
    try {
      const entity: T | null = (await sp
        .resolve('entities')
        .single(urn, defaultEntity, asActivity)) as T | null;
      this.setEntity(entity);
    } catch (err) {
      this.setErrorLoading(true);
      sp.log.exception(err);
    }
  }

  @action
  clear() {
    this.entity = undefined;
    this.errorLoading = false;
  }
}

export default SingleEntityStore;
