import { Platform } from 'react-native';

import { getStores } from '../../AppStores';
import type ActivityModel from './ActivityModel';
import { Metadata } from '../common/services/metadata.service';
import BaseModel from '../common/BaseModel';
import type { ApiService } from '~/common/services/api.service';
import type { AnalyticsService } from '~/common/services/analytics.service';
import type { LogService } from '~/common/services/log.service';
import type { ConnectivityService } from '~/common/services/connectivity.service';
import type { StoreRatingService } from '~/modules/store-rating';

export class NewsfeedService {
  /**
   * Constructor
   */
  constructor(
    private api: ApiService,
    private analytics: AnalyticsService,
    private log: LogService,
    private connectivityService: ConnectivityService,
    private storeRating: StoreRatingService,
  ) {}

  async _getFeed(endpoint, offset, limit) {
    const data: any = await this.api.get(endpoint, { offset, limit }, this);
    return {
      entities: data.activity || data.entities,
      offset: data['load-next'],
    };
  }

  async getFeed(offset, limit = 12) {
    return await this.getFeedLegacy(offset, limit);
  }

  async getFeedLegacy(offset, limit = 12) {
    return this._getFeed('api/v1/newsfeed/', offset, limit);
  }

  /**
   * Fetch top newsfeed
   * @param {String} offset
   * @param {Number} limit
   */
  async getFeedSuggested(offset, limit = 12) {
    return this._getFeed(
      'api/v2/entities/suggested/activities' +
        (getStores().hashtag.all ? '/all' : ''),
      offset,
      limit,
    );
  }

  /**
   * Fetch channel feed
   * @param {String} guid
   * @param {String} offset
   * @param {Number} limit
   */
  async getFeedChannel(guid, offset, limit = 12) {
    return this._getFeed('api/v1/newsfeed/personal/' + guid, offset, limit);
  }

  /**
   * Fetch boosted content
   * @param {String} offset
   * @param {Number} limit
   */
  async getBoosts(offset, limit = 15, rating = 1) {
    const data: any = await this.api.get(
      'api/v1/boost/fetch/newsfeed',
      {
        limit: limit || '',
        offset: offset || '',
        rating: rating,
        platform: Platform.OS === 'ios' ? 'ios' : 'other',
      },
      this,
    );

    return {
      entities: data.boosts || [],
      offset: data['load-next'],
    };
  }
  update(post) {
    return this.api
      .post('api/v2/newsfeed/' + post.guid, post)
      .then((data: any) => {
        return {
          entity: data.activity,
        };
      });
  }
  /**
   * Toggle comments
   * @param {String} guid
   * @param {boolean} value
   */
  toggleComments(guid, value) {
    if (value) {
      return this.api.put('api/v1/comments/disable/' + guid);
    } else {
      return this.api.delete('api/v1/comments/disable/' + guid);
    }
  }

  /**
   * records view of an in-feed entity
   * @param {Object} entity
   * @param {Object} data
   */
  async recordView(entity: BaseModel | ActivityModel, extra: Metadata) {
    // ignore if there is no internet
    if (!this.connectivityService.isConnected) {
      return;
    }

    this.analytics.trackEntityView(entity, extra);

    if ('boosted_guid' in entity && entity.boosted_guid) {
      let url = `api/v2/analytics/views/boost/${entity.boosted_guid}`;
      // TODO: record channel with the url according to web
      // https://gitlab.com/minds/front/-/blob/e256a141bed6303ec3c24f8999560e4633614867/src/app/modules/newsfeed/services/newsfeed.service.ts#L48

      await this.api.post(url, extra);
    } else {
      await this.api.post(
        'api/v2/analytics/views/entity/' + entity.guid,
        extra,
      );
    }

    this.storeRating.track('viewPost');

    return;
  }
  /**
   * Toggle muted
   * @param {String} guid
   * @param {boolean} value
   */
  toggleMuteNotifications(guid, value) {
    let action = value ? 'mute' : 'unmute';
    return this.api
      .post('api/v1/entities/notifications/' + guid + '/' + action)
      .then(data => {
        return data;
      })
      .catch(err => {
        this.log.exception('[NewsfeedService]', err);
        throw 'Oops, an error occurred muting notifications.';
      });
  }

  follow(guid) {
    return this.api
      .put(`api/v2/notifications/follow/${guid}`)
      .then(data => {
        return data;
      })
      .catch(err => {
        this.log.exception('[NewsfeedService]', err);
        throw 'Ooops';
      });
  }

  unfollow(guid) {
    return this.api
      .delete(`api/v2/notifications/follow/${guid}`)
      .then(data => {
        return data;
      })
      .catch(err => {
        this.log.exception('[NewsfeedService]', err);
        throw 'Oops, an error has occurred whilst unfollowing.';
      });
  }
  async isFollowing(guid) {
    try {
      const result: any = await this.api.get(
        `api/v2/notifications/follow/${guid}`,
      );
      return result.postSubscription.following;
    } catch (err) {
      this.log.exception('[NewsfeedService]', err);
      return false;
    }
  }
  toggleExplicit(guid, value) {
    return this.api
      .post('api/v1/entities/explicit/' + guid, { value: value })
      .then(data => {
        return { data };
      })
      .catch(err => {
        this.log.exception('[NewsfeedService]', err);
        throw 'Oops, an error has occurred toggling explicit content';
      });
  }

  toggleFeatured(guid, value, category) {
    if (!value) {
      return this.api.put('api/v1/admin/feature/' + guid + '/' + category);
    } else {
      return this.api.delete('api/v1/admin/feature/' + guid);
    }
  }

  monetize(guid, value) {
    if (!value) {
      return this.api.put('api/v1/monetize/' + guid);
    } else {
      return this.api.delete('api/v1/monetize/' + guid);
    }
  }

  deleteItem(guid) {
    return this.api.delete('api/v1/newsfeed/' + guid);
  }

  async getSingle(guid) {
    const result: any = await this.api.get('api/v2/entities', {
      urns: `urn:activity:${guid}`,
      as_activities: 1,
    });

    if (!result || !result.entities || !result.entities.length)
      throw 'Not found';

    return { activity: result.entities[0] };
  }
  /**
   * Set Pinned to post
   * @param {String} guid
   * @param {boolean} value
   */
  async setPinPost(guid, value) {
    const url = `api/v2/newsfeed/pin/${guid}`;
    if (value) {
      return await this.api.post(url);
    } else {
      return await this.api.delete(url);
    }
  }
}
