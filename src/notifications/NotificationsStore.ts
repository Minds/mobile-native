import { observable, action, toJS } from 'mobx';

import { showMessage } from 'react-native-flash-message';

import NotificationsService, { getCount } from './NotificationsService';

import OffsetListStore from '../common/stores/OffsetListStore';
import session from '../common/services/session.service';
import badge from '../common/services/badge.service';
import logService from '../common/services/log.service';
import socketService from '../common/services/socket.service';
import storageService from '../common/services/storage.service';
import i18n from '../common/services/i18n.service';

export type FilterType = 'all' | 'tags' | 'comments' | 'boosts' | 'votes';

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
  @observable unread: number = 0;

  /**
   * Notifications list filter
   */
  @observable filter: FilterType = 'all';

  /**
   * PollInterval
   */
  pollInterval: NodeJS.Timeout | null = null;

  /**
   * List loading
   */
  @observable loading: boolean = false;

  /**
   * Class constructor
   */
  constructor() {
    session.onSession((token: string) => {
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
  }

  onSocket = async () => {
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
  setLoading(value: boolean) {
    this.loading = value;
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
    if (
      (!refresh || this.list.refreshing) &&
      (this.list.cantLoadMore() || this.loading)
    ) {
      return;
    }

    this.setLoading(true);

    const filter = this.filter;

    const offset = refresh ? '' : this.list.offset;

    try {
      const feed = await this.service.getFeed(offset, filter);

      // prevent race conditions when filter change
      if (feed && filter === this.filter) {
        this.list.setList(feed, refresh);
        this.persist();
      }
    } catch (err) {
      logService.exception('[NotificationStore]', err);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Refresh list
   */
  async loadRemoteOrLocal(refresh = true) {
    if (refresh) {
      this.list.refresh(true);
    } else {
      this.list.clearList();
    }
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
  setFilter(filter: FilterType) {
    this.filter = filter;
    this.list.clearList();
    this.loadRemoteOrLocal(false);
  }

  @action
  setUnread(count: number) {
    this.unread = count;
    badge.setUnreadNotifications(count);
  }

  @action
  increment() {
    this.unread++;
    badge.setUnreadNotifications(this.unread);
  }

  @action
  refresh() {
    this.loadList(true);
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
