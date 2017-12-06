import api from './../common/services/api.service';


class DiscoveryService {

  async getFeed(offset) {
    return api.get('api/v1/entities/featured/images/', { limit: 15, offset: offset })
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
}

export default new DiscoveryService();