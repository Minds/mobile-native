import api from './../common/services/api.service';

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
      case 'user':
        endpoint = 'api/v2/search/suggest/user';
        params.hydrate = 1;
        break;

      default:
        params.taxonomies = [ type ];
        break;
    }

    const response = (await api.get(endpoint, params)) || {};

    return {
      entities: response.entities || [],
      offset: response['load-next'] || ''
    };
  }

  async getFeed(offset, type, filter, q) {
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

    return api.get(endpoint, { limit: 12, offset: offset })
    .then((data) => {
        if (type == 'group' && offset && data.entities) {
          data.entities.shift();
        }
        return {
          entities: data.entities,
          offset: data['load-next'],
        }
      })
      .catch(err => {
        console.log('error');
        throw "Ooops";
      });
  }
}

export default new DiscoveryService();
