import { observable, decorate } from 'mobx';
import BaseModel from '../common/BaseModel';

/**
 * Group model
 */
export default class GroupModel extends BaseModel {

}

/**
 * Define model observables
 */
decorate(GroupModel, {
  'briefdescription': observable,
  'name': observable,
  'is:member': observable,
  'members:count': observable,
});