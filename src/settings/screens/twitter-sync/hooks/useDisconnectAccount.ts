import { useApiCall } from '~/common/hooks/useApiFetch';

const useDisconnectAccount = () => {
  const response = useApiCall('api/v3/twitter-sync', 'delete');

  return {
    ...response,
    disconnectAccount: response.post,
  };
};

export default useDisconnectAccount;
