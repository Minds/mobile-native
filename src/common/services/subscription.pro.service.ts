import moment from 'moment';
import api from './api.service';

type Pro = {
  expires: number;
  has_subscription: boolean;
  isActive?: boolean;
  status: 'success' | 'error';
};
class SubscriptionProService {
  cachedResponse: Pro | undefined;

  async isActive(): Promise<boolean> {
    const result: Pro = await api.get('api/v2/pro');

    if (result?.isActive === undefined || result?.status !== 'success') {
      throw new Error('Unable to check your Pro status');
    }
    this.cachedResponse = result;

    return Boolean(result.isActive);
  }

  async hasSubscription(): Promise<boolean> {
    if (!this.cachedResponse) {
      await this.isActive();
    }
    return Boolean(this.cachedResponse?.has_subscription);
  }

  async expires(): Promise<number> {
    if (!this.cachedResponse) {
      await this.isActive();
    }
    return Number(this.cachedResponse?.expires) || 0;
  }

  async disable(): Promise<boolean> {
    await api.delete('api/v2/pro');
    return true;
  }

  get expiryString(): string {
    const expires = Number(this.cachedResponse?.expires) || 0;
    if (expires * 1000 <= Date.now()) {
      return '';
    }

    return moment(expires * 1000)
      .local()
      .format('h:mma [on] MMM Do, YYYY');
  }
}

export default new SubscriptionProService();
