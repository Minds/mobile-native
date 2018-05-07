import { extendObservable } from 'mobx'

const mock = jest.fn().mockImplementation(() => {
  return extendObservable({
    setUser: jest.fn(),
    setRewards: jest.fn(),
    clearUser: jest.fn(),
    load: jest.fn(),
    isAdmin: jest.fn(),
    reset: jest.fn(),
  }, {
    me: {},
    hasAttachment: false,
  });
});

export default mock;
