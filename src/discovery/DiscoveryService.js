import api from './../common/services/api.service';
import { abort } from '../common/helpers/abortableFetch';

/**
 * Discovery Service
 */
class DiscoveryService {

  async search({ offset, type, filter, q }) {

    let endpoint = 'api/v2/search',
      params = {
        q,
        limit: 12,
        offset
      };

    switch (type) {
      case 'channels':
        endpoint = 'api/v2/search/suggest/user';
        params.hydrate = 1;
        break;

      default:
        params.taxonomies = [ type ];
        break;
    }

    abort('discovery:search');

    const response = (await api.get(endpoint, params, 'discovery:search')) || {};

    return {
      entities: response.entities || [],
      offset: response['load-next'] || ''
    };
  }

  async getFeed(offset, type, filter, q) {

    // abort previous call
    abort(this);

    let endpoint;
    // is search
    if (q) {
      return this.search({ offset, type, filter, q });
    }

    if (type == 'group') {
      endpoint = 'api/v1/entities/trending/groups';
    } else {
      endpoint = `api/v2/entities/${filter}/${type}/all`;
    }

    const data = await api.get(endpoint, { limit: 12, offset: offset }, this);
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

}

export default new DiscoveryService();
