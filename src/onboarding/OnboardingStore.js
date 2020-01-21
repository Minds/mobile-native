import { observable, action, computed, extendObservable } from 'mobx'
import onboardingService from './OnboardingService';
import number from '../common/helpers/number';
import OffsetListStore from '../common/stores/OffsetListStore';
import logService from '../common/services/log.service';
import UserModel from '../channel/UserModel';
import NavigationService from '../navigation/NavigationService';
import featuresService from '../common/services/features.service';

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
    try {
      const users = await onboardingService.getSuggestedUsers();
      if (users.suggestions) {
        this.suggestedUsers.list.setList({entities: users.suggestions.map(r => UserModel.create(r.entity))});
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Get progress
   */
  async getProgress() {
    logService.info('[OnboardingStore] getting onboarding progress');
    let onboarding = featuresService.has('onboarding-december-2019') ? 'OnboardingScreenNew' : 'OnboardingScreen';
    try {
      const progress = await onboardingService.getProgress();
      this.setProgress(progress);
      if (progress && progress.show_onboarding) {
        NavigationService.push(onboarding);
      }
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