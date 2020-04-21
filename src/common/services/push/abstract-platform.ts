//@ts-nocheck
import api from '../api.service';
import logService from '../log.service';

/**
 * Abstract Platform
 */
export default class AbstractPlatform {
  token = null;

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
        .post('api/v1/notifications', {
          service: service,
          token: this.token,
        })
        .catch((err) => logService.exception('[PushService]', err));
    } else {
      this.shouldRegister = true;
    }
  }
}
