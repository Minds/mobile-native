import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import NotificationsScreen from '../../src/notifications/v3/NotificationsScreen';
import NotificationsTabIcon from '../../src/notifications/v3/notifications-tab-icon/NotificationsTabIcon.tsx';
import { StoresProvider } from '../../src/common/hooks/use-stores';
import { useNavigation } from '../../__mocks__/@react-navigation/native';
jest.mock('@react-navigation/native');
jest.mock('react-native-system-setting');
jest.mock('react-native-silent-switch');
jest.mock('react-native-notifications');

jest.mock('react-native-system-setting', () => {
  return {
    getVolume: jest.fn(() => Promise.resolve()),
  };
});

describe('Notifications Screen Component', () => {
  let navigation;
  beforeEach(() => {
    navigation = {
      navigate: jest.fn(),
      push: jest.fn(),
      addListener: jest.fn(),
    };
  });
  it('renders correctly', () => {
    const { toJSON } = render(
      <StoresProvider>
        <NotificationsScreen navigation={navigation} />
      </StoresProvider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
