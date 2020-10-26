import { extendObservable } from 'mobx';

const mock = jest.fn().mockImplementation(() => {
  return extendObservable(
    {
      loadBlog: jest.fn(),
      setBlog: jest.fn(),
      reset: jest.fn(),
    },
    {
      blog: null,
    },
  );
});

export default mock;
