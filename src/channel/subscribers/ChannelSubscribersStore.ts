//@ts-nocheck
import { observable, action } from 'mobx';

import OffsetListStore from '../../common/stores/OffsetListStore';
import channelService from '../ChannelService';
import UserModel from '../UserModel';
import logService from '../../common/services/log.service';

/**
 * Subscribers Store
 */
class ChannelSubscribersStore {
  list = new OffsetListStore();
  @observable errorLoading = false;
  @observable loading = false;
  @observable filter = 'subscribers';

  guid = '';

  setGuid(guid) {
    let reload = this.guid != guid;
    this.guid = guid;
    this.loadList(reload);
  }

  /**
   * Set action
   */
  @action
  setLoading(value: boolean) {
    this.loading = value;
  }

  /**
   * Set the error loading flag
   * @param {boolean} value
   */
  @action
  setErrorLoading(value: boolean) {
    this.errorLoading = value;
  }

  /**
   * Load boost list
   */
  loadList = async (reload = false) => {
    if (this.list.cantLoadMore()) {
      return Promise.resolve();
    }

    if (reload) {
      this.list.clearList();
    }

    this.loading = true;

    try {
      this.setLoading(true);
      this.setErrorLoading(false);
      const feed = await channelService.getSubscribers(
        this.guid,
        this.filter,
        this.list.offset,
      );

      feed.entities = UserModel.createMany(feed.entities);
      this.list.setList(feed);
    } catch (err) {
      this.setErrorLoading(true);
      logService.exception(err);
    } finally {
      this.setLoading(false);
    }
  };

  @action
  reset() {
    this.guid = null;
    this.list.clearList();
    this.filter = 'subscribers';
  }

  /**
   * Refresh list
   */
  refresh() {
    this.list.refresh();
    this.loadList().finally(() => {
      this.list.refreshDone();
    });
  }

  @action
  setFilter(filter) {
    this.filter = filter;
    this.loading = false;
    this.list.clearList();
    this.loadList();
  }
}

export default ChannelSubscribersStore;
