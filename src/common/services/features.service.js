import { MINDS_FEATURES } from '../../config/Config';
import mindsService from './minds.service';

/**
 * Feature service
 */
class FeaturesService {

  /**
   * Local config features are available without inicialization
   */
  features = MINDS_FEATURES || {}

  /**
   * Update features from minds services
   */
  async updateFeatures() {
    const features = await mindsService.getSettings();

    Object.assign(features, MINDS_FEATURES);

    this.features = features;
  }

  has(feature) {
    return (typeof this.features[feature] === 'undefined') || this.features[feature];
  }
}

export default new FeaturesService();
