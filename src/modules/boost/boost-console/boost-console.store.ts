import { action, observable } from 'mobx';
import { isAbort, isNetworkError } from '~/common/services/api.service';
import logService from '~/common/services/log.service';
import OffsetListStore from '~/common/stores/OffsetListStore';
import { hasVariation } from '../../../../ExperimentsProvider';
import BoostModel from '../models/BoostModel';
import BoostModelV3 from '../models/BoostModelV3';
import { getBoosts, getBoostsV3 } from './boost-console.api';
import { BoostStatus } from './types/BoostConsoleBoost';

/**
 * Boosts Store
 */
class BoostConsoleStore {
  /**
   * Boost list store
   */
  list = new OffsetListStore();

  /**
   * Boosts list filter
   */
  @observable filter: 'feed' | 'sidebar' = 'feed';
  @observable peer_filter = 'inbox';
  @observable feedFilter: 'all' | BoostStatus = 'all';

  /**
   * List loading
   */
  @observable loading = false;

  /**
   * Load boost list
   */
  async loadList(refresh = false) {
    if (this.list.cantLoadMore() || this.loading) {
      return;
    }
    this.loading = true;

    try {
      // @ts-ignore
      const peer_filter = this.filter === 'peer' ? this.peer_filter : null;
      let feed: any = null; // TODO: any
      if (hasVariation('mob-4638-boost-v3')) {
        feed = await getBoostsV3(
          this.list.offset,
          this.filter,
          this.feedFilter === 'all' ? undefined : this.feedFilter,
        );
        this.assignRowKeys(feed);
        feed.entities = BoostModelV3.createMany(feed.entities);
      } else {
        feed = await getBoosts(this.list.offset, this.filter, peer_filter);
        this.assignRowKeys(feed);
        feed.entities = BoostModel.createMany(feed.entities);
      }
      this.list.setList(feed, refresh);
    } catch (err) {
      // ignore aborts
      if (isAbort(err)) return;
      if (!isNetworkError(err)) {
        logService.exception('[BoostStore]', err);
      }
    } finally {
      this.loading = false;
    }
  }

  /**
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    if (!feed.entities) return;
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.list.entities.length}`;
    });
  }

  /**
   * Refresh list
   */
  async refresh() {
    await this.list.refresh();
    await this.loadList();
    this.list.refreshDone();
  }

  @action
  setFilter = filter => {
    // for backward compatibility
    this.filter = filter === 'newsfeed' ? 'feed' : filter;
    this.list.clearList();
    this.loadList();
  };

  @action
  setPeerFilter(filter) {
    this.peer_filter = filter;
    this.list.clearList();
    this.loadList();
  }

  @action
  setFeedFilter(filter: 'all' | BoostStatus) {
    this.feedFilter = filter;
    this.list.clearList();
    this.loadList();
  }

  @action
  reset() {
    this.list = new OffsetListStore();
    this.filter = 'feed';
    this.feedFilter = 'all';
    this.peer_filter = 'inbox';
    this.loading = false;
  }
}

export default BoostConsoleStore;
