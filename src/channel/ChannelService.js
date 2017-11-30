import api from './../common/services/api.service';


/**
 * Channel Service
 */
class MessengerService {

  /**
   * Load Channel
   * @param {string} guid
   */
  load(guid) {
    return api.get('api/v1/channel/' + guid);
  }
}

export default new MessengerService();