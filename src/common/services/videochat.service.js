import JitsiMeet, { JitsiMeetEvents } from 'react-native-jitsi-meet';
import jwt from 'jwt-simple';
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
  call(url, user) {
    // jitsi sdk replace users name and avatar with the jwt data
    const jwtParams = jwt.encode({
      "context": {
        "user": {
          "avatar": user.getAvatarSource('large').uri,
          "name": user.username,
        }
      }
    }, 'any');

    setTimeout(() => {
      JitsiMeet.call(url, jwtParams);
    }, 1000);
  }
}

export default new VideoChatService();