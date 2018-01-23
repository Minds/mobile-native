import { Platform } from 'react-native';

import api from './../common/services/api.service';

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
export function getBoosts(offset, limit) {
  return api.get('api/v1/boost/fetch/newsfeed', {
    limit,
    offset,
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

export function uploadAttachment(url, file) {
  return api.upload(url, file).then((data) => {
    return data;
  })
  .catch(err => {
    console.log('error');
    throw "Ooops";
  });
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