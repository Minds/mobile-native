import service from '../../../src/common/services/keychain.service';

import CryptoJS from 'crypto-js';

// import stores from '../../../AppStores';

jest.mock('../../../AppStores');
jest.mock('crypto-js');
/**
 * Tests
 */
describe('Keychain service', () => {
  it('should setSecret', async () => {
    service.setSecretIfEmpty('cache', 'secret');

    expect(service.unlocked).toEqual({});

    service.setSecretIfEmpty('', 'secret');

    expect(service.unlocked).toEqual({});

    service.setSecretIfEmpty('', 'secret');

    expect(service.unlocked).toEqual({});

    service.storeToCache('keychain', 'secret');

    expect(service.hasSecret('keychain')).toBeInstanceOf(Object);

    expect(service.getSecret('keychain')).toBeInstanceOf(Object);
  });

  it('should setSecret for', async () => {
    service.setSecretIfEmpty('cache', 'secret');

    expect(service.unlocked.keychain.secret).toEqual('secret');

    service.setSecretIfEmpty('', 'secret');

    expect(service.unlocked.keychain.secret).toEqual('secret');

    service.setSecretIfEmpty('keychain', '');

    expect(service.unlocked.keychain.secret).toEqual('secret');

    service.storeToCache('keychain', 'secret');

    expect(service.unlocked.keychain.secret).toEqual('secret');
  });
});
