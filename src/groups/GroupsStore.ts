//@ts-nocheck
import { observable, action } from 'mobx';

import groupsService from './GroupsService';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import GroupModel from './GroupModel';
import logService from '../common/services/log.service';
import { isNetworkError } from '../common/services/api.service';

/**
 * Groups store
 */
class GroupsStore {
  /**
   * List store
   */
  @observable list = new OffsetFeedListStore('shallow');

  @observable filter = 'member';
  @observable loading = false;

  @action
  setLoading(value) {
    this.loading = value;
  }

  /**
   * Load list
   */
  async loadList() {
    if (this.list.cantLoadMore()) {
      return;
    }

    this.setLoading(true);
    this.list.setErrorLoading(false);

    try {
      const data = await groupsService.loadList(this.filter, this.list.offset);
      data.entities = GroupModel.createMany(data.entities);
      this.list.setList(data);
      this.assignRowKeys(data);
      this.loaded = true;
    } catch (err) {
      // ignore aborts
      if (isAbort(err)) return;
      this.list.setErrorLoading(true);
      if (!isNetworkError(err)) {
        logService.exception('[GroupsStore]', err);
      }
    } finally {
      this.setLoading(false);
    }
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
    this.loadList().finally(() => {
      this.list.refreshDone();
    });
  }

  @action
  reset() {
    this.list = new OffsetFeedListStore('shallow');
    this.loading = false;
    this.filter = 'member';
  }
}

export default GroupsStore;
