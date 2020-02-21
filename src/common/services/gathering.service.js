import api from './../../common/services/api.service';
import { observable, action } from 'mobx';

/**
 * Gathering service
 */
class GatheringService {
  @observable inGatheringScreen = false;
  keepAliveInterval = null;

  get isActive() {
    return this.keepAliveInterval !== null;
  }

  @action
  setInGatheringScreen(value) {
    this.inGatheringScreen = value;
  }
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
    this.keepAliveInterval = null;
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
