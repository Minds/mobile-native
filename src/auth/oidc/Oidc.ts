import { useFetchOidcProvidersQuery } from '~/graphql/api';

export const useLoginWeb = (): {
  name?: string;
  loginUrl?: string;
  isLoading?: boolean;
  error?: any;
} => {
  const { data, isLoading, error } = useFetchOidcProvidersQuery();

  if (isLoading) {
    return {
      isLoading,
    };
  }

  if (error) {
    return { error };
  }

  const { name, loginUrl } = data?.oidcProviders?.[0] ?? {};

  return {
    name,
    loginUrl,
    isLoading,
  };
};
