import api from './../common/services/api.service';
import { AbortController } from 'abortcontroller-polyfill/dist/cjs-ponyfill';

/**
 * Discovery Service
 */
class DiscoveryService {

  controllers = {
    search: null,
    getFeed: null
  };

  async search({ offset, type, filter, q }) {
    if (this.controllers.search)
      this.controllers.search.abort();

    this.controllers.search = new AbortController();

    let endpoint = 'api/v2/search',
      params = {
        q,
        limit: 12,
        offset
      };

    switch (type) {
      case 'user':
        endpoint = 'api/v2/search/suggest/user';
        params.hydrate = 1;
        break;

      default:
        params.taxonomies = [ type ];
        break;
    }

    const response = (await api.get(endpoint, params, this.controllers.search.signal)) || {};

    return {
      entities: response.entities || [],
      offset: response['load-next'] || ''
    };
  }

  async getFeed(offset, type, filter, q) {
    if (this.controllers.getFeed)
      this.controllers.getFeed.abort();

    this.controllers.getFeed = new AbortController();

    let endpoint;
    // is search
    if (q) {
      return await this.search({ offset, type, filter, q });
    }

    if (type == 'group') {
      endpoint = '/api/v1/groups/featured';
    } else {
      endpoint = 'api/v1/entities/' + filter + '/' + type;
    }

    try { 
      const data = await api.get(endpoint, { limit: 12, offset: offset }, this.controllers.getFeed.signal)
      if (type == 'group' && offset && data.entities) {
        data.entities.shift();
      }
      return {
        entities: data.entities,
        offset: data['load-next'],
      }
    } catch(err) {
      console.log('error');
      throw "Ooops";
    }
  }

}

export default new DiscoveryService();
