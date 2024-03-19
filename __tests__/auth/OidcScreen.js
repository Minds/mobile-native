jest.useFakeTimers();

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import OidcScreen from '../../src/auth/oidc/OidcScreen';
import { getStores } from '../../AppStores';
import { useNavigation } from '@react-navigation/core';

jest.mock('@react-navigation/core');
jest.mock('@gorhom/bottom-sheet');
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('../../src/auth/AuthService');
jest.mock('react-native-safe-area-context');

getStores.mockReturnValue({
  user: {
    me: {},
    load: jest.fn().mockReturnValue({ guid: '1' }),
    setUser: jest.fn(),
  },
});

xdescribe('OidcScreen component', () => {
  beforeEach(() => {});

  it('should renders correctly', done => {
    const route = { params: {} };
    const navigation = { goBack: jest.fn(), setOptions: jest.fn() };
    useNavigation.mockReturnValue(navigation);
    const oidcScreen = renderer
      .create(<OidcScreen route={route} navigation={navigation} />)
      .toJSON();
    expect(oidcScreen).toMatchSnapshot();

    done();
  });
});
