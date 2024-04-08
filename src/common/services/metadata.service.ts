import moment from 'moment';
import sessionService from './session.service';
import hashCode from '../helpers/hash-code';
import NavigationService from '../../navigation/NavigationService';

export type MetadataSource =
  | 'feed/discovery/search'
  | 'feed/subscribed'
  | 'feed/channel'
  | 'feed/highlights'
  | 'feed/groups'
  | 'top-feed/groups'
  | 'feed/discovery'
  | 'feed/boosts'
  | 'search/latest'
  | 'search/top'
  | 'search/channels'
  | 'search/groups'
  | 'single'
  | 'portrait'
  | 'boost-rotator'
  | 'top-feed';

export type MetadataMedium =
  | 'feed'
  | 'portrait'
  | 'featured-content'
  | 'single';

export type MetadataCampaign = string;

export interface Metadata {
  /**
   * The platform that the action occured on
   */
  platform?: 'mobile';
  /**
   * A short token that represents the page group the action was performed from
   */
  source: MetadataSource;
  /**
   * In seconds, the timestamp representing the date the action took place
   */
  timestamp?: number;
  salt?: string;
  /**
   * The type of page the action was recorded on
   */
  medium: MetadataMedium;
  /**
   * The campaign, if any, that the entity was attached to
   */
  campaign?: MetadataCampaign;
  page_token?: string;
  /**
   * In seconds, how long the page has been active since this action was recorded
   */
  delta?: number;
  /**
   * The position in the feed that this view was recorded
   */
  position: number;
  /**
   * Used for boost partners: the guid of the channel that this boost was shown on, if any
   */
  served_by_guid?: string;
}

/**
 * Metadata service for analytics
 */
class MetadataService {
  private source: MetadataSource = 'feed/subscribed';
  private medium: MetadataMedium = 'feed';
  private campaign?: MetadataCampaign;
  private salt;

  /**
   * @var {moment} deltaBegin
   */
  private deltaBegin = moment();

  /**
   * Constructor
   */
  init() {
    sessionService.onLogin(() => {
      this.initDelta();
    });
  }

  /**
   * Set source
   * @param {String} source
   */
  setSource(source: MetadataSource) {
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
  setMedium(medium: MetadataMedium) {
    this.medium = medium;
    return this;
  }

  /**
   * Set campaign
   * @param {String} campaign
   */
  setCampaign(campaign: MetadataCampaign) {
    this.campaign = campaign;
    return this;
  }

  /**
   * Init delta timer
   */
  private initDelta() {
    this.deltaBegin = moment();
  }

  /**
   * Get delta in seconds
   * @returns {integer} seconds
   */
  private getDelta(medium) {
    if (this.medium || medium === 'single') {
      return 0;
    }
    const deltaEnd = moment();
    const delta = moment.duration(deltaEnd.diff(this.deltaBegin));
    return delta.seconds();
  }

  /**
   * Build the page token
   */
  private buildPageToken() {
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
  private getCurrentRoute() {
    const state = NavigationService.getCurrentState();
    if (state.routeName === 'Tabs') {
      return state.routes[state.index].routeName;
    }

    return state.routeName;
  }

  /**
   * Get the metadata for the entity
   * @param {BaseModel} entity
   */
  getClientMetadata(
    entity,
    medium?: MetadataMedium,
    position?: number,
  ): Metadata {
    const listPosition = entity._list
      ? entity._list.getIndex(entity) + 1
      : undefined;

    return {
      platform: 'mobile',
      page_token: this.buildPageToken(),
      delta: this.getDelta(medium || this.medium),
      source: this.source,
      position: position ?? entity.position ?? listPosition ?? 0,
      medium: medium || (entity.boosted ? 'featured-content' : this.medium),
      campaign: entity.boosted_guid ? entity.urn : this.campaign,
      served_by_guid: entity?.ownerObj?.guid,
    };
  }
}

export default MetadataService;
