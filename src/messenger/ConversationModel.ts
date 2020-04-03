//@ts-nocheck
import BaseModel from '../common/BaseModel';
import {observable} from 'mobx';

/**
 * Conversation model
 */
export default class ConversationModel extends BaseModel {
  @observable unread = false;
  @observable online = false;

  //TODO: move decryption logic here
}
