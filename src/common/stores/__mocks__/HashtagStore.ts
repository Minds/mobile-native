import { extendObservable } from 'mobx';

const mock = jest.fn().mockImplementation(() => {
  return extendObservable(
    {
      loadSuggested: jest.fn(),
      setLoading: jest.fn(),
      setSuggested: jest.fn(),
      select: jest.fn(),
      deselect: jest.fn(),
      reset: jest.fn(),
    },
    {
      loading: false,
      suggested: [],
    },
  );
});

export default mock;
