import { observable, decorate, action, runInAction } from 'mobx';
import BaseModel from '../common/BaseModel';
import { GOOGLE_PLAY_STORE } from '../config/Config';
import groupsService from './GroupsService';

/**
 * Group model
 */
export default class GroupModel extends BaseModel {
  @observable conversationDisabled = false;
  @observable mature_visibility = false;
  name!: string;
  nsfw: Array<number> = [];

  @action
  toggleMatureVisibility() {
    if (GOOGLE_PLAY_STORE) return;
    this.mature_visibility = !this.mature_visibility;
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
}

/**
 * Define model observables
 */
decorate(GroupModel, {
  //@ts-ignore
  briefdescription: observable,
  name: observable,
  'is:member': observable,
  'members:count': observable,
});
