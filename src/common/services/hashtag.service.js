import api from './api.service';
import { has } from 'mobx';

/**
 * Hashtag service
 */
class HashtagService {

  maxHashtags = 5;
  /**
   * Get suggested hastags
   */
  async getSuggested() {
    const response = await api.get('api/v2/hashtags/suggested', {limit: 24});
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

  /**
   * Gets a list of all hashtags in a given string. 
   * For example "cat #dog bat #rat returns ['dog','rat']")
   * 
   * @input {string} inputText - The text to be searched.
   * @returns {Array<string>} - array of each hashtag minus the # (as a string).

   *  Credit to Arnaud Valensi - http://geekcoder.org/js-extract-hashtags-from-text/
   */
  slice(input) {
    try{
      const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
      let matches = [];
      let match;
      while ((match = regex.exec(input))) {
          matches.push(match[1]);
      }
      return matches;
    }catch(e){
      return [];
    }
  }

}

export default new HashtagService();
