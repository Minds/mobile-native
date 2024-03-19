import { useFetchOidcProvidersQuery } from '~/graphql/api';

export const useLoginWeb = (): {
  name?: string;
  loginUrl?: string;
} => {
  const { data } = useFetchOidcProvidersQuery();

  const { name, loginUrl } = data?.oidcProviders?.[0] ?? {};

  return {
    name,
    loginUrl,
  };
};
