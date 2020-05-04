import { observable, decorate, action, runInAction } from 'mobx';
import BaseModel from '../common/BaseModel';
import groupsService from './GroupsService';

/**
 * Group model
 */
export default class GroupModel extends BaseModel {
  @observable conversationDisabled = false;
  name!: string;

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
