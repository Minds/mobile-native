import { MINDS_FEATURES } from '../../config/Config';
import mindsService from './minds.service';
import { observable, action } from 'mobx';
import sessionService from './session.service';

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

  /**
   * Return true if the feature is active or false otherwise
   * @param {string} feature
   */
  has(feature) {
    return (typeof this.features[feature] === 'undefined') ||
      this.features[feature] === true ||
      (this.features[feature] === 'canary' && sessionService.getUser().canary);
  }
}

export default new FeaturesService();
