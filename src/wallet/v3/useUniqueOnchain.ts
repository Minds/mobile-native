import useApiFetch from '../../common/hooks/useApiFetch';

export default function useUniqueOnchain() {
  const store = useApiFetch<any>('api/v3/blockchain/unique-onchain', {
    params: {},
  });

  return store;
}
