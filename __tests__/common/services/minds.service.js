
import service from '../../../src/common/services/minds.service';
import api from '../../../src/common/services/api.service';


jest.mock('../../../src/common/services/api.service');
/**
 * Tests
 */
describe('Minds service', () => {
  it('Should get settings', async () => {

    const apiResponse = {settings:{loaded: 10, total:200}};

    api.get.mockResolvedValue(apiResponse);

    await service.getSettings();
    
    // call api upload one time
    expect(api.get.mock.calls.length).toEqual(1);
    expect(api.get.mock.calls[0][0]).toEqual('api/v1/minds/config');

  });
});