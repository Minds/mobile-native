//@ts-nocheck
import api from '../common/services/api.service';

/**
 * Onboarding service
 */
class OnboardingService {
  progress = null;

  /**
   * Get progress
   */
  getProgress() {
    return api.get('api/v2/onboarding/progress');
  }

  /**
   * Set frequency
   * @param {boolean} value
   */
  setFrequency(value) {
    return api.post('api/v2/onboarding/creator_frequency', { value });
  }

  /**
   * Set shown
   * @param {boolean} value
   */
  setShown(value) {
    return api.post('api/v2/onboarding/onboarding_shown', { value });
  }

  /**
   * Get suggested users
   */
  getSuggestedUsers() {
    return api.get('api/v2/suggestions/user', { limit: 12 });
  }
}

export default new OnboardingService();
