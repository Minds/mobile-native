import {
  observable,
  action
} from 'mobx';

import discoveryService from './DiscoveryService';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import OffsetListStore from '../common/stores/OffsetListStore';

/**
 * Discovery Store
 */
class DiscoveryStore {

  /**
   * Notification list store
   */
  stores = {
    'object/image': {
      list: new OffsetListStore('shallow'),
      loading: false,
    },
    'object/video': {
      list: new OffsetListStore('shallow'),
      loading: false,
    },
    'object/blog': {
      list: new OffsetListStore('shallow'),
      loading: false,
    },
    'user': {
      list: new OffsetListStore('shallow'),
      loading: false,
    },
    'group': {
      list: new OffsetListStore('shallow'),
      loading: false,
    },
    'lastchannels': {
      list: new OffsetListStore('shallow'),
    },
    'activity': {
      list: new OffsetListStore('shallow'),
      loading: false,
    }
  };

  @observable searchtext = '';
  @observable filter     = 'trending';
  @observable type       = 'object/image';
  @observable category   = 'all';

  loading = false;

  /**
   * current list
   */
  get list() {
    return this.stores[this.type].list;
  }

  set list(list) {
    this.stores[this.type].list = list
  }

  /**
   * Load feed
   */
  async loadList(force=false, preloadImage=false) {
    const type = this.type;
    const store = this.stores[this.type];

    // ignore last visited channels
    if (type == 'lastchannels') return Promise.resolve();

    // no more data or loading? return
    if (!force && store.list.cantLoadMore() || store.loading) {
      return Promise.resolve();
    }

    store.loading = true;
    return discoveryService.getFeed(store.list.offset, this.type, this.filter, this.searchtext)
      .then(feed => {
        this.createModels(type, feed, preloadImage);
        this.stores[type].list.setList(feed);
      })
      .finally(() => {
        store.loading = false;
      })
      .catch(err => {
        console.log('error', err);
      });
  }

  createModels(type, feed, preloadImage) {
    switch (type) {
      case 'activity':
      case 'object/image':
      case 'object/video':
        feed.entities = ActivityModel.createMany(feed.entities);
        if (preloadImage) {
          feed.entities.forEach(entity => {
            entity.preloadThumb();
          });
        }
        break;
      case 'object/blog':
        feed.entities = BlogModel.createMany(feed.entities);
    }
  }

  /**
   * Refresh list
   */
  refresh() {
    const list = this.stores[this.type].list;
    list.refresh();
    this.loadList()
      .finally(() => {
        list.refreshDone();
      });
  }

  /**
   * Set type and refresh list
   * @param {string} type
   */
  @action
  setType(type) {
    const store = this.stores[this.type];
    this.type = type;
    this.loadList();
  }

  /**
   * Set filter and refresh list
   * @param {string} filter
   */
  @action
  setFilter(filter) {
    this.filter = filter;
    this.list.clearList();
    this.loadList(true);
  }

  @action
  clearList() {
    this.type = 'object/image';
    this.filter = 'featured';
  }

  /**
   * search
   * @param {string} text
   */
  @action
  search(text) {
    const list = this.stores[this.type].list;
    list.clearList();

    this.searchtext = text.trim();
    this.filter = 'search';

    if (text == '') {
      this.clearList();
    } else if ((text.indexOf('#') === 0) || (text.indexOf(' ') > -1)) {
      this.type = 'activity';
    } else {
      this.type = 'user';
    }

    return this.loadList(true);
  }

  @action
  reset() {
    this.stores = {
      'object/image': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'object/video': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'object/blog': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'user': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'group': {
        list: new OffsetListStore('shallow'),
        loading: false,
      },
      'lastchannels': {
        list: new OffsetListStore('shallow'),
      },
      'activity': {
        list: new OffsetListStore('shallow'),
        loading: false,
      }
    };

    this.searchtext = '';
    this.filter = 'trending';
    this.type  = 'object/image';
    this.category = 'all';
    this.loading = false;
  }
}

export default new DiscoveryStore();
