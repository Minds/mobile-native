import { MINDS_FEATURES } from '../../config/Config';

class FeaturesService {
  features = MINDS_FEATURES || {};

  has(feature) {
    return (typeof this.features[feature] === 'undefined') || this.features[feature];
  }
}

export default new FeaturesService();
