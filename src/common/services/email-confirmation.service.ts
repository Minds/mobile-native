//@ts-nocheck
import apiService from './api.service';
import logService from './log.service';

class EmailConfirmationService {
  async send() {
    try {
      const response = await apiService.post(
        'api/v2/email/confirmation/resend',
        {},
      );

      return Boolean(response && response.sent);
    } catch (err) {
      logService.exception('[EmailConfirmationService] send', err);
      return false;
    }
  }
}

export default new EmailConfirmationService();
