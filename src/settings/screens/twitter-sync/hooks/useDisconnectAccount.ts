import { useApiPost } from '~/common/hooks/useApiFetch';

const useDisconnectAccount = () => {
  const response = useApiPost('api/v3/twitter-sync', 'delete');

  return {
    ...response,
    disconnectAccount: response.post,
  };
};

export default useDisconnectAccount;
