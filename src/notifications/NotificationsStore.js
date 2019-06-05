import {
  observable,
  action,
  computed,
} from 'mobx';

import { showMessage, hideMessage } from "react-native-flash-message";

import NotificationsService, { getFeed, getCount, getSingle } from './NotificationsService';

import OffsetListStore from '../common/stores/OffsetListStore';
import session from '../common/services/session.service';
import badge from '../common/services/badge.service';
import logService from '../common/services/log.service';
import socketService from '../common/services/socket.service';
import { Alert } from 'react-native';

/**
 * Notifications Store
 */
class NotificationsStore {

  /**
   * Notification list store
   */
  list = new OffsetListStore('shallow');

  last = null;

  service = new NotificationsService;

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
  @observable loading = false;

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

        this.listen();
      } else {
        this.unlisten();
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

  onSocket = async(guid) => {
    this.increment();

    // TODO: enable live notifications
    // const response = await getSingle(guid);
    // if (response.notification) {
    //   // hideMessage();
    //   this.last = response.notification;
    //   showMessage({
    //     type: "default",
    //     position: 'top',
    //     backgroundColor: "#EEF5F9",
    //     message: ""
    //   });
    // }
  }

  listen() {
    socketService.subscribe('notification', this.onSocket);
  }

  unlisten() {
    socketService.unsubscribe('notification', this.onSocket);
  }

  /**
   * Load notification list
   */
  async loadList(refresh = false) {
    // no more data? return
    if (this.list.cantLoadMore()) {
      return Promise.resolve();
    }

    this.loading = true;

    const filter = this.filter;

    const offset = refresh ? '' : this.list.offset;

    try {
      const feed = await this.service.getFeed(offset, this.filter)
      // prevent race conditions when filter change
      if (filter == this.filter) {
        this.assignRowKeys(feed);
        this.list.setList(feed, refresh);
      }
    } finally {
      this.loading = false;
    }
  }

  /**
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.filter}:${this.list.entities.length}`;
    });
  }

  /**
   * Refresh list
   */
  async refresh() {
    await this.list.refresh();
    await this.loadList(true);
    this.list.refreshDone();
  }

  /**
   * Load unread count from endpoint
   */
  loadCount() {
    getCount().then(data => {
      this.setUnread(data.count);
    }).catch(err => {
      logService.exception('[NotificationStore]', err);
    });
  }

  /**
   * Start polling unread count
   */
  startPollCount() {
    this.pollInterval = setInterval(() => {
      this.loadCount();
    }, 30000);
  }

  /**
   * Stop polling unread count
   */
  stopPollCount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  @action
  setFilter(filter) {
    this.filter = filter;
    this.refresh();
  }

  @action
  setUnread(count) {
    this.unread = count;
    badge.setUnreadNotifications(count);
  }

  @action
  increment() {
    this.unread++;
    badge.setUnreadNotifications(this.unread);
  }

  @action
  reset() {
    this.list = new OffsetListStore('shallow');
    this.unread = 0;
    this.filter = 'all';
    this.loading = false;
    this.stopPollCount();
  }

}

export default NotificationsStore;
