import { observable, action, computed, toJS, runInAction } from 'mobx';
import _ from 'lodash';
import EventEmitter from 'eventemitter3';

import sessionService from './services/session.service';
import { vote } from './services/votes.service';
import { recordView, toggleExplicit } from '../newsfeed/NewsfeedService';
import logService from './services/log.service';
import { toggleAllowComments as toggleAllow } from '../comments/CommentsService';
import type UserModel from '../channel/UserModel';
import type FeedStore from './stores/FeedStore';
import AbstractModel from './AbstractModel';
import MetadataService, { MetadataMedium } from './services/metadata.service';
import { storeRatingService } from 'modules/store-rating';

/**
 * Base model
 */
export default class BaseModel extends AbstractModel {
  position?: number;
  username: string = '';
  access_id: string = '';
  guid: string = '';
  owner_guid?: string;
  ownerObj!: UserModel;
  mature: boolean = false;
  pending?: '0' | '1';
  time_created!: string;
  urn: string = '';
  wire_totals?: {
    [name: string]: number;
  };

  // TODO remove this and fix model.listRef logic
  // listRef?: any;

  /**
   * Event emitter
   */
  static events = new EventEmitter();

  /**
   * Enable/Disable comments
   */
  @observable allow_comments = true;

  /**
   * Entity permissions
   */
  @observable.ref permissions: any = {};

  /**
   * List reference (if the entity belongs to one)
   * @var {OffsetListStore}
   */
  __list: FeedStore | null = null;

  /**
   * Whether this model is collapsed in the feed
   * @var {OffsetListStore}
   */
  @observable _collapsed: boolean = false;

  /**
   *  List reference setter
   */
  set _list(value) {
    this.__list = value;
  }

  /**
   *  List reference getter
   */
  get _list(): FeedStore | null {
    return this.__list;
  }

  @action
  removeFromList() {
    if (this._list) {
      this._list!.remove(this);
    }
  }

  /**
   * Return a plain JS obj without observables
   */
  toPlainObject() {
    const plainEntity = toJS(this);

    // remove references to the list
    //@ts-ignore
    delete plainEntity.__list;
    //@ts-ignore
    delete plainEntity.listRef;

    return plainEntity;
  }

  /**
   * Json converter
   *
   * Convert to plain obj and remove the list reference
   * to avoid circular reference errors
   */
  toJSON() {
    return this.toPlainObject();
  }

  /**
   * Return if the current user is the owner of the activity
   */
  isOwner = () => {
    return this.ownerObj
      ? sessionService.guid === this.ownerObj.guid
      : this.owner_guid === sessionService.guid;
  };

  /**
   * Update model data
   * @param {Object} data
   */
  @action
  update(data) {
    const childs = this.childModels();

    Object.getOwnPropertyNames(data).forEach(key => {
      if (childs[key] && data[key]) {
        // if the child model exist we update the data or we create it otherwise
        if (this[key] && this[key].update) {
          this[key].update(data[key]);
        } else {
          this[key] = childs[key].create(data[key]);
        }
      } else {
        // we assign the property
        this[key] = data[key];
      }
    });
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
      this['thumbs:up:user_guids'] &&
      this['thumbs:up:user_guids'].length &&
      this['thumbs:up:user_guids'].indexOf(sessionService.guid) >= 0
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
      this['thumbs:down:user_guids'] &&
      this['thumbs:down:user_guids'].length &&
      this['thumbs:down:user_guids'].indexOf(sessionService.guid) >= 0
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
  async toggleVote(direction: 'up' | 'down') {
    const voted = direction === 'up' ? this.votedUp : this.votedDown;
    const delta = voted ? -1 : 1;

    const guids = this['thumbs:' + direction + ':user_guids'] || [];

    if (voted) {
      this['thumbs:' + direction + ':user_guids'] = guids.filter(function (
        item,
      ) {
        return item !== sessionService.guid;
      });
    } else {
      this['thumbs:' + direction + ':user_guids'] = [
        sessionService.guid,
        ...guids,
      ];
    }

    this['thumbs:' + direction + ':count'] =
      parseInt(this['thumbs:' + direction + ':count'], 10) + delta;

    const params = this.getClientMetadata();

    try {
      await vote(this.guid, direction, params);
      if (direction === 'up') {
        storeRatingService.track('upvote', true);
      } else {
        storeRatingService.track('downvote');
      }
    } catch (err) {
      if (!voted) {
        this['thumbs:' + direction + ':user_guids'] = guids.filter(function (
          item,
        ) {
          return item !== sessionService.guid;
        });
      } else {
        this['thumbs:' + direction + ':user_guids'] = [
          sessionService.guid,
          ...guids,
        ];
      }
      this['thumbs:' + direction + ':count'] =
        parseInt(this['thumbs:' + direction + ':count'], 10) - delta;
      throw err;
    }
  }

  getClientMetadata() {
    return this._list?.metadataService?.getClientMetadata(this);
  }

  /**
   * Block owner
   */
  blockOwner() {
    if (!this.ownerObj) return;
    return this.ownerObj.toggleBlock(true);
  }

  /**
   * Unblock owner
   */
  unblockOwner() {
    if (!this.ownerObj) return;
    return this.ownerObj.toggleBlock(false);
  }

  @action
  async toggleExplicit() {
    let value = !this.mature;
    try {
      await toggleExplicit(this.guid, value);
      runInAction(() => {
        this.mature = value;
      });
    } catch (err) {
      runInAction(() => {
        this.mature = !value;
      });
      logService.exception('[BaseModel]', err);
      throw err;
    }
  }

  @action
  async toggleAllowComments() {
    await toggleAllow(this.guid, !this.allow_comments);
    runInAction(() => {
      this.allow_comments = !this.allow_comments;
    });
  }

  @action
  setPermissions(permissions) {
    this.permissions = permissions;
  }

  /**
   * Check if the current user can perform an action with the entity
   * @param {string} actionName
   * @param {boolean} showAlert Show an alert message if the action is not allowed
   * @returns {boolean}
   */
  can(actionName: string, _showAlert = false) {
    // TODO: implement permission check for each action
    // show a toaster notification if showAlert is true

    return true;
  }

  /**
   * Is scheduled?
   */
  isScheduled(): boolean {
    return parseInt(this.time_created, 10) * 1000 > Date.now() + 15000;
  }

  /**
   * Check if awaiting for moderation
   */
  isPending() {
    return this.pending && this.pending !== '0'; // asking like this because front does the same
  }

  /**
   * Report viewed content
   */
  sendViewed(medium?: MetadataMedium, position?: number) {
    if (this._list) {
      this._list.trackView?.(this, medium, position);
    } else {
      const metadata = new MetadataService();
      metadata.setMedium('single').setSource('single');
      recordView(this, metadata.getClientMetadata(this, medium, position));
    }
  }

  /**
   * Static isScheduled
   */
  static isScheduled(timeCreatedValue: string | Date | number) {
    let response = false;

    if (timeCreatedValue) {
      timeCreatedValue = new Date(timeCreatedValue);
      response = timeCreatedValue.getTime() > Date.now();
    }

    return response;
  }

  /**
   * Get modal class as string
   */
  getType() {
    return this.constructor.name;
  }

  /**
   * Verify if it is an instance of the class name
   * Be advised that this method doesn't check the class inheritance!!!
   * It is used to avoid some circular dependencies
   */
  instanceOf(name) {
    return name === this.getType();
  }
}
