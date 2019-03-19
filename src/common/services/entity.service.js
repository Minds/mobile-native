import api from './api.service';

class EntitiesService {
  /**
   * Get entity
   * @param {guid} string
   */
  getEntity(guid) {
    return api.get('api/v1/entities/entity/' + guid )
      .then((data) => {
        return data.entity;
      })
      .catch(err => {
        console.log('error', err);
        throw "Oops, an error has occured getting this entity";
      });
  }

}

export default new EntitiesService();
