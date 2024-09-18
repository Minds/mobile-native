import useApiFetch from '../../common/hooks/useApiFetch';
import { ApiResponse } from '~/common/services/ApiResponse';

type UniqueOnchainType = {
  unique: boolean;
  address: string;
} & ApiResponse;

export function isConnected(store: UniqueOnChainStoreType) {
  return store.result && store.result.address && store.result.unique;
}

export default function useUniqueOnchain() {
  const store = useApiFetch<UniqueOnchainType>(
    'api/v3/blockchain/unique-onchain',
    {
      params: {},
    },
  );

  return store;
}

export type UniqueOnChainStoreType = ReturnType<typeof useUniqueOnchain>;
