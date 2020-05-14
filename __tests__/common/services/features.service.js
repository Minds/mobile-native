import service from '../../../src/common/services/features.service';
import { MINDS_FEATURES } from '../../../src/config/Config';
/**
 * Tests
 */
describe('Feature service', () => {
  it('should return features', async () => {
    let features = {
      channel: true,
      crypto: true,
      compose: true,
      discovery: true,
      wallet: true,
    };
    expect(service.features).toEqual(features);
    expect(service.has('crypto')).toEqual(true);
  });
});
