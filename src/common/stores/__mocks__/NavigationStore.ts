import { extendObservable } from 'mobx';

const mock = jest.fn().mockImplementation(() => {
  return extendObservable(
    {
      previousScreen: '',
      currentScreen: jest.fn(),
      onScreen: jest.fn(),
      onEnterScreen: jest.fn(),
      onLeaveScreen: jest.fn(),
      dispatch: jest.fn(),
      navigate: jest.fn(),
      resetNavigate: jest.fn(),
    },
    {
      navigationState: {
        index: 0,
        routes: [{ key: 'Loading', routeName: 'Loading' }],
      },
    },
  );
});

export default mock;
