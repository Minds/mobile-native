import { action, computed, observable } from 'mobx';
import { storages } from '~/common/services/storage/storages.service';
import { hasVariation } from 'ExperimentsProvider';
import EventEmitter from 'eventemitter3';
import { NEWSFEED_FORYOU_ENABLED } from '~/config/Config';
import MetadataService from '~/common/services/metadata.service';

const FEED_TYPE_KEY = 'newsfeed:feedType';

export type NewsfeedType = 'top' | 'latest' | 'for-you' | 'groups';
/**
 * News feed store
 */
class NewsfeedStore {
  @observable
  _feedType?: NewsfeedType;

  static events = new EventEmitter();

  meta = new MetadataService();

  @computed
  get feedType() {
    if (!this._feedType) {
      try {
        let storedFeedType = storages.user?.getString(
          FEED_TYPE_KEY,
        ) as NewsfeedType;

        // in case we have stored the foryou tab and it's not in the experiment, we default to latest
        if (
          !(
            hasVariation('mob-4938-newsfeed-for-you') || NEWSFEED_FORYOU_ENABLED
          ) &&
          storedFeedType === 'for-you'
        ) {
          storages.user?.setString(FEED_TYPE_KEY, 'latest');
          storedFeedType = 'latest';
        }

        this._feedType = storedFeedType || 'latest';
      } catch (e) {
        console.error(e);
      }
      this.updateMetadata();
    }
    return this._feedType;
  }

  private updateMetadata() {
    switch (this._feedType) {
      case 'top':
        this.meta.setSource('top-feed').setMedium('feed');
        break;
      case 'latest':
      case 'groups':
        this.meta.setSource('feed/subscribed').setMedium('feed');
        break;
      case 'for-you':
        this.meta.setSource('feed/highlights').setMedium('feed');
    }
  }
  /**
   * Change FeedType and refresh the feed
   */
  @action
  changeFeedType = (feedType: NewsfeedType) => {
    this._feedType = feedType;
    this.updateMetadata();
    try {
      storages.user?.setString(FEED_TYPE_KEY, feedType);
    } catch (e) {
      console.error(e);
    }
    NewsfeedStore.events.emit('feedChange', feedType);
  };

  @action
  reset() {
    this._feedType = undefined;
  }
}

export default NewsfeedStore;
