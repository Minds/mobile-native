import api from './../common/services/api.service';
import { abort } from '../common/helpers/abortableFetch';
import appStores from '../../AppStores';

/**
 * Discovery Service
 */
class DiscoveryService {

  cancelRequest() {
    abort(this);
  }

  async search({ offset, type, filter, q }) {

    let endpoint = 'api/v2/search',
      params = {
        q,
        limit: 12,
        offset
      };

    switch (type) {
      case 'images':
        params.taxonomies = 'object:image';
        break;
      case 'videos':
        params.taxonomies = 'object:video';
        break;
      case 'blogs':
        params.taxonomies = 'object:blog';
        params.rating=2;
        break;
      case 'groups':
        params.taxonomies = 'group';
        break;
      case 'channels':
        endpoint = 'api/v2/search/suggest/user';
        params.hydrate = 1;
        break;

      default:
        params.taxonomies = [ type ];
        break;
    }

    abort(this);

    const response = (await api.get(endpoint, params, this)) || {};

    return {
      entities: response.entities || [],
      offset: response['load-next'] || ''
    };
  }

  async getFeed(offset, type, filter, q, limit = 12) {

    // abort previous call
    abort(this);

    // is search
    if (q) {
      return await this.search({ offset, type, filter, q });
    }

    const all = appStores.hashtag.all ? '/all' : '';

    const endpoint = `api/v2/entities/suggested/${type}${all}`;

    const data = await api.get(endpoint, { limit, offset }, this);
    let entities = [];
    entities = data.entities;

    if (type == 'group' && offset && entities) {
      entities.shift();
    }
    return {
      entities: entities,
      offset: data['load-next'],
    }
  }

  async getTopFeed(offset, type, filter, period, query, limit = 12) {

    // abort previous call
    abort(this);

    const all = appStores.hashtag.all ? '1' : '';

    const params = {
      limit,
      offset,
      all,
      period
    };

    // is search
    if (query) {
      params.query = query;
    }

    if (appStores.hashtag.hashtag) {
      params.hashtag = appStores.hashtag.hashtag;
    }

    const endpoint = `api/v2/feeds/global/${filter}/${type}`;

    const data = await api.get(endpoint, params, this);
    let entities = data.entities;

    if (type == 'group' && offset && entities) {
      entities.shift();
    }
    return {
      entities: entities,
      offset: entities.length ? data['load-next'] : '',
    }
  }

}

export default new DiscoveryService();
