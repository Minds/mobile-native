//@ts-nocheck
import {
  observable,
  action,
  reaction,
  runInAction,
  extendObservable,
} from 'mobx';

import SettingsService from '../../settings/SettingsApiService';

/**
 * Newsfeed Filter Store
 */
export default class NewsfeedFilterStore {
  @observable searchtext = '';
  // @observable filter     = 'hot';
  // @observable type       = 'images';
  // @observable period     = '12h';
  // @observable nsfw       = [];

  defaultFilter;
  defaultType;
  defaultPeriod;
  defaultNsfw;

  /**
   * Constructor
   * @param {string} defaultType
   */
  constructor(defaultFilter, defaultType, defaultPeriod, defaultNsfw) {
    this.defaultFilter = defaultFilter;
    this.defaultType = defaultType;
    this.defaultPeriod = defaultPeriod;
    this.defaultNsfw = SettingsService.consumerNsfw;

    extendObservable(this, {
      filter: defaultFilter,
      type: defaultType,
      period: defaultPeriod,
      nsfw: SettingsService.consumerNsfw,
    });
  }

  /**
   * Clear the store to the default values
   */
  @action
  clear() {
    this.filter = this.defaultFilter;
    this.type = this.defaultType;
    this.period = this.defaultPeriod;
    this.nsfw = this.defaultNsfw;
  }

  /**
   * Set type and refresh list
   * @param {string} type
   */
  @action
  setType(type) {
    if (type == this.type) return;

    this.type = type;
    if ((type === 'channels' || type === 'groups') && this.filter !== 'top') {
      this.setFilter('top');
    }
  }

  /**
   * Set filter
   * @param {string} filter
   */
  @action
  setFilter(filter) {
    this.filter = filter;
  }

  /**
   * Set period
   * @param {string} period
   */
  @action
  setPeriod(period) {
    this.period = period;
  }

  /**
   *
   * @param {number[]} nsfw
   */
  setNsfw(nsfw) {
    this.nsfw = nsfw;
    SettingsService.setConsumerNsfw(nsfw);
  }

  /**
   * search
   * @param {string} text
   */
  @action
  search(text) {
    this.searchtext = text.trim();
  }

  /**
   * On filter change
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onFilterChange(fn) {
    return reaction(
      () => [this.filter, this.type, this.period, this.nsfw],
      args => fn(...args),
      { fireImmediately: false },
    );
  }

  /**
   * On filter change
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onSearchChange(fn) {
    return reaction(
      () => this.searchtext,
      q => fn(q),
      { fireImmediately: false },
    );
  }
}
