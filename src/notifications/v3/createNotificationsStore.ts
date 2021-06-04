import apiService from '../../common/services/api.service';
import badgeService from '../../common/services/badge.service';
import logService from '../../common/services/log.service';
import sessionService from '../../common/services/session.service';
import socketService from '../../common/services/socket.service';
import type NotificationModel from './notification/NotificationModel';
import EmailNotificationsSettingModel, {
  EmailNotificationsSettingType,
} from './settings/email/EmailNotificationsSettingModel';
import PushNotificationsSettingModel from './settings/push/PushNotificationsSettingModel';

export type FilterType = '' | 'tags';

const createNotificationsStore = () => ({
  unread: 0,
  filter: '' as FilterType,
  offset: '',
  pollInterval: null as number | null,
  pushNotificationsSettings: [] as PushNotificationsSettingModel[],
  mailsNotificationsSettings: [] as EmailNotificationsSettingModel[],
  init() {
    sessionService.onSession((token: string) => {
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
  setOffset(offset: string) {
    this.offset = offset;
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
      await apiService.put('api/v3/notifications/read/' + notification.urn);
      if (this.unread > 0) {
        this.setUnread(this.unread - 1);
      }
    } catch (err) {
      logService.exception('[NotificationsStore] markAsRead', err);
    }
  },
  async loadMailNotificationsSettings() {
    try {
      const response = <any>await apiService.get('api/v2/settings/emails');
      if (response.notifications) {
        this.mailsNotificationsSettings = response.notifications.map(
          (notifications: EmailNotificationsSettingType) =>
            new EmailNotificationsSettingModel(notifications),
        );
      }
    } catch (err) {
      logService.exception(
        '[NotificationsStore] loadMailNotificationsSettings',
        err,
      );
    }
  },
  async loadPushNotificationsSettings() {
    try {
      const response = <any>(
        await apiService.get('api/v3/notifications/push/settings')
      );
      if (response.settings) {
        this.pushNotificationsSettings = response.settings.map(
          setting => new PushNotificationsSettingModel(setting),
        );
      }
    } catch (err) {
      logService.exception('[NotificationsStore] loadSettings', err);
    }
  },
});

export default createNotificationsStore;
export type NotificationsStore = ReturnType<typeof createNotificationsStore>;
