import { 
  extendShallowObservable, 
  extendObservable,
  action,
  computed,
} from 'mobx';
import _ from 'lodash';
import sessionService from './services/session.service';
import { vote } from './services/votes.service'; 

/**
 * Base model
 */
export default class BaseModel {

  /**
   * Child models classes
   */
  childModels() {
    return {}
  }

  /**
   * Observable properties
   */
  static observables = [];

  /**
   * Observable by reference properties
   */
  static observablesRef = [];

  /**
   * Shallow observable properties
   */
  static observablesShallow = [];

  /**
   * Constructor
   */
  constructor(data) {
    Object.assign(this, data);

    // observables
    this.constructor.createObservables(this);

    // shallow observables
    this.constructor.createShallowObservables(this);

    // create childs instances
    const childs = this.childModels()
    for (var prop in childs) {
      if (this[prop]) {
        this[prop] = childs[prop].create(this[prop]);
      }
    }
  }

  /**
   * Create shallow observables
   * @param {object} t base model instance
   */
  static createShallowObservables(t) {
    return ;
    if (!this.observablesShallow.length) return;
    const obs = this.parseObj(this.observablesShallow, t);
    extendShallowObservable(t, obs);
  }

  /**
   * Create observables
   * @param {object} t base model instance
   */
  static createObservables(t) {
    return;
    if (!this.observables.length) return;
    const obs = this.parseObj(this.observables, t);
    extendObservable(t, obs);
  }

  /**
   * Return the properties that will be converted to observables
   * @param {array} observables
   * @param {object} t base model instance
   */
  static parseObj(observables, t) {
    const obs = {}
    observables.forEach(prop => {
      if (t.hasOwnProperty(prop)) obs[prop] = t[prop];
    });
    return obs;
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

    const guids = this['thumbs:' + direction + ':user_guids'];

    if (voted) {
      this['thumbs:' + direction + ':user_guids'] = guids.filter(function (item) {
        return item !== sessionService.guid;
      });
    } else {
      this['thumbs:' + direction + ':user_guids'] = [sessionService.guid, ...guids];
    }

    this['thumbs:' + direction + ':count'] += delta;

    // class service
    try {
      await vote(this.guid, direction)
    } catch (err) {
      alert(err);
      if (!voted) {
        this['thumbs:' + direction + ':user_guids'] = guids.filter(function (item) {
          return item !== sessionService.guid;
        });
      } else {
        this['thumbs:' + direction + ':user_guids'] = [sessionService.guid, ...guids];
      }
      this['thumbs:' + direction + ':count'] -= delta;
    }
  }

}