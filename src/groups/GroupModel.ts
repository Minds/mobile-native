import { observable, decorate, action, runInAction } from 'mobx';
import BaseModel from '../common/BaseModel';
import { GOOGLE_PLAY_STORE, MINDS_CDN_URI } from '../config/Config';
import groupsService from './GroupsService';

export enum GroupAccessType {
  PRIVATE = 0,
  PUBLIC = 2,
}

/**
 * Group model
 */
export default class GroupModel extends BaseModel {
  @observable conversationDisabled = false;
  @observable mature_visibility = false;
  @observable briefdescription = '';
  @observable show_boosts: 1 | 0 = 1;
  membership = 2;
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
    if (this.isPublic) {
      this['is:member'] = true;
    } else {
      this['is:awaiting'] = true;
    }
    try {
      await groupsService.join(this.guid);
      if (this.isPublic) {
        GroupModel.events.emit('joinedGroup', this);
      } else {
        // we need to reftech the group to know the state, since we don't know if the user was invited
        const group = await groupsService.loadEntity(this.guid);
        this.update(group);
      }
    } catch (error) {
      console.log('Error joining', error);
      runInAction(() => {
        if (this.isPublic) {
          this['is:member'] = false;
        } else {
          this['is:awaiting'] = false;
        }
      });
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

  async acceptInvitation() {
    this['is:member'] = true;
    this['is:invited'] = false;
    try {
      await groupsService.acceptInvitation(this.guid);
      GroupModel.events.emit('joinedGroup', this);
    } catch (error) {
      runInAction(() => {
        this['is:member'] = false;
        this['is:invited'] = true;
      });
    }
  }

  async declineInvitation() {
    this['is:invited'] = false;
    try {
      await groupsService.declineInvitation(this.guid);
    } catch (error) {
      runInAction(() => {
        this['is:invited'] = true;
      });
    }
  }

  async cancelRequest() {
    this['is:awaiting'] = false;
    try {
      await groupsService.cancelRequest(this.guid);
    } catch (error) {
      runInAction(() => {
        this['is:awaiting'] = true;
      });
    }
  }

  get isBanned() {
    return Boolean(this['is:banned']);
  }

  get isMember() {
    return Boolean(this['is:member']);
  }

  get isAwaiting() {
    return Boolean(this['is:awaiting']);
  }

  get isInvited() {
    return Boolean(this['is:invited']);
  }

  get isPublic() {
    return this['membership'] === GroupAccessType.PUBLIC;
  }

  get isPrivate() {
    return this['membership'] === GroupAccessType.PRIVATE;
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
  membership: observable,
  'is:member': observable,
  'is:awaiting': observable,
  'is:invited': observable,
  'members:count': observable,
  'comments:count': observable,
});
