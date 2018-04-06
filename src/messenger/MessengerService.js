import api from './../common/services/api.service';

/**
 * Messenger Service
 */
class MessengerService {

  controllers = {
    getConversationFromRemote: null,
  };

  /**
   * Get Crypto Keys from server
   * @param {string} password
   */
  getCrytoKeys(password) {
    return api.get('api/v2/messenger/keys', {
      password: password
    }).then((response) => {
      if (response.key) {
        return response.key;
      }
      return null;
    });
  }

  /**
   * Setup messenger keys
   * @param {string} password 
   */
  doSetup(password) {
    return api.post('api/v2/messenger/keys/setup', { password: password, download: false })
    .then(resp => {
      if (resp.password) {
        return resp.password;
      }
      return null;
    })
    .catch(err => {
      console.log('error');
    });
  }

  /**
   * Get conversations list
   * @param {number} limit
   * @param {string} offset
   */
  getConversations(limit, offset = "", refresh=false) {

    const params = { limit: limit, offset: offset, ts: Date.now() };
    if ( refresh ) {
      params.refresh = true
    }

    return api.get('api/v2/messenger/conversations', params)
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
  searchConversations(q, limit, signal) {
    return api.get('api/v2/messenger/search', {q: q, limit: limit, offset: ''}, signal)
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
    if (this.controllers.getConversationFromRemote)
      this.controllers.getConversationFromRemote.abort();

    this.controllers.getConversationFromRemote = new AbortController();

    return api.get('api/v2/messenger/conversations/' + guid + '/' + Date.now, {
      limit: 8, 
      offset: offset,
      finish: '',
    }, this.controllers.getConversationFromRemote.signal)
      .then(conversation => {
        conversation.messages = conversation.messages || [];
        return conversation;
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

    return api.post('api/v2/messenger/conversations/' + guid, data)
  }

  /**
   * Invite a user
   * @param {string} guid 
   */
  invite(guid) {
    return api.put(`api/v2/conversations/invite/${guid}`);
  }
}

export default new MessengerService();