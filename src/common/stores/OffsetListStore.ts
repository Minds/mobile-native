import { observable, action, extendObservable } from 'mobx';
import ViewStore from './ViewStore';
import sp from '~/services/serviceProvider';
import type { MetadataService } from '../services/metadata.service';

type ListEntity<T> = {
  _list: OffsetListStore<T>;
  position: number;
};

/**
 * Common infinite scroll list
 */
export default class OffsetListStore<T> {
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
  viewStore = new ViewStore();

  /**
   * Response entities
   */
  entities: Array<T & ListEntity<T>> = [];

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
      this.metadataService = sp.resolve('metadata');
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
  setList(list, replace = false, callback?: () => void) {
    if (list.entities) {
      if (replace) {
        list.entities.forEach((entity, index: number) => {
          entity._list = this;
          entity.position = index + 1;
        });
        this.entities = list.entities;
      } else {
        list.entities.forEach(entity => {
          entity._list = this;
          entity.position = this.entities.length + 2;
          this.entities.push(entity);
        });
      }
    }
    callback?.();
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
    const index = this.entities.findIndex(e => e === entity);
    if (index < 0) return;
    this.removeIndex(index);
  }

  getIndex(entity) {
    return this.entities.findIndex(e => e === entity);
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
  refresh(keepEntities = false) {
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
