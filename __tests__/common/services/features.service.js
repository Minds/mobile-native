
import service from '../../../src/common/services/features.service';
import { MINDS_FEATURES } from '../../../src/config/Config';
/**
 * Tests
 */
describe('Feature service', () => {

  it('should return features', async () => {
    let features = {
      crypto: false,
      'onboarding-december-2019': true,
      compose: true,
    };
    expect(service.features).toEqual(features);
    expect(service.has('crypto')).toEqual(false);
  });
});