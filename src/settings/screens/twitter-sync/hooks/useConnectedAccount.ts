import useApiFetch from '~/common/hooks/useApiFetch';
import ConnectedAccount from '../types/ConnectedAccount';

const useConnectedAccount = () => {
  const response = useApiFetch<ConnectedAccount>('api/v3/twitter-sync', {
    persist: false,
  });

  return {
    ...response,
    connectedAccount: response.result,
  };
};

export default useConnectedAccount;
