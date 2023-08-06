import { observable, action, runInAction } from 'mobx';

import logService from '../services/log.service';
import ViewStore from './ViewStore';
import MetadataService, { MetadataMedium } from '../services/metadata.service';
import FeedsService from '../services/feeds.service';
import channelService from '../../channel/ChannelService';
import type ActivityModel from '../../newsfeed/ActivityModel';
import BaseModel from '../BaseModel';
import settingsStore from '../../settings/SettingsStore';
import { isAbort } from '../services/api.service';
import { NEWSFEED_NEW_POST_POLL_INTERVAL } from '~/config/Config';
import { InjectItem } from '../components/FeedList';
import { Image } from 'expo-image';

enum FeedAction {
  Add = 0,
  Remove = 1,
}

/**
 * Feed store
 */
export default class FeedStore<T extends BaseModel = ActivityModel> {
  /**
   * Scheduled count
   */
  @observable scheduledCount = 0;

  /**
   * Refreshing
   */
  @observable refreshing = false;

  /**
   * Loaded
   */
  @observable loaded = false;

  /**
   * Load error
   */
  @observable errorLoading = false;

  /**
   * Loading
   */
  @observable loading = false;

  /**
   * Is tiled
   */
  @observable isTiled = false;

  /**
   * feed observable
   */
  @observable.shallow entities: Array<T | InjectItem> = [];

  /**
   * Custom injected components
   */
  injectItems?: InjectItem[];

  /**
   * Custom injected components
   */
  emptyComponent?: InjectItem;

  /**
   * Viewed store
   */
  viewStore = new ViewStore();

  /**
   * Metadata service
   */
  metadataService: MetadataService | null = null;

  /**
   * @var {FeedsService}
   */
  feedsService = new FeedsService();

  /**
   * The offset of the list
   */
  scrollOffset = 0;

  /**
   * Getter fallback index
   */
  get fallbackIndex() {
    return this.feedsService.fallbackIndex;
  }

  /**
   * the new post polling interval
   */
  private newPostInterval;

  /**
   * the number of new posts we haven't seen yet
   */
  @observable newPostsCount = 0;

  /**
   * Class constructor
   * @param {boolean} includeMetadata include a metadata service
   */
  constructor(includeMetadata = false) {
    if (includeMetadata) {
      this.metadataService = new MetadataService();
    }
  }

  /**
   * Sets the injected items for the feed
   */
  setInjectedItems(injectItems: InjectItem[]) {
    this.injectItems = injectItems;
    return this;
  }

  /**
   * Sets the injected items for the feed
   */
  setEmptyComponent(emptyComponent: InjectItem) {
    this.emptyComponent = emptyComponent;
  }

  /**
   * Add an entity to the viewed list and inform to the backend
   * @param {BaseModel} entity
   * @param {string} medium
   */
  trackView(entity, medium?: MetadataMedium, position?: number) {
    return this.metadataService
      ? this.viewStore.view(
          entity,
          this.metadataService as MetadataService,
          medium,
          position,
        )
      : Promise.resolve();
  }

  /**
   * Get metadata service
   * @returns {MetadataService|undefined}
   */
  getMetadataService() {
    return this.metadataService;
  }

  /**
   * Sets metadata service
   * @param { MetadataService } metadataService
   * @returns { FeedStore }
   */
  setMetadata(metadataService: MetadataService) {
    this.metadataService = metadataService;
    return this;
  }

  /**
   * Set or add to the list
   * @param {BaseModel} list
   * @param {boolean} replace
   */
  @action
  addEntities(entities, replace = false) {
    if (!entities.length) {
      const injected = this.injectItems?.find(i =>
        typeof i.indexes === 'function' ? i.indexes(0) : i.indexes === 0,
      );
      if (injected) {
        this.entities = [injected];
      }
      if (this.emptyComponent) {
        this.entities.push(this.emptyComponent);
      }
    } else if (replace) {
      entities.forEach((entity, index) => {
        entity._list = this;
        entity.position = index + 1;
      });
      this.entities = entities;
    } else {
      entities.forEach(entity => {
        let position = this.entities.length;

        if (this.injectItems) {
          do {
            const injected = this.injectItems.find(i =>
              typeof i.indexes === 'function'
                ? i.indexes(position)
                : position === i.indexes,
            );
            if (injected) {
              this.entities.push(injected);
              position++;
            } else {
              break;
            }
          } while (true);
        }

        entity._list = this;
        entity.position = position + 1;
        this.entities.push(entity);
      });

      if (!settingsStore.dataSaverEnabled) {
        // Preload images
        const images = entities
          .map(e => {
            const source =
              e.hasMedia && e.hasMedia() ? e.getThumbSource('xlarge') : null;
            return source?.uri;
          })
          .filter(s => s);
        if (images.length) {
          Image.prefetch(images);
        }
      }
    }

    this.loaded = true;
  }

  @action
  updateEntity(guid: string, entity: T) {
    this.entities = this.entities.map(ent => {
      if (ent instanceof InjectItem) {
        return ent;
      }

      if (ent.guid === guid) {
        return entity;
      }

      return ent;
    });
    return this;
  }

  /**
   * Set loading
   * @param {boolean} value
   */
  @action
  setLoading(value) {
    this.loading = value;
    return this;
  }

  /**
   * Set is tiled
   * @param {boolean} value
   */
  @action
  setIsTiled(value): FeedStore<T> {
    this.isTiled = value;
    return this;
  }

  /**
   * Set error loading
   * @param {boolean} value
   */
  @action
  setErrorLoading(value): FeedStore<T> {
    this.errorLoading = value;
    return this;
  }

  /**
   * Prepend an entity
   * @param {BaseModel} entity
   */
  @action
  prepend(entity) {
    entity._list = this;
    // if the first items are an injected item, we inject it before them
    if (this.entities.length !== 0 && this.entities[0] instanceof InjectItem) {
      const index = this.entities.findIndex(e => !(e instanceof InjectItem));
      if (index !== -1) {
        this.entities.splice(index, 0, entity);
      }
    } else {
      this.entities.unshift(entity);
    }

    this.fixPositionsAndInjected(1);

    this.feedsService.prepend(entity);
    if (entity.isScheduled()) {
      this.setScheduledCount(this.scheduledCount + 1);
    }
  }

  /**
   * Fixes the position data of each entity and the injected items when removing/adding an entity
   */
  fixPositionsAndInjected(
    initial: number = 0,
    feedAction: FeedAction = FeedAction.Add,
  ) {
    // fix positions
    if (feedAction === FeedAction.Add) {
      for (let i = initial; i < this.entities.length; i++) {
        const currentEntity = this.entities[i];
        if (!(currentEntity instanceof InjectItem)) {
          currentEntity.position = i;
        } else {
          const prevEntity = this.entities[i - 1];
          this.entities[i - 1] = currentEntity;
          this.entities[i] = prevEntity;
        }
      }
    } else {
      for (let i = this.entities.length - 1; i >= initial; i--) {
        const currentEntity = this.entities[i];
        if (!(currentEntity instanceof InjectItem)) {
          currentEntity.position = i;
        } else {
          if (this.entities.length - 1 >= i + 1) {
            const nextEntity = this.entities[i + 1];
            this.entities[i + 1] = currentEntity;
            this.entities[i] = nextEntity;
          }
        }
      }
    }
  }

  /**
   * Remove an entity by index
   * @param {integer} index
   */
  @action
  removeIndex(index) {
    this.entities.splice(index, 1);
    this.fixPositionsAndInjected(index, FeedAction.Remove);
  }

  /**
   * Remove the given entity from the list
   * @param {BaseModel} entity
   */
  remove(entity) {
    const index = this.entities.findIndex(e => e === entity);
    if (index < 0) return;
    this.removeIndex(index);
    if (entity.isScheduled()) {
      this.setScheduledCount(this.scheduledCount - 1);
    }
  }

  /**
   * Remove the given entity from the list
   * @param {string} guid
   */
  @action
  removeFromOwner(guid) {
    this.entities = this.entities.filter(
      e =>
        !(e instanceof InjectItem) && (!e.ownerObj || e.ownerObj.guid !== guid),
    );
    this.feedsService.removeFromOwner(guid);

    // after the filter we have less than a page of data?
    if (this.feedsService.offset < this.feedsService.limit) {
      // we load another page to prevent block the pagination
      this.loadMore();
    }
  }

  /**
   * Returns the index of the given entity
   * @param {BaseModel} entity
   */
  getIndex(entity) {
    return this.entities.findIndex(e => e === entity);
  }

  /**
   * Set endpoint for the feeds service
   * @param {string} endpoint
   * @returns {FeedStore}
   */
  setEndpoint(endpoint: string): FeedStore<T> {
    this.feedsService.setEndpoint(endpoint);
    return this;
  }

  /**
   * Set count endpoint for the feeds service
   * @param {string} endpoint
   * @returns {FeedStore}
   */
  setCountEndpoint(endpoint: string): FeedStore<T> {
    this.feedsService.setCountEndpoint(endpoint);
    return this;
  }

  /**
   * Set inject boost
   * @param {boolean} injectBoost
   * @returns {FeedStore}
   */
  setInjectBoost(injectBoost: boolean): FeedStore<T> {
    this.feedsService.setInjectBoost(injectBoost);
    return this;
  }

  /**
   * Set paginated
   * @param {boolean} paginated
   * @returns {FeedStore}
   */
  setPaginated(paginated: boolean): FeedStore<T> {
    this.feedsService.setPaginated(paginated);
    return this;
  }

  /**
   * Set the params for the feeds service
   * @param {Object} params
   */
  setParams(params: Object): FeedStore<T> {
    this.feedsService.setParams(params);
    return this;
  }

  noSync(): FeedStore<T> {
    this.feedsService.noSync();
    return this;
  }

  /**
   * Set limit for the feeds service
   * @param {integer} limit
   */
  setLimit(limit): FeedStore<T> {
    this.feedsService.setLimit(limit);
    return this;
  }

  /**
   * Set offset for the feeds service
   * @param {integer} offset
   */
  setOffset(offset): FeedStore<T> {
    this.feedsService.setOffset(offset);
    return this;
  }

  /**
   * Set feed for the feeds service
   * @param {Array} feed
   */
  setFeed(feed): FeedStore<T> {
    this.feedsService.setFeed(feed);
    return this;
  }

  /**
   * Set feed for the feeds service
   * @param {boolean} asActivities
   */
  setAsActivities(asActivities): FeedStore<T> {
    this.feedsService.setAsActivities(asActivities);
    return this;
  }

  /**
   * Set fallback index
   * @param {number} value
   */
  setFallbackIndex(value: number): FeedStore<T> {
    this.feedsService.setFallbackIndex(value);
    return this;
  }

  /**
   * Fetch from the endpoint
   */
  @action
  async fetch(local: boolean = false, replace?: boolean) {
    this.setLoading(true).setErrorLoading(false);

    const endpoint = this.feedsService.endpoint;
    const params = this.feedsService.params;

    try {
      if (local) {
        await this.feedsService.fetchLocal();
      } else {
        await this.feedsService.fetch();
      }

      const entities = await this.feedsService.getEntities();

      // if the endpoint or the params are changed we ignore the result
      if (
        endpoint !== this.feedsService.endpoint ||
        params !== this.feedsService.params
      )
        return;

      this.addEntities(entities, replace);
    } catch (err) {
      // ignore aborts
      if (isAbort(err)) return;
      logService.exception('[FeedStore]', err);
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Reload
   */
  reload() {
    if (this.entities.length) {
      this.loadMore();
    } else {
      this.fetch();
    }
  }

  /**
   * Load more if there is no previous error
   */
  ifNoErrorLoadMore = () => {
    if (this.errorLoading) {
      return;
    }
    this.loadMore();
  };

  /**
   * Hydrate current page
   */
  async hydratePage() {
    this.addEntities(await this.feedsService.getEntities());
  }

  /**
   * Fetch from local cache or remote if there is no local data
   * @param {boolean} refresh
   */
  async fetchLocalOrRemote(refresh = false) {
    this.setLoading(true).setErrorLoading(false);

    const endpoint = this.feedsService.endpoint;
    const params = this.feedsService.params;

    try {
      await this.feedsService.fetchLocalOrRemote();
      if (refresh) this.setOffset(0);
      const entities = await this.feedsService.getEntities();

      // if the endpoint or the params are changed we ignore the result
      if (
        endpoint !== this.feedsService.endpoint ||
        params !== this.feedsService.params
      )
        return;

      if (refresh) this.clear();
      this.addEntities(entities);
    } catch (err) {
      // ignore aborts
      if (isAbort(err)) return;
      logService.exception('[FeedStore]', err);
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Fetch from remote endpoint or from the local storage if it fails
   * @param {boolean} refresh
   * @param {Promise<any>} wait used to sync the load of any other remote data and render the content after both are ready
   */
  async fetchRemoteOrLocal(refresh = false, wait?: Promise<any>) {
    this.setLoading(true).setErrorLoading(false);

    const endpoint = this.feedsService.endpoint;
    const params = this.feedsService.params;

    try {
      await this.feedsService.fetchRemoteOrLocal();
      if (refresh) this.setOffset(0);
      const entities = await this.feedsService.getEntities();

      // if the endpoint or the params are changed we ignore the result
      if (
        endpoint !== this.feedsService.endpoint ||
        params !== this.feedsService.params
      ) {
        return;
      }

      if (refresh) {
        this.clear();
      }
      if (wait) {
        try {
          await wait;
        } catch (error) {
          console.log('[FeedStore] error in the wait promise', error);
        }
      }
      this.addEntities(entities);
    } catch (err) {
      // ignore aborts
      if (isAbort(err)) return;
      console.log(err);
      logService.exception('[FeedStore]', err);
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Fetch from remote endpoint or from the local storage if it fails
   * @param {boolean} refresh
   */
  async fetchLocalThenRemote(refresh = false) {
    this.setLoading(true).setErrorLoading(false);

    const endpoint = this.feedsService.endpoint;
    const params = this.feedsService.params;

    try {
      await this.feedsService.fetchLocal();
      if (refresh) this.setOffset(0);
      const localEntities = await this.feedsService.getEntities();

      // if the endpoint or the params are changed we ignore the result
      if (
        endpoint !== this.feedsService.endpoint ||
        params !== this.feedsService.params
      )
        return;

      if (refresh) this.clear();
      this.addEntities(localEntities);

      await this.feedsService.fetch();
      const remoteEntities = await this.feedsService.getEntities();

      if (
        endpoint !== this.feedsService.endpoint ||
        params !== this.feedsService.params
      )
        return;
      this.clear();
      this.addEntities(remoteEntities);
    } catch (err) {
      // ignore aborts
      if (isAbort(err)) return;
      console.log(err);
      logService.exception('[FeedStore]', err);
      if (this.entities.length === 0) this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Load next page
   */
  loadMore = async () => {
    if (this.loading || !this.loaded || !this.feedsService.hasMore) {
      return;
    }

    const endpoint = this.feedsService.endpoint;
    const params = this.feedsService.params;

    this.setLoading(true).setErrorLoading(false);

    try {
      const entities = await this.feedsService.next().getEntities();

      // if the endpoint or the params are changed we ignore the result
      if (
        endpoint !== this.feedsService.endpoint ||
        params !== this.feedsService.params
      )
        return;

      this.addEntities(entities);
    } catch (err) {
      // ignore aborts
      if (isAbort(err)) return;
      logService.exception('[FeedStore]', err);
      this.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  };

  /**
   * Refresh
   */
  @action
  async refresh() {
    this.refreshing = true;
    this.newPostsCount = 0;

    try {
      await this.fetchRemoteOrLocal(true);
    } catch (err) {
      logService.exception('[FeedStore]', err);
    } finally {
      this.refreshing = false;
    }
  }

  /**
   * Clear store
   */
  @action
  clear(): FeedStore<T> {
    this.refreshing = false;
    this.errorLoading = false;
    this.loaded = false;
    this.loading = false;
    this.entities = [];
    this.feedsService.setOffset(0);
    this.viewStore.clearViewed();
    return this;
  }

  /**
   * Reset store and service data
   */
  reset() {
    this.clear();
    this.feedsService.clear();
    clearInterval(this.newPostInterval);
  }

  /**
   * Get channel scheduled activities count
   */
  async getScheduledCount(guid) {
    const count = await channelService.getScheduledCount(guid);
    this.setScheduledCount(parseInt(count, 10));
  }

  @action
  setScheduledCount(count) {
    this.scheduledCount = count;
  }

  /**
   *
   * @param {() => boolean} hasFocus - A function that returns whether the screen has focus or not?
   * @returns { Function } a function to remove the watcher
   */
  public watchForUpdates(hasFocus: () => boolean): () => void {
    clearInterval(this.newPostInterval);
    this.newPostInterval = setInterval(async () => {
      if (!hasFocus()) {
        return;
      }

      const count = await this.feedsService.count(
        this.feedsService.feedLastFetchedAt,
      );

      runInAction(() => {
        this.newPostsCount = count;
      });
    }, NEWSFEED_NEW_POST_POLL_INTERVAL);

    return () => clearInterval(this.newPostInterval);
  }
}
