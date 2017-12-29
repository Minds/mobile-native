import api from './../common/services/api.service';

/**
 * Messenger Service
 */
class MessengerService {

  /**
   * Get Crypto Keys from server
   * @param {string} password
   */
  getCrytoKeys(password) {
    return api.get('api/v1/keys', {
      password: password
    }).then((response) => {
      if (response.key) {
        return response.key;
      }
      return null;
    });
  }

  /**
   * Get conversations list
   * @param {number} limit
   * @param {string} offset
   */
  getConversations(limit, offset = "", refresh=false) {

    const params = { limit: limit, offset: offset };
    if ( refresh ) {
      params.refresh = true
    }

    return api.get('api/v2/conversations', params)
      .then((data) => {
        return {
          entities: data.conversations || [],
          offset:   data['load-next']  || '',
        };
      });
  }

  /**
   * Search for conversations
   * @param {number} limit
   * @param {string} offset
   */
  searchConversations(q, limit, offset) {
    return api.get('api/v2/conversations/search', {q: q, limit: limit, offset: offset})
      .then((data) => {
        return {
          entities: data.conversations || [],
          offset:   data['load-next']  || '',
        };
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

  /**
   * Send encrypted messages
   * @param {string} guid
   * @param {object} messages
   */
  send(guid, messages) {
    let data = {};
    for (var index in messages) {
      data["message:" + index] = messages[index];
    }

    return api.post('api/v2/conversations/' + guid, data)
  }
}

export default new MessengerService();