import { extendObservable } from 'mobx'

const mock = jest.fn().mockImplementation(() => {
  return extendObservable({
    setList: jest.fn(),
    prepend: jest.fn(),
    clearList: jest.fn(),
    refresh: jest.fn(),
    refreshDone: jest.fn(),
    cantLoadMore: jest.fn()
  }, {
    refreshing: false,
    loaded: false,
    offset: '',
    entities: []
  });
});

export default mock;
