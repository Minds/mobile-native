import BaseModel from '../common/BaseModel';

/**
 * User model
 */
export default class UserModel extends BaseModel {

  /**
   * observables
   */
  static observables = [
    'blocked',
    'subscribed',
  ]
}