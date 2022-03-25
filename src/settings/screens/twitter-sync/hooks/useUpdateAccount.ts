import { useApiCall } from '~/common/hooks/useApiFetch';

const useUpdateAccount = () => {
  const response = useApiCall('api/v3/twitter-sync');

  return {
    ...response,
    updateAccount: data => response.post(data),
  };
};

export default useUpdateAccount;
