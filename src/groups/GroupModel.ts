import { observable, decorate, action, runInAction } from 'mobx';
import BaseModel from '../common/BaseModel';
import { GOOGLE_PLAY_STORE, MINDS_CDN_URI } from '../config/Config';
import groupsService from './GroupsService';

/**
 * Group model
 */
export default class GroupModel extends BaseModel {
  @observable conversationDisabled = false;
  @observable mature_visibility = false;
  @observable briefdescription = '';
  @observable show_boosts: 1 | 0 = 1;
  name!: string;
  type!: string;
  nsfw: Array<number> = [];
  icontime: any;
  entity_guid?: string;
  brief_description = '';
  boosted?: boolean;

  @action
  toggleMatureVisibility() {
    if (GOOGLE_PLAY_STORE) return;
    this.mature_visibility = !this.mature_visibility;
  }

  @action
  toggleShowBoosts(enabled: boolean) {
    this.show_boosts = enabled ? 1 : 0;
    groupsService.toggleShowBoosts(this.guid, this.show_boosts);
  }

  @action
  async toggleConversationDisabled() {
    await groupsService.toggleConversationDisabled(
      this.guid,
      !this.conversationDisabled,
    );
    this.conversationDisabled = !this.conversationDisabled;
  }

  @action
  async join() {
    this['is:member'] = true;
    try {
      await groupsService.join(this.guid);
      GroupModel.events.emit('joinedGroup', this);
    } catch (error) {
      runInAction(() => (this['is:member'] = false));
    }
  }

  @action
  async leave() {
    this['is:member'] = false;
    try {
      await groupsService.leave(this.guid);
      GroupModel.events.emit('leavedGroup', this);
    } catch (error) {
      runInAction(() => (this['is:member'] = true));
    }
  }

  getAvatar(size = 'small') {
    return {
      rounded: true,
      size: 45,
      source: {
        uri: `${MINDS_CDN_URI}fs/v1/avatars/${this.guid}/${size}/${this.icontime}`,
      },
    };
  }

  /**
   * Increment the comments counter
   */
  @action
  incrementCommentsCounter() {
    this['comments:count']++;
  }

  /**
   * Decrement the comments counter
   */
  @action
  decrementCommentsCounter() {
    this['comments:count']--;
  }
}

/**
 * Define model observables
 */
//@ts-ignore
decorate(GroupModel, {
  name: observable,
  'is:member': observable,
  'members:count': observable,
  'comments:count': observable,
});
