import {
  observable,
  action,
} from 'mobx';

import hashtagService from '../services/hashtag.service'

/**
 * Hashtag
 */
class HashtagStore {

  @observable loading = false;
  @observable suggested = [];

  /**
   * Load suggested tags
   */
  async loadSuggested() {
    this.setLoading(true);
    const tags = await hashtagService.getSuggested();
    this.setLoading(false);
    this.setSuggested(tags);
  }

  /**
   * Set loading
   * @param {boolean} value
   */
  @action
  setLoading(value) {
    this.loading = value;
  }

  /**
   * Set suggested
   * @param {array} suggested
   */
  @action
  setSuggested(suggested) {
    this.suggested = suggested;
  }

  /**
   * Select tag
   * @param {string} tag
   */
  @action
  async select(tag) {
    tag.selected = true;
    try {
      const result = await hashtagService.add(tag.value);
      if (result.status !== 'success') {
        tag.selected = false;
      }
    } catch (e) {
      tag.selected = false;
    }
  }

  /**
   * Create and select a new tag
   * @param {string} tag
   */
  @action
  create = async (tag) => {
    await this.select(tag);
    this.suggested.push(tag);
  }

  /**
   * Deselect tag
   * @param {string} tag
   */
  @action
  async deselect(tag) {
    tag.selected = false;

    try {
      const result = await hashtagService.delete(tag.value);
      if (result.status !== 'success') {
        tag.selected = true;
      }
    } catch (e) {
      tag.selected = true;
    }
  }

  /**
   * Reset
   */
  @action
  reset() {
    this.suggested = [];
  }
}

export default HashtagStore;
