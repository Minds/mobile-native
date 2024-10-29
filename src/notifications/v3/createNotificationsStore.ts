import { Timeout } from '~/types/Common';
import type NotificationModel from './notification/NotificationModel';
import { NotificationsTabOptions } from './NotificationsTopBar';
import EmailNotificationsSettingModel, {
  EmailNotificationsSettingType,
} from './settings/email/EmailNotificationsSettingModel';
import PushNotificationsSettingModel from './settings/push/PushNotificationsSettingModel';
import sp from '~/services/serviceProvider';

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
    sp.session.onSession((token: string) => {
      if (token) {
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
    const pushService = sp.resolve('push');
    pushService.setBadgeCount(unread);
    if (unread === 0) {
      pushService.clearNotifications();
    }
  },
  onSocket() {
    const unread = this.unread + 1;
    this.setUnread(unread);
  },
  listen() {
    sp.socket.subscribe('notification', this.onSocket);
  },
  unlisten() {
    sp.socket.unsubscribe('notification', this.onSocket);
  },
  async loadUnreadCount() {
    try {
      const response = <any>(
        await sp.api.get('api/v3/notifications/unread-count', {})
      );
      if (response.count) {
        this.setUnread(response.count);
      }
    } catch (err) {
      sp.log.exception('[NotificationsStore] unread-count', err);
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
      await sp.api.put('api/v3/notifications/read/' + notification.urn);
    } catch (err) {
      notification.read = false;
      this.setUnread(this.unread + 1);
      sp.log.exception('[NotificationsStore] markAsRead', err);
    }
  },
  async loadMailNotificationsSettings() {
    try {
      this.mailsNotificationsSettings = [];
      const response = <any>await sp.api.get('api/v2/settings/emails');
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
      sp.log.exception(
        '[NotificationsStore] loadMailNotificationsSettings',
        err,
      );
    }
  },
  async loadPushNotificationsSettings() {
    try {
      this.pushNotificationsSettings = [];
      const response = <any>(
        await sp.api.get('api/v3/notifications/push/settings')
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
      sp.log.exception('[NotificationsStore] loadSettings', err);
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
