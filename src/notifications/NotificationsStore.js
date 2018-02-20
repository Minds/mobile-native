import {
  observable,
  action
} from 'mobx'

import {
  getFeed,
  getCount
} from './NotificationsService';

import OffsetListStore from '../common/stores/OffsetListStore';

import session from '../common/services/session.service';

/**
 * Notifications Store
 */
class NotificationsStore {

  /**
   * Notification list store
   */
  list = new OffsetListStore('shallow');

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
   * List loading
   */
  loading = false;

  /**
   * Class constructor
   */
  constructor() {
    const dispose = session.onSession(token => {
      if (token) {
        // load count on session start
        this.loadCount();
        // start polling for count every 10 seconds
        this.startPollCount();
      } else {
        this.stopPollCount();
      }
    });

    // fix to clear the interval when are developing with hot reload (timers was not cleared automatically)
    if (module.hot) {
      module.hot.accept(() => {
        this.stopPollCount();
        dispose();
      });
    }
  }

  /**
   * Load notification list
   */
  loadList() {
    // no more data? return
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;
    // always return promise for refresh!
    return getFeed(this.list.offset, this.filter)
      .then( feed => {
        this.list.setList(feed);
      })
      .finally(() => {
        this.loading = false;
      })
      .catch(err => {
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

  @action
  reset() {
    this.list = new OffsetListStore('shallow');
    this.unread = 0;
    this.filter = 'all';
    this.pollInterval = null;
    this.loading = false;
  }

}

export default new NotificationsStore();