import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import NotificationsScreen from '../../src/notifications/v3/NotificationsScreen';
import { getStores } from '../../AppStores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');
sp.mockService('log');

jest.mock('@react-navigation/native');
jest.mock('react-native-system-setting');
jest.mock('react-native-notifications');
jest.mock(
  '../../src/common/components/interactions/InteractionsBottomSheet',
  () => 'InteractionsBottomSheet',
);
jest.mock('../../src/common/hooks/use-stores', () => ({
  StoresProvider: ({ children }) => children,
  useStores: () => ({
    notifications: {},
    chat: {},
  }),
  useLegacyStores: () => ({
    dismissal: {
      isDismissed() {
        return false;
      },
      dismiss() {
        return;
      },
    },
  }),
}));

getStores.mockReturnValue({
  user: {
    me: {},
    load: jest.fn().mockReturnValue({ guid: '1' }),
    setUser: jest.fn(),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const Wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Notifications Screen Component', () => {
  let navigation;
  beforeEach(() => {
    navigation = {
      navigate: jest.fn(),
      getParent: jest
        .fn()
        .mockImplementation(() => ({ addListener: jest.fn() })),
      push: jest.fn(),
    };
  });
  it('renders correctly', () => {
    const { toJSON } = render(
      <Wrapper>
        <NotificationsScreen navigation={navigation} />
      </Wrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
