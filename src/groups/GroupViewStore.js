import { observable, action } from 'mobx'

import groupsService from './GroupsService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';

/**
 * Groups store
 */
class GroupViewStore {
  /**
   * List feed store
   */
  @observable list = new OffsetFeedListStore();

  /**
   * Group
   *
   * (Used a ref observable to keep the same object of the list)
   */
  @observable.ref group = null;

  /**
   * Selected tab
   */
  @observable tab = 'feed';

  /**
   * is saving
   */
  @observable saving = false;

  /**
   * List loading
   */
  loading = false;

  /**
   * Load feed
   */
  loadFeed(guid) {

    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    return groupsService.loadFeed(guid, this.list.offset)
      .then(data => {
        this.list.setList(data);
        this.loaded = true;
      })
      .finally(() => {
        this.loading = false;
      })
      .catch(err => {
        console.log('error', err);
      });
  }

  /**
   * Load one group
   * @param {string} guid
   */
  loadGroup(guid) {
    groupsService.loadEntity(guid)
      .then(group => {
        this.setGroup(group);
      });
  }

  /**
   * Set saving
   * @param {boolean} s
   */
  @action
  setSaving(s) {
    this.saving = s;
  }

  /**
   * Join group
   * @param {string} guid
   */
  join(guid) {
    this.setSaving(true);
    return groupsService.join(guid)
      .then(action(() => {
        this.group['is:member'] = true
        this.setSaving(false);
      }));
  }

  /**
   * Leave group
   * @param {string} guid
   */
  leave(guid) {
    this.setSaving(true);
    return groupsService.leave(guid)
      .then(action(() => {
        this.group['is:member'] = false
        this.setSaving(false);
      }));
  }

  /**
   * clear the store to default values
   */
  @action
  clear() {
    this.list.clearList();
    this.group = null;
    this.tab = 'feed';
  }

  /**
   * Set tab
   * @param {string} tab
   */
  @action
  setTab(tab) {
    this.tab = tab;
  }

  /**
   * Set the group
   * @param {object} group
   */
  @action
  setGroup(group) {
    this.group = group;
    this.group.algo = 2;
  }

  /**
   * Refresh feed
   */
  @action
  refresh(guid) {
    this.list.refresh();
    this.loadFeed(guid)
      .finally(() => {
        this.list.refreshDone();
      });
  }
}

export default new GroupViewStore();