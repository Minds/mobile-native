import { useApiPost } from '~/common/hooks/useApiFetch';

const useConnectAccount = () => {
  const response = useApiPost('api/v3/twitter-sync/connect');

  return {
    ...response,
    connectAccount: (username: string) => response.post({ username }),
  };
};

export default useConnectAccount;
