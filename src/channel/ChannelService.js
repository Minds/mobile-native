import api from './../common/services/api.service';


/**
 * Channel Service
 */
class ChannelService {

  /**
   * Load Channel
   * @param {string} guid
   */
  load(guid) {
    return api.get('api/v1/channel/' + guid);
  }
}

export default new ChannelService();