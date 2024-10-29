import { ApiService } from '~/common/services/api.service';
import { BlogsService } from '~/blogs/BlogsService';

jest.mock('~/common/services/api.service');

/**
 * Tests
 */
describe('blogs service', () => {
  const api = new ApiService();
  const blogService = new BlogsService(api);
  beforeEach(() => {
    api.get.mockClear();
  });

  it('should call api get when loadList is called and return the blogs', async () => {
    const apiResponse = { entities: [1, 2, 3], 'load-next': 'a1' };

    api.get.mockResolvedValue(apiResponse);

    // call tested method
    const res = await blogService.loadList('filter', 'a0');

    // assert on the response
    expect(res.entities).toEqual(apiResponse.entities);
    expect(res.offset).toEqual(apiResponse['load-next']);

    // call api post one time
    expect(api.get.mock.calls.length).toEqual(1);
    // with login url
    expect(api.get.mock.calls[0][0]).toEqual('api/v1/blog/filter');
    // and the offset
    expect(api.get.mock.calls[0][1].offset).toEqual('a0');
  });

  it('should call api get when loadEntity is called and return the blog', async () => {
    const apiResponse = { blog: { guid: 'guid1' } };

    api.get.mockResolvedValue(apiResponse);

    // call tested method
    const res = await blogService.loadEntity('guid1');

    // assert on the response
    expect(res.blog.guid).toEqual('guid1');

    // call api post one time
    expect(api.get.mock.calls.length).toEqual(1);
    // with login url
    expect(api.get.mock.calls[0][0]).toEqual('api/v1/blog/guid1');
  });
});
