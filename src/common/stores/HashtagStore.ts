//@ts-nocheck
import { observable, action, computed } from 'mobx';

import hashtagService from '../services/hashtag.service';
import settingsStore from '../../settings/SettingsStore';

/**
 * Hashtag
 */
export class HashtagStore {
  @observable loading = false;
  @observable all = false;
  @observable hashtag = '';
  @observable suggested: { value: string; selected: boolean }[] = [];

  /**
   * Load suggested tags
   */
  async loadSuggested() {
    this.setLoading(true);
    const tags = await hashtagService.getSuggested();
    this.setLoading(false);
    this.setSuggested(tags);
  }

  @computed
  get selectedCount() {
    return this.suggested.filter(s => s.selected).length;
  }

  @action
  setHashtag(hashtag) {
    this.hashtag = hashtag;

    if (hashtag && !this.suggested.some(e => e.value === hashtag)) {
      this.suggested.push({ value: hashtag, selected: false });
    }
  }

  /**
   * Toggle all hashtag
   */
  @action
  toggleAll() {
    this.all = !this.all;
    settingsStore.setUseHashtags(!this.all);
  }

  /**
   * set all hashtag
   */
  @action
  setAll(value) {
    this.all = value;
    settingsStore.setUseHashtags(!this.all);
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
  create = async tag => {
    await this.select(tag);
    this.suggested.unshift(tag);
  };

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
