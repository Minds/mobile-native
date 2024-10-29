import { MindsConfigService } from '~/common/services/minds-config.service';
import { ApiService } from '~/common/services/api.service';

jest.mock('~/common/services/api.service');
/**
 * Tests
 */
describe('Minds service', () => {
  const api = new ApiService();
  const service = new MindsConfigService(api);

  it('Should get settings', async () => {
    const apiResponse = { settings: { loaded: 10, total: 200 } };

    api.get.mockResolvedValue(apiResponse);

    service.update();

    // call api upload one time
    expect(api.get.mock.calls.length).toEqual(1);
    expect(api.get.mock.calls[0][0]).toEqual('api/v1/minds/config');
  });
});
