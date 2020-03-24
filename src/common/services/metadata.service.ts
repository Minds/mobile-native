import moment from 'moment';
import sessionService from './session.service';
import hashCode from '../helpers/hash-code';
import NavigationService from '../../navigation/NavigationService';

/**
 * Metadata service for analytics
 */
class MetadataService {
  /**
   * @var {String} source
   */
  _source = ['feed/subscribed'];

  /**
   * @var {String} medium
   */
  medium = 'feed';

  /**
   * @var {String} campaign
   */
  campaign = '';

  /**
   * @var {moment} deltaBegin
   */
  deltaBegin = null;

  /**
   * @var {String} salt
   */
  salt = null;

  /**
   * Source getter
   */
  get source() {
    return this._source[this._source.length - 1];
  }

  /**
   * Source setter
   */
  set source(value) {
    this._source[this._source.length - 1] = value;
  }

  /**
   * Push source
   * @param {String} value
   */
  pushSource(value) {
    this._source.push(value);
  }

  /**
   * Pop source
   * @returns {String}
   */
  popSource() {
    return this._source.pop();
  }

  /**
   * Cosntructor
   */
  constructor() {
    sessionService.onLogin(() => {
      this.initDelta();
    });
  }

  /**
   * @var {function} entityMapper maps entities properties to metadata
   */
  entityMapper = (entity) => ({
    position: entity._list ? entity._list.getIndex(entity) + 1 : 0,
    medium: entity.boosted ? 'featured-content' : 'feed',
    campaign: entity.boosted_guid ? entity.urn : ''
  })

  /**
   * Init delta timer
   */
  initDelta() {
    this.deltaBegin = moment();
  }

  /**
   * Set the entities mapper function
   * @param {Function} fn
   */
  setEntityMapper(fn) {
    this.entityMapper = fn;
    return this;
  }

  /**
   * Get delta in seconds
   * @returns {integer} seconds
   */
  getDelta() {
    const deltaEnd = moment();
    const delta = moment.duration(deltaEnd.diff(this.deltaBegin));
    return delta.seconds();
  }

  /**
   * Set source
   * @param {String} source
   */
  setSource(source) {
    this.source = source;
    this.salt = (Math.random()).toString(36).replace(/[^a-z]+/g, '');
    return this;
  }

  /**
   * Set medium
   * @param {String} medium
   */
  setMedium(medium) {
    this.medium = medium;
    return this;
  }

  /**
   * Set campaign
   * @param {String} campaign
   */
  setCampaign(campaign) {
    this.campaign = campaign;
    return this;
  }

  setPosition(position) {
    this.position = position;
    return this;
  }

  /**
   * Build the page token
   */
  buildPageToken() {
    const user = sessionService.getUser();

    const tokenParts = [
      this.salt, // NOTE: Salt + hash so individual user activity can't be tracked
      this.getCurrentRoute(),
      user.guid || '000000000000000000',
      this.deltaBegin.format('X') || '',
    ];

    return hashCode(tokenParts.join(':'), 5);
  }

  /**
   * Get current visible route
   */
  getCurrentRoute() {
    const state = NavigationService.getCurrentState();
    if (state.routeName === 'Tabs') {
      return state.routes[state.index].routeName;
    }

    return state.routeName;
  }

  /**
   * returns the client metadata
   * @param {Object|undefined} overrides
   */
  dto(overrides) {
    if (!this.deltaBegin) {
      // There's no client meta in this component branch.
      return {};
    }

    return {
      client_meta: this.build(overrides),
    };
  }

  /**
   * Get the metadata for the entity
   * @param {BaseModel} entity
   */
  getEntityMeta(entity) {
    const overrides = this.entityMapper(entity);
    return this.dto(overrides);
  }

  /**
   * Build metadata
   * @param {Object} overrides
   */
  build(overrides = {}) {

    return {
      platform: 'mobile',
      page_token: this.buildPageToken(),
      delta: this.getDelta(),
      source: this.source,
      medium: this.medium,
      campaign: this.campaign,
      position: this.position,
      ...overrides
    };
  }
}

export default MetadataService;
