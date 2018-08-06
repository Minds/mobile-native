
import service from '../../../src/common/services/entity.service';
import { MINDS_DEEPLINK } from '../../../src/config/Config';
import api from '../../../src/common/services/api.service';


jest.mock('../../../src/common/services/api.service');
/**
 * Tests
 */
describe('Entity service', () => {

  it('should add route', async () => {
    const apiResponse = {loaded: 10, total:200};

    api.get.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.getEntity('crypto2');

    // call api upload one time
    expect(api.get.mock.calls.length).toEqual(1);
    expect(api.get.mock.calls[0][0]).toEqual('api/v1/entities/entity/crypto2');
    
  });
});