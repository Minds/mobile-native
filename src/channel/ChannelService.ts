import type { ApiService } from '~/common/services/api.service';
import type { BlockListService } from '~/common/services/block-list.service';
import { I18nService } from '~/common/services/i18n.service';
import type { LogService } from '~/common/services/log.service';

/**
 * Channel Service
 */
export class ChannelService {
  constructor(
    private api: ApiService,
    private blockListService: BlockListService,
    private log: LogService,
    private i18n: I18nService,
  ) {}

  /**
   * Load Channel
   * @param {string} guid
   */
  async load(guid) {
    return await this.api.get('api/v1/channel/' + guid);
  }

  upload(type, file, progress) {
    return this.api.upload(`api/v1/channel/${type}`, { file }, null, progress);
  }

  save(data) {
    return this.api.post(`api/v1/channel/info`, data);
  }

  /**
   * Subscribe to Channel
   * @param {string} guid
   * @param {boolean} value
   * @param {Object} data
   */
  toggleSubscription(guid, value, data = {}) {
    if (value) {
      return this.api.post('api/v1/subscribe/' + guid, data);
    } else {
      return this.api.delete('api/v1/subscribe/' + guid, data);
    }
  }

  /**
   * Block to Channel
   * @param {string} guid
   */
  toggleBlock(guid, value) {
    let result;

    if (value) {
      result = this.api.put('api/v1/block/' + guid);
      this.blockListService.add(guid);
    } else {
      result = this.api.delete('api/v1/block/' + guid);
      this.blockListService.remove(guid);
    }

    return result;
  }

  async getFeed(guid, opts = { limit: 12 }) {
    const tag = `channel:feed:${guid}`;

    const data = await this.api.get<{
      pinned: any[];
      activity: any[];
      'load-next': string;
    }>(`api/v1/newsfeed/personal/${guid}`, opts, tag);

    const feed: {
      entities: any[];
      offset: string;
    } = {
      entities: [],
      offset: data['load-next'],
    };

    if (data.pinned) {
      feed.entities = data.pinned;
    }

    if (data.activity) {
      feed.entities = feed.entities.concat(data.activity);
    }

    return feed;
  }

  async getImageFeed(guid, offset) {
    const tag = `channel:images:${guid}`;

    return this.api
      .get<{
        entities: any[];
        'load-next': string;
      }>(
        'api/v1/entities/owner/image/' + guid,
        { offset: offset, limit: 12 },
        tag,
      )
      .then(data => {
        return {
          entities: data.entities,
          offset: data['load-next'],
        };
      })
      .catch(err => {
        this.log.exception('[ChannelService]', err);
        throw new Error(this.i18n.t('errorMessage'));
      });
  }

  async getVideoFeed(guid, offset) {
    const tag = `channel:images:${guid}`;

    return this.api
      .get<{
        entities: any[];
        'load-next': string;
      }>(
        'api/v1/entities/owner/video/' + guid,
        { offset: offset, limit: 12 },
        tag,
      )
      .then(data => {
        return {
          entities: data.entities,
          offset: data['load-next'],
        };
      })
      .catch(err => {
        this.log.exception('[ChannelService]', err);
        throw new Error(this.i18n.t('errorMessage'));
      });
  }

  async getBlogFeed(guid, offset) {
    const tag = `channel:blog:${guid}`;

    return this.api
      .get<{
        entities: any[];
        'load-next': string;
      }>('api/v1/blog/owner/' + guid, { offset: offset, limit: 12 }, tag)
      .then(data => {
        return {
          entities: data.entities,
          offset: data['load-next'],
        };
      })
      .catch(err => {
        this.log.exception('[ChannelService]', err);
        throw new Error(this.i18n.t('errorMessage'));
      });
  }

  /**
   * Get subscribers
   * @param {string} guid
   * @param {string} filter
   * @param {string} offset
   */
  async getSubscribers(guid, filter, offset) {
    const data = await this.api.get<{
      users: any[];
      'load-next': string;
    }>('api/v1/subscribe/' + filter + '/' + guid, {
      offset: offset,
      limit: 12,
    });

    return {
      entities: data.users,
      offset: data['load-next'],
    };
  }

  async getScheduledCount(guid) {
    const response = await this.api.get<{
      count: number;
    }>(`api/v2/feeds/scheduled/${guid}/count`);
    return response.count;
  }
}
