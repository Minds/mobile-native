import service from '../../../src/common/services/session.storage.service';
import storage from '../../../src/common/services/storage.service';

jest.mock('../../../src/common/services/storage.service');

/**
 * Tests
 */
describe('Session storage service', () => {
  it('should set and get initial values', async () => {
    await service.setAccessToken('token', '1111');

    expect(storage.setItem).toHaveBeenCalled();

    await service.getAccessToken();

    expect(storage.getItem).toHaveBeenCalled();

    await service.getPrivateKey();

    expect(storage.getItem).toHaveBeenCalled();
  });
});
