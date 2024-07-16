import { ApiResponse } from './ApiResponse';
import type { ApiService } from './api.service';

interface TFASetupResponse extends ApiResponse {
  secret: string;
}

export class TwoFactorAuthenticationService {
  constructor(private api: ApiService) {}
  /**
   * request endpoint to ask if user has twofactor activated
   */
  async has() {
    return await this.api.get('api/v1/twofactor');
  }

  /**
   * Call to twofactor endpoint
   * @param {String} number
   */
  async authenticate(tel: string): Promise<TFASetupResponse> {
    const params = { tel, retry: 1 };
    return await this.api.post('api/v1/twofactor/setup', params);
  }

  /**
   * Check if the code corresponds to telno and secret
   * @param {String} telno
   * @param {String} code
   * @param {String} secret
   */
  async check(telno: string, code: string, secret: string) {
    return await this.api.post('api/v1/twofactor/check', {
      telno,
      code,
      secret,
    });
  }

  /**
   * Deactivate 2FA
   * @param {String} password
   */
  async remove(password) {
    return await this.api.post('api/v1/twofactor/remove', { password });
  }
}
