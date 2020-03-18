import { Platform } from 'react-native';

import api from './../common/services/api.service';
import { abort } from '../common/helpers/abortableFetch';
import stores from '../../AppStores';
import blockListService from '../common/services/block-list.service';
import logService from '../common/services/log.service';
import connectivityService from '../common/services/connectivity.service';

export default class NewsfeedService {

  async _getFeed(endpoint, offset, limit) {

    // abort previous fetchs
    abort(this);

    const data = await api.get(endpoint, { offset, limit }, this);
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
    return this._getFeed('api/v2/entities/suggested/activities' + (stores.hashtag.all ? '/all' : ''), offset, limit);
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
  async getBoosts(offset, limit = 15, rating) {

    abort(this);

    const data = await api.get('api/v1/boost/fetch/newsfeed', {
      limit: limit || '',
      offset: offset || '',
      rating: rating || 1,
      platform: Platform.OS === 'ios' ? 'ios' : 'other'
    }, this);

    return {
      entities: data.boosts || [],
      offset: data['load-next'],
    }
  }
}

export function update(post) {
  return api.post('api/v1/newsfeed/' + post.guid, post)
    .then((data) => {
      return {
        entity: data.activity,
      }
    });
}

/**
 * Toggle comments
 * @param {String} guid
 * @param {boolean} value
 */
export function toggleComments(guid, value) {
  if (value) {
    return api.put('api/v1/comments/disable/' + guid);
  } else {
    return api.delete('api/v1/comments/disable/' + guid);
  }
}

/**
 * Mark as viewed
 * @param {Object} entity
 * @param {Object} data
 */
export async function setViewed(entity, extra = {}) {
  let data;

  // ignore if there is no internet
  if (!connectivityService.isConnected) return;

  if (entity.boosted) {
    data = await api.post('api/v2/analytics/views/boost/' + entity.boosted_guid, extra );
  } else {
    data = await api.post('api/v2/analytics/views/entity/' + entity.guid, extra);
  }
  return data;
}

/**
 * Toggle muted
 * @param {String} guid
 * @param {boolean} value
 */

export function toggleMuteNotifications(guid, value) {
  let action = value ? 'mute' : 'unmute'
  return api.post('api/v1/entities/notifications/' + guid + '/' + action)
    .then((data) => {
      return data;
    })
    .catch(err => {
      logService.exception('[NewsfeedService]', err);
      throw "Oops, an error occurred muting notifications.";
    })
}

export function follow(guid) {
  return api.put(`api/v2/notifications/follow/${guid}`)
    .then((data) => {
      return data;
    })
    .catch(err => {
      logService.exception('[NewsfeedService]', err);
      throw "Ooops";
    })
}

export function unfollow(guid) {
  return api.delete(`api/v2/notifications/follow/${guid}`)
    .then((data) => {
      return data;
    })
    .catch(err => {
      logService.exception('[NewsfeedService]', err);
      throw "Oops, an error has occurred whilst unfollowing.";
    })
}

export async function isFollowing(guid) {
  try {
    const result = await api.get(`api/v2/notifications/follow/${guid}`);
    return result.postSubscription.following;
  } catch (e) {
    logService.exception('[NewsfeedService]', err);
    return false;
  }
}

export function toggleExplicit(guid, value) {
  return api.post('api/v1/entities/explicit/' + guid, {value : value})
    .then((data) => {
      return { data }
    })
    .catch(err => {
      logService.exception('[NewsfeedService]', err);
      throw "Oops, an error has occurred toggling explicit content";
    })
}

export function toggleFeatured(guid, value, category) {
  if (!value) {
    return api.put('api/v1/admin/feature/' + guid + '/' + category);
  } else {
    return api.delete('api/v1/admin/feature/' + guid);
  }
}

export function monetize(guid, value) {
  if (!value) {
    return api.put('api/v1/monetize/' + guid );
  } else {
    return api.delete('api/v1/monetize/' + guid);
  }
}

export function deleteItem(guid) {
  return api.delete('api/v1/newsfeed/' + guid);
}

export async function getSingle(guid) {
  const result = await api.get('api/v2/entities',{
    urns: `urn:entity:${guid}`,
    as_activities: 1,
  });

  if (!result || !result.entities || !result.entities.length) throw 'Not found';

  return {activity: result.entities[0]};
}

/**
 * Set Pinned to post
 * @param {String} guid
 * @param {boolean} value
 */
export async function setPinPost(guid, value) {
  const url = `api/v2/newsfeed/pin/${guid}`;
  if (value) {
    return await api.post(url);
  } else {
    return await api.delete(url);
  }
}
