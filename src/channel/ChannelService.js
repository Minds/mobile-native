import api from './../common/services/api.service';


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
    if (value) {
      return api.put('api/v1/block/' + guid);
    } else {
      return api.delete('api/v1/block/' + guid);
    }
  }

  /**
   *
   * @param {string} guid
   * @param {object} opts
   */
  async getFeed(guid, opts={limit: 12}) {
    const data = await api.get(`api/v1/newsfeed/personal/${guid}`, opts);

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
    return api.get('api/v1/entities/owner/image/' + guid, { offset: offset, limit: 12 })
    .then((data) => {
      return {
        entities: data.entities,
        offset: data['load-next'],
        }
      })
      .catch(err => {
        console.log('error');
        throw "Ooops";
      })
  }

  getVideoFeed(guid, offset) {
    return api.get('api/v1/entities/owner/video/' + guid, { offset: offset, limit: 12 })
    .then((data) => {
      return {
        entities: data.entities,
        offset: data['load-next'],
        }
      })
      .catch(err => {
        console.log('error');
        throw "Ooops";
      })
  }

  getBlogFeed(guid, offset) {
    return api.get('api/v1/blog/owner/' + guid, { offset: offset, limit: 12 })
    .then((data) => {
      return {
        entities: data.entities,
        offset: data['load-next'],
        }
      })
      .catch(err => {
        console.log('error');
        throw "Ooops";
      })
  }

  getSubscribers(guid, filter, offset, signal) {
    return api.get('api/v1/subscribe/' + filter + '/' + guid, { offset: offset, limit: 12 }, signal)
    .then((data) => {
      return {
        entities: data.users,
        offset: data['load-next'],
        }
      })
      .catch(err => {
        console.log('error');
        throw "Ooops";
      })
  }
}

export default new ChannelService();
