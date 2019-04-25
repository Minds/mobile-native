import api from './api.service';
import logService from './log.service';

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
        logService.exception('[EntitiesService]', err);
        throw "Oops, an error has occured getting this entity";
      });
  }

}

export default new EntitiesService();
