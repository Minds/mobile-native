import 'react-native';
import React from 'react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import NotificationsScreen from '../../src/notifications/v3/NotificationsScreen';
import NotificationsTabIcon from '../../src/notifications/v3/notifications-tab-icon/NotificationsTabIcon.tsx';
import { StoresProvider } from '../../src/common/hooks/use-stores';
import { useStores } from '../../src/common/hooks/__mocks__/use-stores';
import { TouchableOpacity, Text } from 'react-native';

jest.mock('react-native-system-setting');
jest.mock('react-native-silent-switch');

jest.mock('react-native-system-setting', () => {
  return {
    getVolume: jest.fn(() => Promise.resolve()),
  };
});

jest.mock(
  '../../src/notifications/v3/createNotificationsStore.ts',
  () => () => ({
    init: jest.fn(),
    unread: 1,
    setUnread: jest.fn,
    pollInterval: 1,
  }),
);

const Cmp = props => {
  const { notifications } = useStores();
  const onPress = () => notifications.setUnread(0);
  return (
    <TouchableOpacity onPress={onPress} accessibilityLabel={'TouchableOpacity'}>
      <Text>test</Text>{' '}
    </TouchableOpacity>
  );
};

describe('Notifications Screen Component', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <StoresProvider>
        <NotificationsScreen />
      </StoresProvider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders red dot correctly', () => {
    const { getByA11yLabel } = render(
      <StoresProvider>
        <NotificationsTabIcon color={'red'} />
      </StoresProvider>,
    );

    expect(getByA11yLabel('redDotIcon')).toBeDefined();
  });
});
