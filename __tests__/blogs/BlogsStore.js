import blogsService from '../../src/blogs/BlogsService';
import BlogsStore from '../../src/blogs/BlogsStore';
import BlogModel from '../../src/blogs/BlogModel';
import OffsetListStore from '../../src/common/stores/OffsetListStore';
import { whenWithTimeout } from 'mobx-utils';

jest.mock('../../src/blogs/BlogsService');
jest.mock('../../src/blogs/BlogModel');
jest.mock('../../src/common/stores/OffsetListStore');

//mock blog
BlogModel.createMany = jest.fn();

// we return the same array converted to strings as a model representation
BlogModel.createMany.mockImplementation(r => r.map(u => u.toString()));

/**
 * Tests
 */
describe('blogs store', () => {
  let store;

  beforeEach(() => {
    store = new BlogsStore();
  });

  it('should call blogs service loadList and update the list', async () => {
    const fakeData = { entities: [1, 2, 3], 'load-next': 'a0' };

    blogsService.loadList.mockResolvedValue(fakeData);

    // tested method
    const res = await store.loadList();

    // call blogs service loadlist one time
    expect(blogsService.loadList.mock.calls.length).toEqual(1);

    // should create models
    expect(BlogModel.createMany).toBeCalledWith([1, 2, 3]);

    // should be called with response
    expect(store.list.setList).toBeCalledWith(fakeData);

    // should be converted to models
    expect(fakeData.entities).toEqual(['1', '2', '3']);
  });

  it('should clear list and reload on refresh', async () => {
    const spy = jest.spyOn(store, 'loadList');
    // tested method
    const res = await store.refresh();

    // should clear the list
    expect(store.list.refresh).toBeCalled();
    // should load new data
    expect(spy).toBeCalled();
    // should fire refresh done
    expect(store.list.refreshDone).toBeCalled();
  });

  it('should set the filter', () => {
    // set filter and expect to be changed
    store.setFilter('a');
    expect(store.filter).toBe('a');
    store.setFilter('b');
    expect(store.filter).toBe('b');
  });

  it('should reset the values', () => {
    // change default value
    store.setFilter('a');

    // reset store
    store.reset();

    // should be cleared to defaults
    expect(store.list.clearList).toBeCalled();
    expect(store.filter).toEqual('network');
  });
});
