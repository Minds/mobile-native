import { action, observable, toJS } from 'mobx';
import {
  noticeMapper,
  NoticeName,
} from '../components/in-feed-notices/notices';
import analyticsService from './analytics.service';
import apiService, { ApiResponse } from './api.service';
import logService from './log.service';
import sessionService from './session.service';
import { storages } from './storage/storages.service';

type Notice = {
  key: NoticeName;
  location: string;
  should_show: boolean;
  dismissable?: boolean;
};

interface InFeedResponse extends ApiResponse {
  notices: Array<Notice>;
}

type Notices = InFeedResponse['notices'];

type Dismissed = {
  [key: string]: string;
};

const DISMISS_DURATION = 60 * 24 * 60 * 60 * 1000; // 60 days

/**
 * In feed notices service
 */
export class InFeedNoticesService {
  @observable.shallow data: null | Notices = null;
  @observable dismissed: Dismissed = {};
  loading = false;

  constructor() {
    // We init the service on login
    sessionService.onLogin(() => this.init());
    // And clear on logout
    sessionService.onLogout(() => this.clear());
  }

  /**
   * Init the service
   */
  init() {
    const stored = this.loadStoredData();

    if (stored) {
      this.setData(stored);
    }

    const dismissed = this.loadDismissed();

    if (dismissed) {
      this.dismissed = dismissed;
    }

    return this.load();
  }

  @action
  clear() {
    this.data = null;
  }

  @action
  setData(data: Notices) {
    this.data = data;
  }

  /**
   * Remove an in-feed notice (until data is loaded again)
   * This method is used when the user remove a notice without having to wait for server response
   */
  markAsCompleted(name: NoticeName) {
    if (this.data && this.data[name]) {
      const data = toJS(this.data);
      delete data[name];
      this.data = data;
    }
  }
  /**
   * Store the notices in local storage
   */
  private storeData(data: Notices) {
    storages.user?.setArray('IN_FEED_NOTICES_DATA', data);
  }

  /**
   * Load from storage
   */
  private loadStoredData(): Notices | undefined | null {
    return storages.user?.getArray('IN_FEED_NOTICES_DATA');
  }

  /**
   * Load dismissed from storage
   */
  private loadDismissed(): Dismissed | undefined | null {
    return storages.user?.getMap<Dismissed>('IN_FEED_NOTICES_DISMISSED');
  }

  /**
   * Load the notices from the server
   */
  async load() {
    if (this.loading) {
      return;
    }
    try {
      this.loading = true;
      const response = await apiService.get<InFeedResponse>(
        'api/v3/feed-notices',
      );
      if (response.notices) {
        this.setData(response.notices);
        this.storeData(response.notices);
      }
    } catch (error) {
      logService.exception('[InFeedNoticesService]', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get the inline notice for a given position
   * @param position
   */
  getInlineNotice(position: number): NoticeName | undefined {
    if (this.data !== null && !this.getTopNotice()) {
      const notices: Notices = this.data.filter(
        notice =>
          notice.location === 'inline' &&
          notice.should_show &&
          !this.isDismissed(notice.key) &&
          noticeMapper[notice.key], // ignore not implemented ones
      );
      if (notices.length > position) {
        return notices[position - 1].key;
      }
    }
  }

  /**
   * Get the current top notice
   * (first visible top notice)
   */
  getTopNotice(): NoticeName | undefined {
    if (this.data !== null) {
      const topNotice = this.data.find(
        (notice: Notice) =>
          notice.should_show &&
          notice.location === 'top' &&
          !this.isDismissed(notice.key) &&
          noticeMapper[notice.key], // ignore not implemented ones
      );

      return topNotice?.key;
    }
  }

  /**
   * Tracks a a view in the top notice
   */
  trackViewTop() {
    const currentTop = this.getTopNotice();
    // there is a notice and it is implemented (exists in mapper)
    if (currentTop && noticeMapper[currentTop]) {
      analyticsService.trackView(`feed-notice-${currentTop}`);
    }
  }

  /**
   * Tracks a a view in the in feed notice
   */
  trackViewInFeed(position) {
    const notice = this.getInlineNotice(position);

    // there is a notice and it is implemented (exists in mapper)
    if (notice && noticeMapper[notice]) {
      analyticsService.trackView(`feed-notice-${notice}`);
    }
  }

  /**
   * Dismiss a notice
   */
  @action
  dismiss(noticeName: NoticeName) {
    this.dismissed[noticeName] = String(Date.now());
    storages.user?.setMap('IN_FEED_NOTICES_DISMISSED', this.dismissed);
  }

  /**
   * Returns true if the notice has been dismissed
   */
  isDismissed(noticeName: NoticeName): boolean {
    if (!this.dismissed[noticeName]) {
      return false;
    }
    return Date.now() - Number(this.dismissed[noticeName]) < DISMISS_DURATION;
  }

  /**
   * returns true if the notice should be shown
   * @returns boolean
   */
  visible(noticeName: NoticeName) {
    return Boolean(
      this.data &&
        this.data.some(
          notice => notice.should_show && notice.key === noticeName,
        ) &&
        !this.isDismissed(noticeName),
    );
  }
}

export default new InFeedNoticesService();
