import {
  observable,
  action
} from 'mobx'

import {
  getFeed,
  getCount
} from './NotificationsService';

/**
 * Notifications Store
 */
class NotificationsStore {
  @observable entities   = []
  @observable loading    = false;
  @observable refreshing = false;
  @observable unread     = 0;
  @observable filter     = 'all';

  offset       = ''
  moreData     = true;
  pollInterval = null;

  constructor() {
    // load count on start
    this.loadCount();
    // start polling for count every 10 seconds
    this.startPollCount();

    // fix to clear the interval when are developing with hot reload (timers was not cleared automatically)
    if (module.hot) {
      module.hot.accept(() => {
        this.stopPollCount();
      });
    }
  }

  /**
   * Load conversations list
   * @param {boolean} refresh
   */
  loadList(refresh = false) {
    // refresh?
    if (refresh) this.refresh();

    if (!this.moreData || this.loading) {
      return;
    }
    // is loading
    this.loading = true;
    this.setRefreshing(true);

    getFeed(this.offset, this.filter)
      .then( feed => {
        this.setFeed(feed);
      })
      .finally(()=>{
        this.loading = false;
        if (this.refreshing === true) {
          setTimeout(() => {
            this.setRefreshing(false);
          }, 500);
        }
      })
      .catch(err => {
        console.log('error', err);
      })
  }

  refresh() {
    this.moreData = true;
    this.loading = false;
    this.entities = [];
  }

  loadCount() {
    getCount().then(data => {
      this.setUnread(data.count);
    }).catch(err => {
      console.log('error', err);
    });
  }

  startPollCount() {
    this.pollInterval = setInterval(() => {
       this.loadCount();
    }, 10000);
  }

  stopPollCount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  @action
  setFilter(filter) {
    this.filter = filter;
    this.loadList(true);
  }

  @action
  setUnread(count) {
    this.unread = count;
  }

  @action
  setFeed(feed) {
    if (feed.entities) {
      this.entities = [... this.entities, ...feed.entities],
      this.offset = feed.offset;
    } else {
      this.moreData = false;
      return false;
    }
    this.moreData = !!this.offset;
    return true;
  }

  @action
  setRefreshing(val) {
    this.refreshing = val;
  }
}

export default new NotificationsStore();