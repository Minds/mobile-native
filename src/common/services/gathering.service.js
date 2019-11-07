import api from './../../common/services/api.service';

/**
 * Gathering service
 */
class GatheringService {
  /**
   * Start keep alive pooling
   */
  startKeepAlive() {
    this.keepAliveInterval = setInterval(this.keepAlive, 5000);
  }

  /**
   * Stop keep alive
   */
  stopKeepAlive() {
    clearInterval(this.keepAliveInterval);
  }

  /**
   * Keep alive
   */
  keepAlive = async () => {
    api.put(`api/v2/notifications/markers/heartbeat/${this.entity.guid}`);
  };

  /**
   * Get room name for group
   * @param {objecy} entity
   */
  async getRoomName(entity) {
    const response = await api.get(`api/v2/video/room/${entity.guid}`);
    this.entity = entity;
    return response.room;
  }
}

export default new GatheringService();
