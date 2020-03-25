import { observable, action } from 'mobx'

import groupsService from './GroupsService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import OffsetListStore from '../common/stores/OffsetListStore';
import UserModel from '../channel/UserModel';
import ActivityModel from '../newsfeed/ActivityModel';
import logService from '../common/services/log.service';
import entitiesService from '../common/services/entities.service';
import GroupModel from './GroupModel';
import FeedStore from '../common/stores/FeedStore';

/**
 * Groups store
 */
class GroupViewStore {
  /**
   * Top members (used to display avatars on top)
   */
  @observable topMembers = [];

  /**
   * List Members
   */
  members = new OffsetListStore('shallow');

  /**
   * Feed store
   */
  feed = new FeedStore(true);

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
   * is loading
   */
  @observable loading = false;

  /**
   * member search
   */
  memberSearch = '';

  guid = '';

  constructor() {
    this.feed.getMetadataService()
      .setSource('feed/groups')
      .setMedium('feed');
  }

  /**
   * Set guid
   * @param {stirng} guid
   */
  setGuid(guid) {
    this.guid = guid;
  }

  @action
  setLoading(value) {
    this.loading = value;
  }

  /**
   * Load feed
   */
  async loadFeed() {
    this.feed
      .setEndpoint(`api/v2/feeds/container/${this.group.guid}/activities`)
      .setLimit(12)
      .fetchRemoteOrLocal();
  }

  /**
   * Set the member search
   * @param {string} q
   */
  setMemberSearch(q) {
    this.memberSearch = q;
    this.members.clearList();
    this.loadMembers();
  }

  @action
  async loadTopMembers() {
    const data = await groupsService.loadMembers(this.guid, '', 6);
    this.topMembers = UserModel.createMany(data.members);
  }

  /**
   * Load Members
   */
  async loadMembers() {

    if (this.members.cantLoadMore() || this.loading) {
      return;
    }

    this.setLoading(true);

    const serviceFetch = this.memberSearch ?
      groupsService.searchMembers(this.guid, this.members.offset, 21, this.memberSearch) :
      groupsService.loadMembers(this.guid, this.members.offset);

    try {
      const data = await serviceFetch;
      data.entities = UserModel.createMany(data.members);
      data.offset = data['load-next'];
      this.members.setList(data);
      this.assignRowKeys(data);
    } catch (err) {
      logService.exception(err)
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Load one group
   * @param {string} guid
   */
  async loadGroup(defaultGroup) {
    const group = await entitiesService.single(`urn:entity:${defaultGroup.guid}`, GroupModel.checkOrCreate(defaultGroup));
    this.setGroup(group);
    this.feed.viewed.clearViewed();
    return group;
  }

  async loadGroupByGuid(guid) {
    const group = await entitiesService.single(`urn:entity:${guid}`);
    this.setGroup(group);
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
   * Kick given user
   * @param {object} user
   */
  async kick(user) {
    const result = await groupsService.kick(this.group.guid, user.guid);
    if (!!result.done) {
      this.members.entities.remove(user);
    }
  }

  /**
   * Ban given user
   * @param {object} user
   */
  async ban(user) {
    const result = await groupsService.ban(this.group.guid, user.guid);
    if (!!result.done) {
      this.members.entities.remove(user);
    }
  }

  /**
   * Make given user moderator
   * @param {object} user
   */
  async makeModerator(user) {
    const result = await groupsService.makeModerator(this.group.guid, user.guid);
    if (!!result.done) {
      user['is:moderator'] = true;
    }
  }

  /**
   * Revoke moderator to given user
   * @param {object} user
   */
  async revokeModerator(user) {
    const result = await groupsService.revokeModerator(this.group.guid, user.guid);
    if (!!result.done) {
      user['is:moderator'] = false;
    }
  }

  /**
   * Make given user owner
   * @param {object} user
   */
  async makeOwner(user) {
    const result = await groupsService.makeOwner(this.group.guid, user.guid);
    if (!!result.done) {
      user['is:owner'] = true;
    }
  }

  /**
   * Revoke ownership to given user
   * @param {object} user
   */
  async revokeOwner(user) {
    const result = await groupsService.revokeOwner(this.group.guid, user.guid);
    if (!!result.done) {
      user['is:owner'] = false;
    }
  }

  /**
   * Join group
   * @param {string} guid
   */
  join(guid) {
    this.setSaving(true);
    this.group['is:member'] = true
    return groupsService.join(guid)
      .then(() => {
        this.setSaving(false);
      })
      .catch(action( e => {
        this.group['is:member'] = false
        this.setSaving(false);
      }))
  }

  /**
   * Leave group
   * @param {string} guid
   */
  leave(guid) {
    this.setSaving(true);
    this.group['is:member'] = false
    return groupsService.leave(guid)
      .then(() => {
        this.setSaving(false);
      })
      .catch(action( e => {
        this.group['is:member'] = true
        this.setSaving(false);
      }))
  }

  /**
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.feed.entities.length}`;
    });
  }

  /**
   * Prepend an entity into the feed
   * @param {object} entity
   */
  prepend(entity) {
    const model = ActivityModel.create(entity)

    model.rowKey = `${model.guid}:0:${this.feed.entities.length}`

    this.feed.prepend(model);
  }
  /**
   * clear the store to default values
   */
  @action
  clear() {
    // this.list.clearList();
    this.feed.clear();
    this.members.clearList();
    this.group = null;
    this.tab = 'feed';
    this.memberSearch = '';
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
    this.group = GroupModel.checkOrCreate(group);
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
