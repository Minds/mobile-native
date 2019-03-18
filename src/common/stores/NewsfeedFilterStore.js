import {
  observable,
  action,
  reaction
} from 'mobx';

/**
 * Newsfeed Filter Store
 */
export default class NewsfeedFilterStore {
  @observable searchtext = '';
  @observable filter     = 'hot';
  @observable type       = 'images';
  @observable period     = '12h';

  defaultFilter;
  defaultType;
  defaultPeriod;

  /**
   * Constructor
   * @param {string} defaultType
   */
  constructor(defaultFilter, defaultType, defaultPeriod) {
    this.defaultFilter = defaultFilter;
    this.defaultType = defaultType;
    this.defaultPeriod = defaultPeriod;
    this.clear();
  }

  /**
   * Clear the store to the default values
   */
  @action
  clear() {
    this.filter = this.defaultFilter;
    this.type   = this.defaultType;
    this.period = this.defaultPeriod;
  }

  /**
   * Set type and refresh list
   * @param {string} type
   */
  @action
  setType(type) {
    if (type == this.type) return;
    this.type = type;
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
      () => [this.filter, this.type, this.period],
      args => fn(...args),
      { fireImmediately: false }
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
      { fireImmediately: false }
    );
  }
}