import { observable, action, computed, extendObservable } from 'mobx'
import onboardingService from './OnboardingService';
import number from '../common/helpers/number';
import OffsetListStore from '../common/stores/OffsetListStore';
import logService from '../common/services/log.service';

/**
 * Onboarding store
 */
class OnboardingStore {
  @observable progress = null;

  suggestedUsers = {
    list: new OffsetListStore(),
    loading: false
  }

  @computed
  get percentage() {
    if (!this.progress) return 0;

    return number(this.progress.completed_items.length / this.progress.all_items.length, 0, 2);
  }

  async getSuggestedUsers() {
    const users = await onboardingService.getSuggestedUsers();
    if (users.suggestions) this.suggestedUsers.list.setList({entities: users.suggestions.map(r => r.entity)});
  }

  /**
   * Get progress
   */
  async getProgress() {
    try {
      const progress = await onboardingService.getProgress();
      this.setProgress(progress);
      return progress;
    } catch (err) {
      logService.exception(err);
      return false;
    }
  }

  /**
   * Set frenquency
   * @param {boolean} value
   */
  async setFrequency(value) {
    return onboardingService.setFrequency(value);
  }

  /**
   * Set shown
   * @param {boolean} value
   */
  async setShown(value) {
    return onboardingService.setShown(value);
  }

  @action
  setProgress(value) {
    this.progress = value;
  }
}

export default OnboardingStore;