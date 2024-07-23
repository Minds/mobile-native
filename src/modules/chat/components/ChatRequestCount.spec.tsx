import * as React from 'react';
import { render } from '@testing-library/react-native';
import ChatRequestCount from './ChatRequestCount';
import { useGetTotalRoomInviteRequestsQuery } from '~/graphql/api';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');

// Mock the useGetTotalRoomInviteRequestsQuery hook
jest.mock('~/graphql/api', () => ({
  // replace with your actual import path
  useGetTotalRoomInviteRequestsQuery: jest.fn(),
}));

const mockedUseGetTotalRoomInviteRequestsQuery =
  useGetTotalRoomInviteRequestsQuery as jest.MockedFunction<any>;

describe('ChatRequestCount', () => {
  it('should render correctly', async () => {
    const mockData = { totalRoomInviteRequests: 5 }; // replace with your actual data structure
    mockedUseGetTotalRoomInviteRequestsQuery.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      isSuccess: true,
    });

    const { getByText } = render(<ChatRequestCount />);

    // Replace '5' with the actual text or element you expect to render
    expect(getByText('5 pending requests')).toBeTruthy();
  });

  it('should not render if there is no data', () => {
    mockedUseGetTotalRoomInviteRequestsQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isSuccess: false,
    });

    const { getByTestId } = render(<ChatRequestCount />);

    //  should not render if there is no data
    expect(() => getByTestId('chatRequestCount')).toThrow();
  });

  it('should not render if there is 0 requests', () => {
    mockedUseGetTotalRoomInviteRequestsQuery.mockReturnValue({
      data: { totalRoomInviteRequests: 0 },
      error: null,
      isLoading: true,
      isSuccess: false,
    });

    const { getByTestId } = render(<ChatRequestCount />);

    //  should not render if there is no data
    expect(() => getByTestId('chatRequestCount')).toThrow();
  });
});
