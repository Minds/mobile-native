import BlogsViewStore from '~/blogs/BlogsViewStore';
import BlogModel from '~/blogs/BlogModel';

jest.mock('~/blogs/BlogsService');
jest.mock('~/blogs/BlogModel');

import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
const blogsService = sp.mockService('blogs');
const navigationService = sp.mockService('navigation');
sp.mockService('richEmbed');

//mock blog
BlogModel.checkOrCreate = jest.fn();

// we return the same array converted to strings as a model representation
BlogModel.checkOrCreate.mockImplementation(r => r);

/**
 * Tests
 */
describe('blogs view store', () => {
  let store;

  beforeEach(() => {
    store = new BlogsViewStore();

    navigationService.getCurrentState.mockReturnValue({});
  });

  it('should call blogs service loadEntity and update the blog', async () => {
    const fakeData = { blog: {} };

    blogsService.loadEntity.mockResolvedValue(fakeData);

    const spy = jest.spyOn(store, 'setBlog');

    // tested method
    const res = await store.loadBlog(1);

    // call blogs service loadEntity one time
    expect(blogsService.loadEntity).toBeCalled();

    // should checkOrCreate models
    expect(BlogModel.checkOrCreate).toBeCalledWith(fakeData.blog);

    // should be called with response
    expect(spy).toBeCalledWith(fakeData.blog);
  });

  it('should reset the values', () => {
    // change default value
    store.blog = 'somevalue';

    // reset store
    store.reset();

    // should be cleared to defaults
    expect(store.blog).toEqual(null);
  });

  it('should checkOrCreate blog model when setBlog is called', async () => {
    const fake = { guid: 1 };

    // tested method
    const res = await store.setBlog(fake);

    // should checkOrCreate models
    expect(BlogModel.checkOrCreate).toBeCalledWith(fake);
  });
});
