import { extendObservable } from 'mobx'
import OffsetListStore from '../../../common/stores/OffsetListStore';

const mock = jest.fn().mockImplementation(() => {

  return extendObservable({
    list: new OffsetListStore(),
    loadList: jest.fn(),
    setGuid: jest.fn(),
    refresh: jest.fn(),
    reset: jest.fn(),
    setFilter: jest.fn(),
  },{
    filter: 'subscribers'
  });
});

export default mock;
