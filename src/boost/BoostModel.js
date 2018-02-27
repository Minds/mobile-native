import { MINDS_CDN_URI } from '../config/Config';
import api from '../common/services/api.service';
import BaseModel from '../common/BaseModel';

/**
 * User model
 */
export default class BoostModel extends BaseModel {

  /**
   * observables
   */
  static observables = [
    'state',
  ]
}