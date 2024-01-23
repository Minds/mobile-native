import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostSubscription from './PostSubscription';
import {
  PostSubscriptionFrequencyEnum,
  useGetPostSubscriptionQuery,
  useUpdatePostSubscriptionsMutation,
} from '~/graphql/api';

jest.mock('~/graphql/api');

const useGetPostSubscriptionQueryMocked =
  useGetPostSubscriptionQuery as jest.MockedFn<
    typeof useGetPostSubscriptionQuery
  >;

const useUpdatePostSubscriptionsMutationMocked =
  useUpdatePostSubscriptionsMutation as jest.MockedFn<
    typeof useUpdatePostSubscriptionsMutation
  >;

describe('PostSubscription', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('should render correctly', async () => {
    useGetPostSubscriptionQueryMocked.mockReturnValue({
      data: {
        postSubscription: {
          frequency: PostSubscriptionFrequencyEnum.Never,
        },
      },
      isLoading: false,
    } as any);

    const mockMutate = jest.fn();

    useUpdatePostSubscriptionsMutationMocked.mockReturnValue({
      mutate: mockMutate,
    } as any);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <PostSubscription
          guid="test-guid"
          color="red"
          raised={true}
          reverseColor="blue"
          iconStyle={{ padding: 2 }}
        />
      </QueryClientProvider>,
    );

    expect(getByTestId('post-subscription-button')).toBeTruthy();
  });

  it('should call mutation on button press', async () => {
    const mockMutate = jest.fn();

    useGetPostSubscriptionQueryMocked.mockReturnValue({
      data: {
        postSubscription: {
          frequency: PostSubscriptionFrequencyEnum.Never,
        },
      },
      isLoading: false,
    } as any);

    useUpdatePostSubscriptionsMutationMocked.mockReturnValue({
      mutate: mockMutate,
    } as any);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <PostSubscription
          guid="test-guid"
          color="red"
          raised={true}
          reverseColor="blue"
          iconStyle={{ padding: 2 }}
        />
      </QueryClientProvider>,
    );

    fireEvent.press(getByTestId('post-subscription-button'));

    await waitFor(() => expect(mockMutate).toHaveBeenCalled());
  });
});
