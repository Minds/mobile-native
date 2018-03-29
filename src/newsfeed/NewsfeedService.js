import { Platform } from 'react-native';

import api from './../common/services/api.service';


export default class NewsfeedService {

  controllers = {
    getFeed: null
  };

  async _getFeed(endpoint, offset, limit) {
    if (this.controllers._getFeed)
      this.controllers._getFeed.abort();

    this.controllers._getFeed = new AbortController();

    try {
      console.log('getting feed ' + endpoint);
      const data = await api.get(endpoint, { offset, limit }, this.controllers._getFeed.signal);
      console.log('got feed ' + endpoint);
      return {
        entities: data.activity,
        offset: data['load-next'],
      }
    } catch (err) {
      console.log('error');
      throw "Ooops";
    }
  }

  async getFeed(offset, limit = 12) {
    return this._getFeed('api/v1/newsfeed/', offset, limit);
  }

  /**
   * Fetch top newsfeed
   * @param {string} offset
   * @param {int} limit
   */
  async getFeedTop(offset, limit = 12) {
    return this._getFeed('api/v1/newsfeed/top', offset, limit);
  }

  /**
   * Fetch channel feed
   * @param {string} guid
   * @param {string} offset
   * @param {int} limit
   */
  async getFeedChannel(guid, offset, limit = 12) {
    return this._getFeed('api/v1/newsfeed/personal/' + guid, offset, limit);
  }

  /**
   * Fetch boosted content
   * @param {string} offset
   * @param {int} limit
  */
  async getBoosts(offset, limit = 15, rating) {
    if (this.controllers._getFeed)
      this.controllers._getFeed.abort();

    this.controllers._getFeed = new AbortController();
    
    try {
      const data = await api.get('api/v1/boost/fetch/newsfeed', {
          limit: limit || '',
          offset: offset || '',
          rating: rating || 1,
          platform: Platform.OS === 'ios' ? 'ios' : 'other'
        }, this.controllers._getFeed.signal);
    
        return {
          entities: data.boosts||[],
          offset: data['load-next'],
        }
    } catch (err) {

    }
  }

}

/**
 * Common function to fetch feeds
 * @param {string} endpoint
 * @param {string} offset
 * @param {int} limit
 */
function _getFeed(endpoint, offset, limit) {
  return api.get(endpoint, { offset, limit })
    .then((data) => {
      return {
        entities: data.activity,
        offset: data['load-next'],
      }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}

/**
 * Fetch subscribed newsfeed
 * @param {string} offset
 * @param {int} limit
 */
export function getFeed(offset, limit = 12) {
  return _getFeed('api/v1/newsfeed/', offset, limit);
}

/**
 * Fetch top newsfeed
 * @param {string} offset
 * @param {int} limit
 */
export function getFeedTop(offset, limit = 12) {
  return _getFeed('api/v1/newsfeed/top', offset, limit);
}

/**
 * Fetch channel feed
 * @param {string} guid
 * @param {string} offset
 * @param {int} limit
 */
export function getFeedChannel(guid, offset, limit = 12) {
  return _getFeed('api/v1/newsfeed/personal/' + guid, offset, limit);
}

/**
 * Fetch boosted content
 * @param {string} offset
 * @param {int} limit
 */
export function getBoosts(offset, limit = 15, rating) {
  return api.get('api/v1/boost/fetch/newsfeed', {
    limit: limit || '',
    offset: offset || '',
    rating: rating || '',
    platform: Platform.OS === 'ios' ? 'ios' : 'other'
  })
    .then((data) => {
      return {
        entities: data.boosts||[],
        offset: data['load-next'],
      }
    });
}

export function post(post) {
  return api.post('api/v1/newsfeed', post)
    .then((data) => {
      return {
        entity: data.activity,
      }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}

export function update(post) {
  return api.post('api/v1/newsfeed/' + post.guid, post)
    .then((data) => {
      return {
        entity: data.activity,
      }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}

export function remind(guid, post) {
  return api.post('api/v1/newsfeed/remind/' + guid , post)
    .then((data) => {
      return {
        guid: data.guid,
      }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}

export async function uploadAttachment(url, file, progress) {
  try {
    let data = await api.upload(url, file, null, progress);
    return data;
  } catch (e) {
      throw {
        error: e,
        url: url,
        file: file
      };
      throw "Ooops";
  }
}

/**
 * Toggle comments
 * @param {string} guid
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
 * @param {object} entity
 */
export async function setViewed(entity) {
  let data;
  try {
    if (entity.boosted) {
      data = await api.post('api/v2/analytics/views/boost/' + entity.boosted_guid );
    } else {
      data = await api.post('api/v2/analytics/views/activity/' + entity.guid);
    }
    return data;
  } catch (e) {
      throw e;
  }
}

/**
 * Toggle user block
 * @param {string} guid
 * @param {boolean} value
 */
export function toggleUserBlock(guid, value) {
  if (value) {
    return api.put('api/v1/block/' + guid);
  } else {
    return api.delete('api/v1/block/' + guid);
  }
}

/**
 * Toggle muted
 * @param {string} guid
 * @param {boolean} value
 */

export function toggleMuteNotifications(guid, value) {
  let action = value ? 'mute' : 'unmute'
  return api.post('api/v1/entities/notifications/' + guid + '/' + action)
    .then((data) => {
      return { data }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}

export function toggleExplicit(guid, value) {
  return api.post('api/v1/entities/explicit/' + guid, {value : value})
    .then((data) => {
      return { data }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
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

export function getSingle(guid) {
  return api.get('api/v1/newsfeed/single/'+guid);
}