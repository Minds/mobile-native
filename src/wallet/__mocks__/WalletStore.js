import { extendObservable } from 'mobx'

const mock = jest.fn().mockImplementation(() => {
  return extendObservable({
    load: jest.fn(),
  }, {
    ledger: []
  });
});

export default mock;
