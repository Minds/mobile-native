//@ts-nocheck
import { observable, action, computed, toJS } from 'mobx';

import { showMessage, hideMessage } from 'react-native-flash-message';

import NotificationsService, {
  getFeed,
  getCount,
  getSingle,
} from './NotificationsService';

import OffsetListStore from '../common/stores/OffsetListStore';
import session from '../common/services/session.service';
import badge from '../common/services/badge.service';
import logService from '../common/services/log.service';
import socketService from '../common/services/socket.service';
import { Alert } from 'react-native';
import storageService from '../common/services/storage.service';
import i18n from '../common/services/i18n.service';

/**
 * Notifications Store
 */
class NotificationsStore {
  /**
   * Notification list store
   */
  list = new OffsetListStore('shallow');

  last = null;

  service = new NotificationsService();

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
    const dispose = session.onSession((token) => {
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

  onSocket = async (guid) => {
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
  };

  persist() {
    const data = toJS(this.list.entities);

    data.forEach((n) => delete n._list);

    storageService.setItem(`notificationsList:${this.filter}`, data);
  }

  @action
  async readLocal() {
    const notifications = await storageService.getItem(
      `notificationsList:${this.filter}`,
    );

    if (notifications) {
      this.list.setList({ entities: notifications }, true);
    } else {
      this.list.setList({ entities: [] }, true);
    }
  }

  clearLocal() {
    storageService.removeItem('notificationsList:all');
    storageService.removeItem('notificationsList:tags');
    storageService.removeItem('notificationsList:comments');
    storageService.removeItem('notificationsList:boosts');
    storageService.removeItem('notificationsList:votes');
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
    if (!refresh && (this.list.cantLoadMore() || this.loading)) {
      return;
    }

    this.loading = true;

    const filter = this.filter;

    const offset = refresh ? '' : this.list.offset;

    try {
      const feed = await this.service.getFeed(offset, filter);

      // prevent race conditions when filter change
      if (feed && filter == this.filter) {
        this.list.setList(feed, refresh);
        this.persist();
      }
    } catch (err) {
      logService.exception('[NotificationStore]', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Refresh list
   */
  async refresh() {
    await this.list.refresh(true);
    try {
      await this.loadList(true);
    } catch (err) {
      this.readLocal();
      showMessage({
        position: 'center',
        message: i18n.t('cantReachServer'),
        description: i18n.t('showingStored'),
        type: 'default',
      });
    } finally {
      this.list.refreshDone();
    }
  }

  /**
   * Load unread count from endpoint
   */
  loadCount() {
    getCount()
      .then((data) => {
        this.setUnread(data.count);
      })
      .catch((err) => {
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
    this.list.clearList();
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
