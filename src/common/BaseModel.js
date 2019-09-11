import {
  extendObservable,
  decorate,
  observable,
  action,
  computed,
  runInAction,
} from 'mobx';
import _ from 'lodash';
import sessionService from './services/session.service';
import { vote } from './services/votes.service';
import { toggleExplicit, toggleUserBlock, update } from '../newsfeed/NewsfeedService';
import logService from './services/log.service';
import channelService from '../channel/ChannelService';
import { revokeBoost, acceptBoost, rejectBoost } from '../boost/BoostService';

import { toggleAllowComments as toggleAllow } from '../comments/CommentsService';

/**
 * Base model
 */
export default class BaseModel {

  /**
   * Enable/Disable comments
   */
  @observable allow_comments = true;

  /**
   * List reference (if the entity belongs to one)
   * @var {OffsetListStore}
   */
  __list = null;

  /**
   *  List reference setter
   */
  set _list(value) {
    this.__list = value;
  }

  /**
   *  List reference getter
   */
  get _list() {
    return this.__list;
  }

  /**
   * Child models classes
   */
  childModels() {
    return {}
  }

  /**
   * Constructor
   */
  constructor(data) {
    Object.assign(this, data);

    // create childs instances
    const childs = this.childModels()
    for (var prop in childs) {
      if (this[prop]) {
        this[prop] = childs[prop].create(this[prop]);
      }
    }
  }

  /**
   * Update model data
   * @param {Object} data
   */
  @action
  update(data) {
    const childs = this.childModels();

    Object.getOwnPropertyNames(this).forEach(key => {
      if (data[key]) {

        if (childs[key]) {
          // we update the child model
          this[key].update(data[key]);
        } else {
          // we assign the property
          this[key] = data[key];
        }
      }
    });
  }

  /**
   * Create an instance
   * @param {object} data
   */
  static create(data) {
    return new this(data);
  }

  /**
   * Create an array of instances
   * @param {array} arrayData
   */
  static createMany(arrayData) {
    const collection = [];
    if (!arrayData) return collection;

    arrayData.forEach((data) => {
      collection.push(new this(data));
    });

    return collection;
  }

  /**
   * Check if data is an instance of the model and if it is not
   * returns a new instance
   * @param {object} data
   */
  static checkOrCreate(data) {
    if (data instanceof this) {
      return data;
    }
    return this.create(data);
  }

  /**
   * Get a property of the model if it exist or undefined
   * @param {string|array} property ex: 'ownerObj.merchant.exclusive.intro'
   */
  @action
  get(property) {
    return _.get(this, property);
  }

  /**
   * voted up
   */
  @computed
  get votedUp() {
    if (
      this['thumbs:up:user_guids']
      && this['thumbs:up:user_guids'].length
      && this['thumbs:up:user_guids'].indexOf(sessionService.guid) >= 0
    ) {
      return true;
    }
    return false;
  }

  /**
   * voted down
   */
  @computed
  get votedDown() {
    if (
      this['thumbs:down:user_guids']
      && this['thumbs:down:user_guids'].length
      && this['thumbs:down:user_guids'].indexOf(sessionService.guid) >= 0
    ) {
      return true;
    }
    return false;
  }

  /**
   * Toggle vote
   * @param {string} direction
   */
  @action
  async toggleVote(direction) {

    const voted = (direction == 'up') ? this.votedUp : this.votedDown;
    const delta = (voted) ? -1 : 1;

    const guids = this['thumbs:' + direction + ':user_guids'] || [];

    if (voted) {
      this['thumbs:' + direction + ':user_guids'] = guids.filter(function (item) {
        return item !== sessionService.guid;
      });
    } else {
      this['thumbs:' + direction + ':user_guids'] = [sessionService.guid, ...guids];
    }

    this['thumbs:' + direction + ':count'] += delta;

    const params = this.getClientMetadata();

    try {
      await vote(this.guid, direction, params)
    } catch (err) {
      if (!voted) {
        this['thumbs:' + direction + ':user_guids'] = guids.filter(function (item) {
          return item !== sessionService.guid;
        });
      } else {
        this['thumbs:' + direction + ':user_guids'] = [sessionService.guid, ...guids];
      }
      this['thumbs:' + direction + ':count'] -= delta;
      throw err;
    }
  }

  getClientMetadata() {
    return (this._list && this._list.metadataServie) ? this._list.metadataServie.getEntityMeta(this) : {};
  }

  /**
   * Block owner
   */
  blockOwner() {
    if (!this.ownerObj) throw new Error('This entity has no owner');
    return channelService.toggleBlock(this.ownerObj.guid, true);
  }

  /**
   * Unblock owner
   */
  unblockOwner() {
    if (!this.ownerObj) throw new Error('This entity has no owner');
    return channelService.toggleBlock(this.ownerObj.guid, false);
  }

  @action
  async toggleExplicit() {
    let value = !this.mature;
    try {
      await toggleExplicit(this.guid, value);
      this.mature = value;
    } catch (err) {
      this.mature = !value;
      logService.exception('[BaseModel]', err);
      throw err;
    }
  }

  @action
  async reject() {
    try {
      await rejectBoost(this.guid);
      this.state = 'rejected';
    } catch (err) {
      logService.exception('[BaseModel]', err);
      throw err;
    }
  }

  @action
  async accept() {
    try {
      await acceptBoost(this.guid);
      this.state = 'accepted';
    } catch (err) {
      logService.exception('[BaseModel]', err);
      throw err;
    }
  }

  @action
  async revoke(filter) {
    try {
      await revokeBoost(this.guid, filter);
      this.state = 'revoked';
    } catch (err) {
      logService.exception('[BaseModel]', err);
      throw err;
    }
  }

  @action
  async toggleAllowComments() {
    const data = await toggleAllow(this.guid, !this.allow_comments);
    this.allow_comments = !this.allow_comments;
  }
}