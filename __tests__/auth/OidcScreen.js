//jest.useFakeTimers();

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import OidcScreen from '~/auth/oidc/OidcScreen';
import { getStores } from '../../AppStores';
import { useNavigation } from '@react-navigation/core';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');

jest.mock('@react-navigation/core');
jest.mock('@gorhom/bottom-sheet');
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('react-native-safe-area-context');
jest.mock('react-native-webview');

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
