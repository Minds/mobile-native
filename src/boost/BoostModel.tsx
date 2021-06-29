import { observable } from 'mobx';
import BaseModel from '../common/BaseModel';
import UserModel from '../channel/UserModel';
/**
 * User model
 */
export default class BoostModel extends BaseModel {
  /**
   * Child models
   */
  childModels() {
    return {
      ownerObj: UserModel,
    };
  }
}
