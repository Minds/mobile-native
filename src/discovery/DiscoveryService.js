import api from './../common/services/api.service';

/**
 * Discovery Service
 */
class DiscoveryService {

  async getFeed(offset, type, filter, q) {

    // is search
    if (q) {
      let endpoint;
      switch (type) {
        case 'activity':
          endpoint = 'api/v1/search';
          break;
        case 'user':
          endpoint = 'api/v1/search/suggest';
          break;
      }
      return api.get(endpoint, {
          q: q,
          type: type == 'activity' ? 'activities' : type,
          limit: 12,
          offset: ''
        })
        .then((response) => {
          const rtn = { offset: response['load-next'] || '' };
          if (type == 'activity') {
            rtn.entities = response.entities;
          } else {
            rtn.entities = response.suggestions;
          }
          return rtn;
        });
    }

    return api.get('api/v1/entities/' + filter + '/' + type, { limit: 12, offset: offset })
      .then((data) => {
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