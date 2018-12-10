import JitsiMeet, { JitsiMeetEvents } from 'react-native-jitsi-meet';

/**
 * Video chat service (Jitsi)
 */
class VideoChatService {

  isInitialized = false;

  /**
   * Initialize jitsi
   */
  initialize() {
    if (this.isInitialized) return;

    JitsiMeet.initialize();

    this.isInitialized = true;
  }

  /**
   * On event listeners
   * @param {string} event
   * @param {callback} cb
   */
  on(event, cb) {
    JitsiMeetEvents.addListener(event, cb);
  }

  /**
   * Start video chat
   * @param {string} url
   */
  call(url) {
    setTimeout(() => {
      JitsiMeet.call(url);
    }, 1000);
  }
}

export default new VideoChatService();