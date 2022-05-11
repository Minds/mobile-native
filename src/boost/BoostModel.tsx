import BaseModel from '../common/BaseModel';
import UserModel from '../channel/UserModel';
import { extendObservable } from 'mobx';

/**
 * User model
 */
export default class BoostModel extends BaseModel {
  constructor() {
    super();
    extendObservable(this, {
      state: this.state,
    });
  }

  /**
   * Child models
   */
  childModels() {
    return {
      ownerObj: UserModel,
    };
  }
}
