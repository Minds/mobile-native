import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
  },
});

export const QueryProvider = ({ ...props }) => (
  <QueryClientProvider client={queryClient} {...props} />
);

export default queryClient;
