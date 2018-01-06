import { observable, action } from 'mobx'

import groupsService from './GroupsService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';

/**
 * Groups store
 */
class GroupViewStore {
  /**
   * List store
   */
  @observable list = new OffsetFeedListStore();

  /**
   * Group
   */
  @observable group = null;

  /**
   * List loading
   */
  loading = false;

  /**
   * Load list
   */
  loadList(guid) {

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

  loadGroup(guid) {
    groupsService.loadEntity(this.props.navigation.state.params.guid)
      .then(group => {
        this.setGroup(group);
      });
  }

  @action
  setGroup(group) {
    this.group = group;
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

export default new GroupViewStore();