import {
  observable,
  action
} from 'mobx'

import {
  getFeed,
  getCount
} from './NotificationsService';

import OffsetListStore from '../common/stores/OffsetListStore';

/**
 * Notifications Store
 */
class NotificationsStore {

  /**
   * Notification list store
   */
  list = new OffsetListStore();

  /**
   * unread notifications counter
   */
  @observable unread = 0;

  /**
   * Notifications list filter
   */
  @observable filter = 'all';

  /**
   * PollInterval
   */
  pollInterval = null;

  /**
   * Class constructor
   */
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
   * Load notification list
   */
  loadList() {
    // no more data? return
    if (this.list.cantLoadMore()) {
      return;
    }
    // always return promise for refresh!
    return getFeed(this.list.offset, this.filter)
      .then( feed => {
        this.loading = false;
        this.list.setList(feed);
      })
      .catch(err => {
        this.loading = false;
        console.log('error', err);
      })
  }

  /**
   * Refresh list
   */
  refresh() {
    this.list.refresh();
    this.loadList()
      .finally(() => {
        this.list.refreshDone();
      });
  }

  /**
   * Load unread count from endpoint
   */
  loadCount() {
    getCount().then(data => {
      this.setUnread(data.count);
    }).catch(err => {
      console.log('error', err);
    });
  }

  /**
   * Start polling unread count
   */
  startPollCount() {
    this.pollInterval = setInterval(() => {
       this.loadCount();
    }, 10000);
  }

  /**
   * Stop polling unread count
   */
  stopPollCount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  @action
  setFilter(filter) {
    this.filter = filter;
    this.list.clearList();
    this.loadList();
  }

  @action
  setUnread(count) {
    this.unread = count;
  }
}

export default new NotificationsStore();