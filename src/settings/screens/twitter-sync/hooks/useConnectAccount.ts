import { useApiCall } from '~/common/hooks/useApiFetch';

const useConnectAccount = () => {
  const response = useApiCall('api/v3/twitter-sync/connect');

  return {
    ...response,
    connectAccount: (username: string) => response.post({ username }),
  };
};

export default useConnectAccount;
