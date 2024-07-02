import { IS_TENANT } from '~/config/Config';
import { useFetchOidcProvidersQuery } from '~/graphql/api';

export const useLoginWeb = () => {
  const { data, isLoading, error, refetch } = useFetchOidcProvidersQuery(
    undefined,
    { retry: 15, retryDelay: 2000 },
  );

  // we ignore for minds app
  if (!IS_TENANT) {
    return {
      isLoading: false,
      refetch: () => {},
    };
  }

  if (isLoading) {
    return {
      isLoading,
      refetch,
    };
  }

  if (error) {
    return { error, refetch };
  }

  const { name, loginUrl } = data?.oidcProviders?.[0] ?? {};

  return {
    refetch,
    name,
    loginUrl,
    isLoading,
  };
};
