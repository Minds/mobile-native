import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const QueryProvider = ({ ...props }) => (
  <QueryClientProvider client={queryClient} {...props} />
);

export default queryClient;

export { gqlClient } from './graphql-client';
