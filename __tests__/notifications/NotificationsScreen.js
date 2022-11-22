import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import NotificationsScreen from '../../src/notifications/v3/NotificationsScreen';
import { StoresProvider } from '../../src/common/hooks/use-stores';
import { getStores } from '../../AppStores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
        <StoresProvider>
          <NotificationsScreen navigation={navigation} />
        </StoresProvider>
      </Wrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
