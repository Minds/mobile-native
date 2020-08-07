//@ts-nocheck
import api from './api.service';
import logService from './log.service';
import i18n from './i18n.service';

class EntitiesService {
  /**
   * Get entity
   * @param {guid} string
   */
  getEntity(guid) {
    return api
      .get('api/v1/entities/entity/' + guid)
      .then((data) => {
        return data.entity;
      })
      .catch((err) => {
        logService.exception('[EntitiesService]', err);
      });
  }
}

export default new EntitiesService();
