import { MINDS_FEATURES } from '../../config/Config';

class FeaturesService {
  features = MINDS_FEATURES || {};

  has(feature) {
    return (typeof this.features[feature] === 'undefined') || this.features[feature];
  }

  isLegacy() {
    return this.features.legacy;
  }
}

export default new FeaturesService();
