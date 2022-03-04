import { useApiPost } from '~/common/hooks/useApiFetch';

const useUpdateAccount = () => {
  const response = useApiPost('api/v3/twitter-sync');

  return {
    ...response,
    updateAccount: data => response.post(data),
  };
};

export default useUpdateAccount;
