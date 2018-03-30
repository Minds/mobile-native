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

  @observable filter = 'featured';

  /**
   * List loading
   */
  loading = false;

  @action
  setFilter(value) {
    this.filter = value;
    this.refresh();
  }

  /**
   * Load list
   */
  loadList() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    return groupsService.loadList(this.filter, this.list.offset)
      .then(data => {
        this.list.setList(data);
        this.assignRowKeys(data);
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
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.list.entities.length}`;
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

  @action
  reset() {
    this.list = new OffsetFeedListStore('shallow');
    this.loading = false;
  }

}

export default new GroupsStore();