import api from './../common/services/api.service';

/**
 * Discovery Service
 */
class DiscoveryService {

  controller = null

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

    const response = (await api.get(endpoint, params, this.controller.signal)) || {};

    return {
      entities: response.entities || [],
      offset: response['load-next'] || ''
    };
  }

  async getFeed(offset, type, filter, q) {
    if (this.controller)
      this.controller.abort();

    this.controller = new AbortController();

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

    try {
      const data = await api.get(endpoint, { limit: 12, offset: offset })
      let entities = [];
      entities = data.entities;

      if (type == 'group' && offset && entities) {
        entities.shift();
      }
      return {
        entities: entities,
        offset: data['load-next'],
      }
    } catch(err) {
      console.log('error');
      throw "Ooops";
    }
  }

}

export default new DiscoveryService();
