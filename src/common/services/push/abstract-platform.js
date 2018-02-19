import api from '../api.service';

/**
 * Abstract Platform
 */
export default class AbstractPlatform {

  token = null;

  /**
   * Register device to backend
   * @param {string} service apple or google
   */
  registerToken(service) {
    if (this.token) {
      api.post('api/v1/notifications', {
        service: service,
        token: this.token
      });
    }
  }
}