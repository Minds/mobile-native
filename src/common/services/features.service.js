
import {
  Alert
} from 'react-native';

import { MINDS_FEATURES } from '../../config/Config';
import mindsService from './minds.service';
import { observable, action } from 'mobx';
import sessionService from './session.service';
import i18n from './i18n.service';

/**
 * Feature service
 */
class FeaturesService {

  /**
   * Local config features are available without inicialization
   */
  @observable features = MINDS_FEATURES || {};
  @observable loaded = false;

  /**
   * Update features from minds services
   */
  @action
  async updateFeatures() {
    const settings = await mindsService.getSettings();
    const features = settings.features;

    Object.assign(features, MINDS_FEATURES);
    
    this.features = features;
    this.loaded = true;
  }

  @action
  async injectFeatures(otherFeatures) {
    const features = this.features;

    Object.assign(features, otherFeatures);
    
    this.features = features;
  }

  /**
   * Show feature alert
   */
  showAlert() {
    Alert.alert(i18n.t('ops'), i18n.t('featureUnavailablePlatform'));
  }

  /**
   * Return true if the feature is active or false otherwise
   * @param {string} feature
   */
  has(feature) {
    return this.features[feature] === true ||
      (this.features[feature] === 'canary' && sessionService.getUser().canary);
  }
}

export default new FeaturesService();
