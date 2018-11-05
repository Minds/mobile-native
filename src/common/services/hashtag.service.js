import api from './api.service';
import { has } from 'mobx';

/**
 * Hashtag service
 */
class HashtagService {

  /**
   * Get suggested hastags
   */
  async getSuggested() {
    const response = await api.get('api/v2/hashtags/suggested');
    return response.tags;
  }

  /**
   * Delete a hashtag from the user
   * @param {string} hashtag
   */
  delete(hashtag) {
    return api.delete(`api/v2/hashtags/user/${hashtag}`);
  }

  /**
   * Add a hashtag to the user
   * @param {string} hashtag
   */
  add(hashtag) {
    return api.post(`api/v2/hashtags/user/${hashtag}`);
  }
}

export default new HashtagService();
