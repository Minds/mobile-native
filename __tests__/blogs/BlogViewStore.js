import blogsService from '../../src/blogs/BlogsService';
import BlogsViewStore from '../../src/blogs/BlogsViewStore';
import BlogModel from '../../src/blogs/BlogModel';
import NavigationService from '../../src/navigation/NavigationService';

jest.mock('../../src/blogs/BlogsService');
jest.mock('../../src/blogs/BlogModel');
jest.mock('../../src/navigation/NavigationService');

//mock blog
BlogModel.checkOrCreate = jest.fn();

// we return the same array converted to strings as a model representation
BlogModel.checkOrCreate.mockImplementation((r) => r);

/**
 * Tests
 */
describe('blogs view store', () => {
  let store;

  beforeEach(() => {
    store = new BlogsViewStore();

    NavigationService.getCurrentState.mockReturnValue({});
  });

  it('should call blogs service loadEntity and update the blog', async (done) => {
    const fakeData = { blog: {} };

    blogsService.loadEntity.mockResolvedValue(fakeData);

    const spy = jest.spyOn(store, 'setBlog');

    try {
      // tested method
      const res = await store.loadBlog(1);

      // call blogs service loadEntity one time
      expect(blogsService.loadEntity).toBeCalled();

      // should checkOrCreate models
      expect(BlogModel.checkOrCreate).toBeCalledWith(fakeData.blog);

      // should be called with response
      expect(spy).toBeCalledWith(fakeData.blog);
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should reset the values', () => {
    // change default value
    store.blog = 'somevalue';

    // reset store
    store.reset();

    // should be cleared to defaults
    expect(store.blog).toEqual(null);
  });

  it('should checkOrCreate blog model when setBlog is called', async (done) => {
    const fake = { guid: 1 };

    try {
      // tested method
      const res = await store.setBlog(fake);

      // should checkOrCreate models
      expect(BlogModel.checkOrCreate).toBeCalledWith(fake);

      done();
    } catch (e) {
      done.fail(e);
    }
  });
});
