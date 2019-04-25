import api from './../../common/services/api.service';
import videochatService from './videochat.service';
import BackgroundTimer from 'react-native-background-timer';
import { Platform } from 'react-native';
import appStores from '../../../AppStores';
import { observable, action } from 'mobx';
import logService from './log.service';

/**
 * Gathering service
 */
class GatheringService {
  initialized = false;
  @observable isActive = false;
  keepAliveInterval;
  roomName = '';

  /**
   * Join group gathering
   * @param {object} entity Group entity
   */
  @action
  async join(entity) {
    if (this.isActive) {
      return;
    }
    try {
      // get room name
      this.roomName = await this.getRoomName(entity);
      // initilize jitsi
      this.initialize();
      // start keep alive
      this.startKeepAlive();

      setTimeout(() => {
        videochatService.call(this.roomName, appStores.user.me);
      }, 100);
    } catch (e) {
      logService.exception('[GatheringService]', e);
    }
  }

  /**
   * Initialize jitsi and events listeners
   */
  initialize() {
     // initialize the service
     videochatService.initialize();
     if (!this.initialized) {
       videochatService.on('CONFERENCE_LEFT', (data) => {
         this.close();
       });
       videochatService.on('CONFERENCE_JOINED', (data) => {
         this.isActive = true;
       });
       videochatService.on('CONFERENCE_FAILED', (data) => {
         this.close();
       });
       videochatService.on('LOAD_CONFIG_ERROR', (data) => {
         this.close();
       });
       this.initialized = true;
     }
  }

  /**
   * Start keep alive pooling
   */
  startKeepAlive() {
    if (Platform.OS === 'ios') {
      this.keepAliveInterval = setInterval(() => {
        this.keepAlive(this.roomName)
      }, 2000); //240000 4 minutes
    } else {
      this.keepAliveInterval = BackgroundTimer.setInterval(() => {
        this.keepAlive(this.roomName)
      }, 2000);
    }
  }

  /**
   * Stop keep alive
   */
  stopKeepAlive() {
    if (Platform.OS === 'ios') {
      clearInterval(this.keepAliveInterval);
    } else {
      BackgroundTimer.clearInterval(this.keepAliveInterval);
    }
  }

  /**
   * close
   */
  @action
  close() {
    this.stopKeepAlive();
    this.isActive = false;
  }

  /**
   * Keep alive
   * @param {string} roomName
   */
  async keepAlive(roomName) {
    const response = await api.post(`api/v2/video/room/${roomName}`);
    return response.room;
  }

  /**
   * Get room name for group
   * @param {objecy} entity
   */
  async getRoomName(entity) {
    const response = await api.get(`api/v2/video/room/${entity.guid}`);
    return response.room;
  }
}

export default new GatheringService();