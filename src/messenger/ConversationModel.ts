import BaseModel from '../common/BaseModel';
import { observable } from 'mobx';

/**
 * Conversation model
 */
export default class ConversationModel extends BaseModel {
  @observable unread = false;
  @observable online = false;
  participants = [];
  messages = [];

  /**
   * define if we are allowed to contact this user
   */
  get allowContact() {
    if (this.messages.length > 0) {
      return true;
    }
    const participant: any = Array.isArray(this.participants)
      ? this.participants[0]
      : null;

    return participant.subscriber || participant.allow_unsubscribed_contact;
  }
}
