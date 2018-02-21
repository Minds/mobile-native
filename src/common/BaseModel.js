import { extendShallowObservable, extendObservable } from 'mobx';
import _ from 'lodash';

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
    if (!this.observablesShallow.length) return;
    const obs = this.parseObj(this.observablesShallow, t);
    extendShallowObservable(t, obs);
  }

  /**
   * Create observables
   * @param {object} t base model instance
   */
  static createObservables(t) {
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
  get(property) {
    return _.get(this, property);
  }
}