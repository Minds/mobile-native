import { observable, action } from 'mobx';

import groupsService from './GroupsService';
import GroupModel from './GroupModel';
import logService from '../common/services/log.service';
import { isAbort, isNetworkError } from '~/common/services/ApiErrors';
import OffsetListStore from '../common/stores/OffsetListStore';
import { storages } from '../common/services/storage/storages.service';

const HAS_GROUPS_KEY = 'groups:has_groups';

/**
 * Groups store
 */
class GroupsStore {
  /**
   * List store
   */
  @observable list = new OffsetListStore<GroupModel>('shallow');

  @observable filter?: 'member' | 'suggested' = 'member';
  @observable loading = false;
  @observable loaded = false;
  @observable hasGroups = storages.user?.getBool(HAS_GROUPS_KEY) ?? false;

  constructor() {
    // we don't need to unsubscribe to the event because this stores is destroyed when the app is closed
    GroupModel.events.on('joinedGroup', this.onJoinGroup);
    GroupModel.events.on('leavedGroup', this.onLeaveGroup);
  }

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
      this.setHasGroups(!!this.list.entities.length);
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
    this.list = new OffsetListStore('shallow');
    this.loading = false;
    this.filter = 'member';
  }

  @action
  private onJoinGroup = (group: GroupModel) => {
    this.list.prepend(group);
    this.setHasGroups(!!this.list.entities.length);
  };

  @action
  private onLeaveGroup = (group: GroupModel) => {
    const index = this.list.entities.findIndex(gr => gr.guid === group.guid);
    this.list.removeIndex(index);
    this.setHasGroups(!!this.list.entities.length);
  };

  private setHasGroups(value: boolean) {
    this.hasGroups = value;
    storages.user?.setBool(HAS_GROUPS_KEY, value);
  }
}

export default GroupsStore;
