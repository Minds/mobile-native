import { observable, action } from 'mobx'

import groupsService from './GroupsService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';

/**
 * Groups store
 */
class GroupsStore {
  /**
   * List store
   */
  @observable list = new OffsetFeedListStore('shallow');

  /**
   * List loading
   */
  loading = false;

  /**
   * Load list
   */
  loadList() {

    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    return groupsService.loadList('featured', this.list.offset)
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

  @action
  refresh() {
    this.list.refresh();
    this.loadList()
      .finally(() => {
        this.list.refreshDone();
      });
  }
}

export default new GroupsStore();