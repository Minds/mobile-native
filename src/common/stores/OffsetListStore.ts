//@ts-nocheck
import { observable, action, extendObservable } from 'mobx';
import MetadataService from '../services/metadata.service';
import Viewed from './Viewed';

type EntityType = {
  _list: OffsetListStore;
} & Record<string, any>;

/**
 * Common infinite scroll list
 */
export default class OffsetListStore {
  /**
   * list is refreshing
   */
  @observable refreshing = false;

  /**
   * list loaded
   */
  @observable loaded = false;

  /**
   * list load error
   */
  @observable errorLoading = false;

  /**
   * list next offset
   * if loaded == true and offset == '' there is no more data
   */
  @observable offset = '';

  /**
   * Metadata service
   */
  metadataService: MetadataService | null = null;

  /**
   * Viewed store
   */
  viewed = new Viewed();

  /**
   * Response entities
   */
  entities: Array<EntityType> = [];

  /**
   * Constructor
   * @param {string} type 'shallow'|'ref'|null
   * @param {boolean} includeMetadata
   */
  constructor(type: 'shallow' | null = null, includeMetadata = false) {
    if (type) {
      extendObservable(
        this,
        {
          entities: [],
        },
        {
          entities: observable[type],
        },
      );
    } else {
      extendObservable(
        this,
        {
          entities: [],
        },
        {
          entities: observable,
        },
      );
    }

    if (includeMetadata) {
      this.metadataService = new MetadataService();
    }
  }

  /**
   * Get metadata service
   * @returns {metadataService}
   */
  getMetadataService() {
    return this.metadataService;
  }

  /**
   * Set or add to the list
   * @param {Object} list
   * @param {boolean} replace
   */
  @action
  setList(list, replace = false, callback = undefined) {
    if (list.entities) {
      if (replace) {
        list.entities.forEach((entity: EntityType) => {
          entity._list = this;
        });
        this.entities = list.entities;
      } else {
        list.entities.forEach((entity: EntityType) => {
          entity._list = this;
          this.entities.push(entity);
        });
      }
    }
    if (callback && callback instanceof Function) {
      callback();
    }
    this.loaded = true;
    this.offset = list.offset;
  }

  @action
  setErrorLoading(value) {
    this.errorLoading = value;
  }

  @action
  prepend(entity) {
    entity._list = this;
    this.entities.unshift(entity);
  }

  @action
  removeIndex(index) {
    this.entities.splice(index, 1);
  }

  remove(entity) {
    const index = this.entities.findIndex((e) => e === entity);
    if (index < 0) return;
    this.removeIndex(index);
  }

  getIndex(entity) {
    return this.entities.findIndex((e) => e === entity);
  }

  @action
  async clearList(updateLoaded = true) {
    this.entities = [];
    this.offset = '';
    this.errorLoading = false;
    if (updateLoaded) {
      this.loaded = false;
    }
    return true;
  }

  @action
  async refresh(keepEntities = false) {
    this.refreshing = true;
    this.errorLoading = false;
    if (!keepEntities) this.entities = [];
    this.offset = '';
    this.loaded = false;
    return true;
  }

  @action
  refreshDone() {
    this.refreshing = false;
  }

  @action
  cantLoadMore() {
    return this.loaded && !this.offset && !this.refreshing;
  }
}
