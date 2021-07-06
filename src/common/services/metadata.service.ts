import moment from 'moment';
import sessionService from './session.service';
import hashCode from '../helpers/hash-code';
import NavigationService from '../../navigation/NavigationService';

/**
 * Metadata service for analytics
 */
class MetadataService {
  /**
   * @var source
   */
  source = 'feed/subscribed';

  /**
   * @var medium
   */
  medium = 'feed';

  /**
   * @var campaign
   */
  campaign = '';

  /**
   * @var {moment} deltaBegin
   */
  deltaBegin = moment();

  /**
   * @var salt
   */
  salt = '';

  /**
   * Constructor
   */
  constructor() {
    sessionService.onLogin(() => {
      this.initDelta();
    });
  }

  /**
   * @var {function} entityMapper maps entities properties to metadata
   */
  entityMapper = (entity, medium, position) => ({
    position: position
      ? position
      : entity.position !== undefined
      ? entity.position
      : entity._list
      ? entity._list.getIndex(entity) + 1
      : 0,
    medium: medium ? medium : entity.boosted ? 'featured-content' : 'feed',
    campaign: entity.boosted_guid ? entity.urn : '',
  });

  /**
   * Init delta timer
   */
  initDelta() {
    this.deltaBegin = moment();
  }

  /**
   * Get delta in seconds
   * @returns {integer} seconds
   */
  getDelta(medium) {
    if (this.medium || medium === 'single') {
      return 0;
    }
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
    this.salt = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '');
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
  dto(overrides, medium?: string) {
    return {
      client_meta: this.build(overrides, medium),
    };
  }

  /**
   * Get the metadata for the entity
   * @param {BaseModel} entity
   */
  getEntityMeta(entity, medium?: string, position?: number) {
    const overrides = this.entityMapper(entity, medium, position);
    return this.dto(overrides, medium);
  }

  /**
   * Build metadata
   * @param {Object} overrides
   */
  private build(overrides = {}, medium?: string) {
    return {
      platform: 'mobile',
      page_token: this.buildPageToken(),
      delta: this.getDelta(medium),
      source: this.source,
      medium: this.medium,
      campaign: this.campaign,
      ...overrides,
    };
  }
}

export default MetadataService;
