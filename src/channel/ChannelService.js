import api from './../common/services/api.service';
import { abort } from '../common/helpers/abortableFetch';
import blockListService from '../common/services/block-list.service';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';

/**
 * Channel Service
 */
class ChannelService {

  /**
   * Load Channel
   * @param {string} guid
   */
  async load(guid) {
    return await api.get('api/v1/channel/' + guid);
  }

  upload(guid, type, file, progress) {
    return api.upload(`api/v1/channel/${type}`, file, null, progress);
  }

  save(data) {
    return api.post(`api/v1/channel/info`, data);
  }

  /**
   * Subscribe to Channel
   * @param {string} guid
   * @param {boolean} value
   * @param {Object} data
   */
  toggleSubscription(guid, value, data = {}) {
    if (value) {
      return api.post('api/v1/subscribe/' + guid, data);
    } else {
      return api.delete('api/v1/subscribe/' + guid, data);
    }
  }

  /**
   * Block to Channel
   * @param {string} guid
   * @param {boolean} value
   */
  toggleBlock(guid, value) {
    let result;

    if (value) {
      result = api.put('api/v1/block/' + guid);
      blockListService.add(guid);
    } else {
      result = api.delete('api/v1/block/' + guid);
      blockListService.remove(guid);
    }

    return result;
  }

  /**
   * Toogle Channel Open/Closed
   * @param {string} guid
   * @param {boolean} value
   */
  toggleOpen(guid, open) {
    return api.post(`/api/v2/permissions/channels/${guid}`, {open});
  }

  async getFeedFromService(guid, type, opts = { limit: 12 }) {
    const limit = opts.limit || 12;

    // const { entities, next } = await feedService.get({
    //   endpoint: `api/v2/feeds/container/${guid}/${type}`,
    //   timebased: true,
    //   limit,
    //   offset: opts.offset || 0,
    //   syncPageSize: limit * 20,
    // });

    return {
      entities: entities || [],
      offset: entities && entities.length ? next : '',
    }
  }

  async getFeed(guid, opts = { limit: 12 }) {
    const tag = `channel:feed:${guid}`;
    // abort previous call
    abort(tag);

    const data = await api.get(`api/v1/newsfeed/personal/${guid}`, opts, tag);

    const feed = {
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
    // abort previous call
    abort(tag);

    return api.get('api/v1/entities/owner/image/' + guid, { offset: offset, limit: 12 }, tag)
    .then((data) => {
      return {
        entities: data.entities,
        offset: data['load-next'],
        }
      })
      .catch(err => {
        logService.exception('[ChannelService]', err);
        throw new Error (i18n.t('errorMessage'));
      });
  }

  async getVideoFeed(guid, offset) {
    const tag = `channel:images:${guid}`;
    // abort previous call
    abort(tag);

    return api.get('api/v1/entities/owner/video/' + guid, { offset: offset, limit: 12 }, tag)
    .then((data) => {
      return {
        entities: data.entities,
        offset: data['load-next'],
        }
      })
      .catch(err => {
        logService.exception('[ChannelService]', err);
        throw new Error (i18n.t('errorMessage'));
      })
  }

  async getBlogFeed(guid, offset) {
    const tag = `channel:blog:${guid}`;
    // abort previous call
    abort(tag);

    return api.get('api/v1/blog/owner/' + guid, { offset: offset, limit: 12 }, tag)
    .then((data) => {
      return {
        entities: data.entities,
        offset: data['load-next'],
        }
      })
      .catch(err => {
        logService.exception('[ChannelService]', err);
        throw new Error (i18n.t('errorMessage'));
      });
  }

  getSubscribers(guid, filter, offset) {
    const tag = `channel:subscribers:${guid}`;
    // abort previous call
    abort(tag);

    return api.get('api/v1/subscribe/' + filter + '/' + guid, { offset: offset, limit: 12 }, tag)
    .then((data) => {
      return {
        entities: data.users,
        offset: data['load-next'],
        }
      })
      .catch(err => {
        logService.exception('[ChannelService]', err);
        throw new Error (i18n.t('errorMessage'));
      })
  }
}

export default new ChannelService();
