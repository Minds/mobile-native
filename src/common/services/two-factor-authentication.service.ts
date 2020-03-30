import api from "./api.service";

class TwoFactorAuthenticationService {
  
  /**
   * request endpoint to ask if user has twofactor activated
   */
  async has() {
    return await api.get('api/v1/twofactor');
  }

  /**
   * Call to twofactor endpoint
   * @param {String} number 
   */
  async authenticate(tel) {
    const params = { tel };
    params.retry = 1;
    return await api.post('api/v1/twofactor/setup', params);
  }

  /**
   * Check if the code corresponds to telno and secret
   * @param {String} telno 
   * @param {String} code 
   * @param {String} secret 
   */
  async check(telno, code, secret) {
    return await api.post('api/v1/twofactor/check', {telno, code, secret});
  }

  /**
   * Deactivate 2FA
   * @param {String} password 
   */
  async remove(password) {
    return await api.post('api/v1/twofactor/remove', {password});
  }
}

export default new TwoFactorAuthenticationService();