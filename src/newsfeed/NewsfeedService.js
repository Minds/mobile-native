import { Platform } from 'react-native';

import api from './../common/services/api.service';

export function getFeed(offset) {
  return api.get('api/v1/newsfeed/network/', { offset: offset, limit: 12 })
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

export function getFeedChannel(guid, offset) {
  return api.get('api/v1/newsfeed/personal/' + guid, { offset: offset, limit: 12 })
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

export function getBoosts(limit) {
  return api.get('api/v1/boost/fetch/newsfeed', {
    limit: limit,
    platform: Platform.OS === 'ios' ? 'ios' : 'other'
  })
    .then(({ boosts = [] }) => {
      return boosts;
    })
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

export function deleteItem(guid) {
  return api.delete('api/v1/newsfeed/' + guid);
}