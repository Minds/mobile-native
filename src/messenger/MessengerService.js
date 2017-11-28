import api from './../common/services/api.service';

import { RSA } from 'react-native-rsa-native';

/**
 * Messenger Service
 */
class MessengerService {
  privateKey = null;

  /**
   * Get Crypto Keys from server
   * @param {string} password
   */
  getCrytoKeys(password) {
    return api.get('api/v1/keys', {
      password: password,
      new_password: 'abc123'
    }).then((response) => {
      if (response.key) {
        this.privateKey = response.key;
      } else {
        console.log('no keys');
      }
    })
    .catch(() => {
      console.log('error getting keys');
    });
  }

  /**
   * Get conversations list
   * @param {number} limit
   * @param {string} offset
   */
  getConversations(limit, offset = "") {
    return api.get('api/v2/conversations', {
      limit: limit,
      offset: offset
    });
  }

  /**
   * Search for conversations
   * @param {number} limit
   * @param {string} offset
   */
  searchConversations(q, limit, offset) {
    return api.get('api/v2/conversations/search', {
      q: q,
      limit: limit,
      offset: offset
    });
  }

  /**
   * Get message for a conversation from server
   * @param {number} limit
   * @param {string} guid
   * @param {string} offset
   */
  getConversationFromRemote(limit, guid, offset = "") {
    return api.get('api/v2/conversations/' + guid, {
      limit: limit,
      offset: offset
    });
  }
}

export default new MessengerService();