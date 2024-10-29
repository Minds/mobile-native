import { observable, action } from 'mobx';
import UserModel from '~/channel/UserModel';
import sp from '~/services/serviceProvider';

/**
 * how long should the subscriptions persist
 */
const RECENT_DURATION = 30 * 60 * 60 * 1000; // less than 30m

export interface RecentSubscription {
  /**
   * the channel id the user subscribed to
   */
  channelGuid: string;
  /**
   * timestamp of when this channel was subscribed to
   */
  subscribedAt: number;
}

/**
 * a service that remembers what the user has subscribed to in the last n minutes
 */
export class RecentSubscriptionsStore {
  static readonly STORAGE_KEY = 'recent-subscriptions';
  @observable subscriptions: RecentSubscription[] = [];

  constructor() {
    UserModel.events.on('toggleSubscription', this.onSubscriptionChange);
  }

  onSubscriptionChange = ({ user }) => {
    this.recordSubscriptionChange(user);
  };

  /**
   * @param { MindsUser } channel
   * adds or removes a subscription to the list and preserves on disk
   */
  recordSubscriptionChange(channel: UserModel) {
    if (channel.subscribed) {
      this.subscriptions.unshift({
        channelGuid: channel.guid,
        subscribedAt: Date.now(),
      });
    } else {
      this.subscriptions = this.subscriptions.filter(
        p => p.channelGuid !== channel.guid,
      );
    }

    this._persist();
  }

  /**
   * @returns { string[] } a list of subscription guids in the past n minutes
   */
  list(): string[] {
    const recentSubscriptions = this.subscriptions.filter(
      sub => Date.now() - sub.subscribedAt < RECENT_DURATION,
    );
    if (this.subscriptions.length !== recentSubscriptions.length) {
      this.subscriptions = recentSubscriptions;
      this._persist();
    }
    return this.subscriptions.map(sub => sub.channelGuid);
  }

  /**
   * Reset the store
   */
  @action
  reset() {
    this.subscriptions = [];
  }

  @action
  onLogin() {
    this.subscriptions = [];
    setTimeout(() => this._rehydrate(), 0);
  }

  /**
   * saves subscriptions to storage
   */
  private _persist() {
    sp.storages.user?.setObject<Array<RecentSubscription>>(
      RecentSubscriptionsStore.STORAGE_KEY,
      this.subscriptions,
    );
  }

  /**
   * loads subscriptions from storage if any
   */
  @action
  private _rehydrate() {
    this.subscriptions =
      sp.storages.user?.getObject<Array<RecentSubscription>>(
        RecentSubscriptionsStore.STORAGE_KEY,
      ) || [];
  }
}
