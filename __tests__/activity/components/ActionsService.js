import api from '../../../src/common/services/api.service';
import { thumbActivity } from '../../../src/newsfeed/activity/ActionsService';

jest.mock('../../../src/common/services/api.service');

/**
 * Tests
 */
fdescribe('blogs service', () => {
  beforeEach(() => {
    api.get.mockClear();
  });

  it('should call api with proper values', async () => {

    const apiResponse = {success: true};

    api.put.mockResolvedValue(apiResponse);

    const res = await thumbActivity('guid', 'direction');

    expect(api.put.mock.calls.length).toEqual(1);
    expect(api.put.mock.calls[0][0]).toEqual('api/v1/votes/guid/direction');
  });
});