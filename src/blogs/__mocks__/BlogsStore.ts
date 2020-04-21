import { extendObservable } from 'mobx';
import OffsetListStore from '../../common/stores/OffsetListStore';

const mock = jest.fn().mockImplementation(() => {
  return extendObservable(
    {
      list: new OffsetListStore(),
      loadList: jest.fn(),
      setFilter: jest.fn(),
      refresh: jest.fn(),
      reset: jest.fn(),
    },
    {
      filter: 'trending',
    },
  );
});

export default mock;
