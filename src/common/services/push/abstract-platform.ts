//@ts-nocheck
import api from '../api.service';
import logService from '../log.service';
import sessionService from '../session.service';

/**
 * Abstract Platform
 */
export default class AbstractPlatform {
  token: string = null;

  shouldRegister = false;

  onInitialNotification;

  setOnInitialNotification(fn) {
    this.onInitialNotification = fn;
  }

  /**
   * Register device to backend
   * @param {string} service apple or google
   */
  registerToken(service) {
    if (this.token) {
      api
        .post('api/v3/notifications/push/token', {
          service: service,
          token: this.token,
        })
        .catch(err => logService.exception('[PushService]', err))
        .then(() => logService.log('[PushService]: Registered'));
    } else {
      this.shouldRegister = true;
    }
  }

  /**
   * unregister device from backend
   */
  unregisterTokenFrom(index) {
    if (this.token) {
      return sessionService.apiServiceInstances[index].delete(
        `api/v3/notifications/push/token/${this.token}`,
      );
    }
  }

  requestPermission(): void;
}
