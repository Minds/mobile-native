import { Timeout } from '~/types/Common';
import apiService from '../../common/services/api.service';
import badgeService from '../../common/services/badge.service';
import logService from '../../common/services/log.service';
import sessionService from '../../common/services/session.service';
import socketService from '../../common/services/socket.service';
import type NotificationModel from './notification/NotificationModel';
import { NotificationsTabOptions } from './NotificationsTopBar';
import EmailNotificationsSettingModel, {
  EmailNotificationsSettingType,
} from './settings/email/EmailNotificationsSettingModel';
import PushNotificationsSettingModel from './settings/push/PushNotificationsSettingModel';

export type FilterType = '' | NotificationsTabOptions;

const createNotificationsStore = () => ({
  unread: 0,
  filter: '' as FilterType,
  pollInterval: null as Timeout | null,
  pushNotificationsSettings: [] as PushNotificationsSettingModel[] | null, // null when failed to load
  mailsNotificationsSettings: [] as EmailNotificationsSettingModel[] | null, // null when failed to load
  loaded: false,
  silentRefresh: false,
  setLoaded(loaded: boolean) {
    this.loaded = loaded;
  },
  setSilentRefresh(value: boolean) {
    this.silentRefresh = value;
  },
  init() {
    sessionService.onSession(cookies => {
      if (cookies) {
        // load count on session start
        this.loadUnreadCount();
        // start polling for count every 10 seconds
        this.startPollCount();

        this.listen();

        this.loadPushNotificationsSettings();
        this.loadMailNotificationsSettings();
      } else {
        this.unlisten();
        this.stopPollCount();
      }
    });
  },
  setFilter(filter: FilterType) {
    this.filter = filter;
  },
  setUnread(unread: number) {
    this.unread = unread;
    badgeService.setUnreadNotifications(unread);
  },
  onSocket() {
    const unread = this.unread + 1;
    this.setUnread(unread);
  },
  listen() {
    socketService.subscribe('notification', this.onSocket);
  },
  unlisten() {
    socketService.unsubscribe('notification', this.onSocket);
  },
  async loadUnreadCount() {
    try {
      const response = <any>(
        await apiService.get('api/v3/notifications/unread-count', {})
      );
      if (response.count) {
        this.setUnread(response.count);
      }
    } catch (err) {
      logService.exception('[NotificationsStore] unread-count', err);
    }
  },
  startPollCount() {
    this.pollInterval = setInterval(() => {
      this.loadUnreadCount();
    }, 30000);
  },
  stopPollCount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  },
  async markAsRead(notification: NotificationModel): Promise<void> {
    try {
      notification.read = true;
      this.setUnread(this.unread - 1);
      await apiService.put('api/v3/notifications/read/' + notification.urn);
    } catch (err) {
      notification.read = false;
      this.setUnread(this.unread + 1);
      logService.exception('[NotificationsStore] markAsRead', err);
    }
  },
  async loadMailNotificationsSettings() {
    try {
      this.mailsNotificationsSettings = [];
      const response = <any>await apiService.get('api/v2/settings/emails');
      if (response.notifications) {
        this.mailsNotificationsSettings = response.notifications.map(
          (notifications: EmailNotificationsSettingType) =>
            new EmailNotificationsSettingModel(notifications),
        );
      } else {
        this.mailsNotificationsSettings = null;
      }
    } catch (err) {
      this.mailsNotificationsSettings = null;
      logService.exception(
        '[NotificationsStore] loadMailNotificationsSettings',
        err,
      );
    }
  },
  async loadPushNotificationsSettings() {
    try {
      this.pushNotificationsSettings = [];
      const response = <any>(
        await apiService.get('api/v3/notifications/push/settings')
      );
      if (response.settings) {
        this.pushNotificationsSettings = response.settings.map(
          setting => new PushNotificationsSettingModel(setting),
        );
      } else {
        this.pushNotificationsSettings = null;
      }
    } catch (err) {
      this.pushNotificationsSettings = null;
      logService.exception('[NotificationsStore] loadSettings', err);
    }
  },
  reset() {
    this.silentRefresh = false;
    this.filter = '';
    this.unlisten();
    this.stopPollCount();
    this.setUnread(0);
  },
});

export default createNotificationsStore;
export type NotificationsStore = ReturnType<typeof createNotificationsStore>;
