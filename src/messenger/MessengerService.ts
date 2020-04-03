//@ts-nocheck
import api from './../common/services/api.service';

/**
 * Messenger Service
 */
class MessengerService {

  /**
   * Get Crypto Keys from server
   * @param {string} password
   */
  async getCryptoKeys(password) {
    const response = await api.get('api/v2/messenger/keys', {
      password: password
    });
    if (response.key) {
      return response.key;
    }
    return null;
  }

  /**
   * Setup messenger keys
   * @param {string} password
   */
  async doSetup(password) {
    const response = await api.post('api/v2/messenger/keys/setup', { password: password, download: false })
    if (response.password) {
      return response.password;
    }
    return null;
  }

  /**
   * Get conversations list
   * @param {number} limit
   * @param {string} offset
   */
  async getConversations(limit, offset = "", refresh=false, tag) {

    const params = { limit: limit, offset: offset };
    if ( refresh ) {
      params.refresh = true
    }

    const data = await api.get('api/v2/messenger/conversations', params, tag)

    return {
      entities: data.conversations || [],
      offset:   data['load-next']  || '',
    };
  }

  /**
   * Search for conversations
   * @param {number} limit
   * @param {string} offset
   */
  async searchConversations(q, limit, tag) {
    const data = await api.get('api/v2/messenger/search', {q: q, limit: limit, offset: ''}, tag)

    return {
      entities: data.conversations || [],
      offset:   data['load-next']  || '',
    };
  }

  /**
   * Get message for a conversation from server
   * @param {number} limit
   * @param {string} guid
   * @param {string} offset
   */
  async getConversationFromRemote(limit, guid, offset = "") {
    const conversation = await api.get('api/v2/messenger/conversations/' + guid, {
      limit: 8,
      offset: offset,
      finish: '',
    });
    conversation.messages = conversation.messages || [];
    return conversation;
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