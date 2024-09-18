import serviceProvider from '~/services/serviceProvider';

export const gqlFetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers'],
  signal?: AbortSignal,
): (() => Promise<TData>) => {
  return async () => {
    const apiService = serviceProvider.resolve('api');
    const response = await apiService.post<{ data: TData }>(
      'api/graphql',
      JSON.stringify({
        query,
        variables,
      }),
      options
        ? {
            headers: {
              ...options,
            },
          }
        : undefined,
      signal,
    );

    if (response.errors) {
      const { message } = response.errors[0] || {};
      throw new Error(message || 'Error…');
    }

    return response.data;
  };
};
