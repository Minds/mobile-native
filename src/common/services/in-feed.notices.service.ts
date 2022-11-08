import { action, observable, toJS } from 'mobx';
import apiService, { ApiResponse } from './api.service';
import logService from './log.service';
import sessionService from './session.service';
import { storages } from './storage/storages.service';

type ResponseNotice = {
  key: string;
  location: string;
  should_show: boolean;
};

interface InFeedResponse extends ApiResponse {
  notices: Array<ResponseNotice>;
}

type FormattedNotices = {
  [key: string]: {
    location: string;
    should_show: boolean;
  };
};

type Dismissed = {
  [key: string]: string;
};

const DISMISS_DURATION = 60 * 24 * 60 * 60 * 1000; // 60 days

/**
 * In feed notices service
 */
export class InFeedNoticesService {
  @observable.shallow data: null | FormattedNotices = null;
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
    const stored = this.loadFormattedData();

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
  setData(data: FormattedNotices) {
    this.data = data;
  }

  /**
   * Remove an in-feed notice (until data is loaded again)
   * This method is used when the user remove a notice without having to wait for server response
   */
  markAsCompleted(name: string) {
    if (this.data && this.data[name]) {
      const data = toJS(this.data);
      delete data[name];
      this.data = data;
    }
  }

  /**
   * Format data
   */
  private formatData(data: Array<ResponseNotice>): FormattedNotices {
    const formatted = {};
    data
      .filter(d => d.should_show) // store enabled ones only for optimization
      .forEach(item => {
        formatted[item.key] = {
          location: item.location,
          should_show: item.should_show,
        };
      });

    return formatted;
  }

  /**
   * Store the notices in local storage
   */
  private storeFormattedData(data: FormattedNotices) {
    storages.user?.setMap('IN_FEED_NOTICES', data);
  }

  /**
   * Load from storage
   */
  private loadFormattedData(): FormattedNotices | undefined | null {
    return storages.user?.getMap<FormattedNotices>('IN_FEED_NOTICES');
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
        const data = this.formatData(response.notices);
        this.storeFormattedData(data);
        this.setData(data);
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
  getInlineNotice(position: number): string | null {
    if (this.data !== null && !this.getTopNotice()) {
      const notices = Object.keys(this.data).filter(
        key => this.data![key].location === 'inline' && this.visible(key),
      );

      return notices[position - 1] || null;
    }
    return null;
  }

  /**
   * Get the current top notice
   * (first visible top notice)
   */
  getTopNotice(): string | null {
    if (this.data !== null) {
      let topNotice: string | null = null;
      Object.keys(this.data).forEach(key => {
        const notice = this.data ? this.data[key] : null;
        if (notice && notice.location === 'top' && this.visible(key)) {
          topNotice = key;
        }
      });
      return topNotice;
    }
    return null;
  }

  /**
   * Dismiss a notice
   */
  @action
  dismiss(noticeName: string) {
    this.dismissed[noticeName] = String(Date.now());
    storages.user?.setMap('IN_FEED_NOTICES_DISMISSED', this.dismissed);
  }

  /**
   * Returns true if the notice has been dismissed
   */
  isDismissed(noticeName: string): boolean {
    if (!this.dismissed[noticeName]) {
      return false;
    }
    return Date.now() - Number(this.dismissed[noticeName]) < DISMISS_DURATION;
  }

  /**
   * returns true if the notice should be shown
   * @returns boolean
   */
  visible(noticeName: string) {
    if (this.data && this.data[noticeName]) {
      // we are only storing should_show = true notices but we check in case that change in the future
      return this.data[noticeName].should_show && !this.isDismissed(noticeName);
    }
    return false;
  }
}

export default new InFeedNoticesService();
