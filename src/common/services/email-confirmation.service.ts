//@ts-nocheck
import apiService from './api.service';
import logService from './log.service';

class EmailConfirmationService {
  async send() {
    try {
      const response = await apiService.post('api/v3/email/send', {});

      return Boolean(response && response.status === 'success');
    } catch (err) {
      logService.exception('[EmailConfirmationService] send', err);
      return false;
    }
  }
}

export default new EmailConfirmationService();
