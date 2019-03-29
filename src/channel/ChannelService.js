import api from './../common/services/api.service';
import { abort } from '../common/helpers/abortableFetch';
import blockListService from '../common/services/block-list.service';

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
   */
  toggleSubscription(guid, value) {
    if (value) {
      return api.post('api/v1/subscribe/' + guid);
    } else {
      return api.delete('api/v1/subscribe/' + guid);
    }
  }

  /**
   * Block to Channel
   * @param {string} guid
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
   *
   * @param {string} guid
   * @param {object} opts
   */
  async getFeed(guid, opts = {limit: 12}) {
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

  getImageFeed(guid, offset) {
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
        console.log('error');
        throw "Oops, an error has occurred getting this image feed";
      })
  }

  getVideoFeed(guid, offset) {
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
        console.log('error');
        throw "Oops, an error has occurred getting this video feed";
      })
  }

  getBlogFeed(guid, offset) {
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
        console.log('error');
        throw "Oops, an error has occurred getting this blog feed.";
      })
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
        console.log('error');
        throw "Oops, an error has occurred getting subscribers";
      })
  }
}

export default new ChannelService();
