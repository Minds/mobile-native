import { observable, action } from 'mobx'

import groupsService from './GroupsService';

import { getFeedChannel, toggleComments , toggleExplicit, setViewed } from '../newsfeed/NewsfeedService';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import OffsetListStore from '../common/stores/OffsetListStore';
import UserModel from '../channel/UserModel';
import ActivityModel from '../newsfeed/ActivityModel';

/**
 * Groups store
 */
class GroupViewStore {

  /**
   * List feed store
   */
  @observable list = new OffsetFeedListStore();

  /**
   * List Members
   */
  @observable members = new OffsetListStore('shallow');

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
  viewed = [];
  loading = false;
  guid = '';

  /**
   * Set guid
   * @param {stirng} guid
   */
  setGuid(guid) {
    this.guid = guid;
  }

  /**
   * Load feed
   */
  loadFeed() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    return groupsService.loadFeed(this.guid, this.list.offset)
      .then(data => {
        data.entities = ActivityModel.createMany(data.entities);
        this.assignRowKeys(data);
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
   * Load Members
   */
  loadMembers() {

    if (this.members.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    return groupsService.loadMembers(this.guid, this.members.offset)
      .then(data => {
        data.entities = UserModel.createMany(data.members);
        data.offset = data['load-next'];
        this.members.setList(data);
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


  @action
  async addViewed(entity) {
    if(this.viewed.indexOf(entity.guid) < 0) {
      let response;
      try {
        response = await setViewed(entity);
        if (response) {
          this.viewed.push(entity.guid);
        }
      } catch (e) {
        throw new Error('There was an issue storing the view');
      }
    }
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
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.list.entities.length}`;
    });
  }

  /**
   * Prepend an entity into the feed
   * @param {object} entity
   */
  prepend(entity) {
    const model = ActivityModel.create(entity)

    model.rowKey = `${model.guid}:0:${this.list.entities.length}`

    this.list.prepend(model);
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
    this.setGuid(group.guid);
  }

  /**
   * Refresh feed
   */
  @action
  refresh() {
    this.list.refresh();
    this.loadFeed(this.guid)
      .finally(() => {
        this.list.refreshDone();
      });
  }

  /**
   * Refresh members
   */
  @action
  memberRefresh() {
    this.members.refresh();
    this.loadMembers(this.guid)
      .finally(() => {
        this.members.refreshDone();
      });
  }

  @action
  reset() {
    this.list = new OffsetFeedListStore();
    this.members = new OffsetListStore('shallow');
    this.group = null;
    this.tab = 'feed';
    this.saving = false;
    this.loading = false;
  }

}

export default GroupViewStore;