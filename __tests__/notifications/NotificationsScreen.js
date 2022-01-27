import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import NotificationsScreen from '../../src/notifications/v3/NotificationsScreen';
import { StoresProvider } from '../../src/common/hooks/use-stores';
import { getStores } from '../../AppStores';

jest.mock('@react-navigation/native');
jest.mock('react-native-system-setting');
jest.mock('react-native-notifications');
jest.mock(
  '../../src/common/components/interactions/InteractionsBottomSheet',
  () => 'InteractionsBottomSheet',
);

getStores.mockReturnValue({
  user: {
    me: {},
    load: jest.fn().mockReturnValue({ guid: '1' }),
    setUser: jest.fn(),
  },
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
