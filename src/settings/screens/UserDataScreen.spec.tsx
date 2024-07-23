import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import UserDataScreen from './UserDataScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeletePostHogPersonMutation } from '~/graphql/api';

import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');
const mindsConfigService = sp.mockService('config');
const analyticsService = sp.mockService('analytics');
const settingsApiService = sp.mockService('settingsApi');

jest.mock('~/graphql/api');

const useDeletePostHogPersonMutationMocked =
  useDeletePostHogPersonMutation as jest.MockedFn<
    typeof useDeletePostHogPersonMutation
  >;

describe('UserDataScreen', () => {
  let queryClient: QueryClient, wrapper;

  beforeEach(() => {
    queryClient = new QueryClient();
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load data and render correctly', async () => {
    render(<UserDataScreen />, { wrapper });

    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('should set opt out to true when clicking on unchecked checkbox', () => {
    render(<UserDataScreen />, { wrapper });

    jest.spyOn(analyticsService, 'setOptOut');
    jest.spyOn(settingsApiService, 'submitSettings');

    const checkbox = screen.getByTestId('checkbox');
    fireEvent.press(checkbox);

    expect(analyticsService.setOptOut).toHaveBeenCalledTimes(1);
    expect(analyticsService.setOptOut).toHaveBeenCalledWith(true);
    expect(settingsApiService.submitSettings).toHaveBeenCalled();
  });

  it('should set opt out to true when clicking on unchecked checkbox', () => {
    jest.spyOn(mindsConfigService, 'getSettings').mockReturnValue({
      posthog: {
        opt_out: true,
      },
    });

    jest.spyOn(analyticsService, 'setOptOut');
    jest.spyOn(settingsApiService, 'submitSettings');

    render(<UserDataScreen />, { wrapper });

    const checkbox = screen.getByTestId('checkbox');
    fireEvent.press(checkbox);

    expect(analyticsService.setOptOut).toHaveBeenCalledTimes(1);
    expect(analyticsService.setOptOut).toHaveBeenCalledWith(false);
    expect(settingsApiService.submitSettings).toHaveBeenCalled();
  });

  it('should delete data when clicking button', async () => {
    const mockMutate = jest.fn();

    useDeletePostHogPersonMutationMocked.mockReturnValue({
      mutateAsync: mockMutate,
    } as any);

    render(<UserDataScreen />, { wrapper });

    const btn = screen.getByTestId('delete-data-btn');
    fireEvent.press(btn);

    expect(mockMutate).toHaveBeenCalled();
  });
});
