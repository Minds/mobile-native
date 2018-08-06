
import service from '../../../src/common/services/crypto.service';
import Encryption from 'react-native-minds-encryption';
jest.mock('../../../src/common/services/push.service');
jest.mock('react-native-minds-encryption');

/**
 * Tests
 */
describe('Crypto service', () => {
  it('should call decrypt adn encrypt', async () => {

    expect(service.privateKey).toEqual(null);
    expect(service.publicKeys).toEqual({});

    service.setPrivateKey('key');
    expect(service.privateKey).toEqual('key');
    let publicKeys = {a:'keya', b:'keyb', c:'keyc'};
    service.setPublicKeys(publicKeys);

    expect(service.getPublicKeys()).toEqual(publicKeys);
    service.decrypt('north');

    expect(Encryption.decrypt).toHaveBeenCalled();
    
    service.encrypt('north', 'a');

    expect(Encryption.encrypt).toHaveBeenCalled();

    expect(function() {
      service.encrypt('north', 'k');
    }).toThrowError();

  });
});