import { useQueries } from '@tanstack/react-query';
import useApiFetch from '~/common/hooks/useApiFetch';
import { BoostStoreType } from '../boost-composer/boost.store';
import sp from '~/services/serviceProvider';

interface InsightEstimateParams {
  daily_bid: number;
  duration: number;
  payment_method: 1 | 2;
  audience: 1 | 2;
}

export interface InsightEstimateResponse {
  cpm: { high: number; low: number };
  views: { high: number; low: number };
}

export default function useBoostInsights(boostStore: BoostStoreType) {
  const fetchStore = useApiFetch<
    InsightEstimateResponse,
    InsightEstimateParams
  >('api/v3/boosts/insights/estimate', {
    params: {
      daily_bid: boostStore.amount,
      duration: boostStore.duration,
      payment_method: boostStore.paymentType === 'cash' ? 1 : 2,
      audience: boostStore.audience === 'safe' ? 1 : 2,
    },
  });

  boostStore.setInsights(fetchStore.result);

  return {
    insights: fetchStore.result,
    ...fetchStore,
  };
}

type CachedBoostInsights = {
  daily_bid: number;
  duration: number;
  safeAudience: boolean;
};
export const useCachedBoostInsights = (products: CachedBoostInsights[]) => {
  const productQueries = useQueries({
    queries: products.map(({ daily_bid, duration, safeAudience }) => {
      return {
        queryKey: ['insights', daily_bid, duration, safeAudience],
        queryFn: () =>
          sp.api.get('api/v3/boosts/insights/estimate', {
            daily_bid,
            duration,
            audience: safeAudience ? 1 : 2,
            payment_method: 1, // cash
          }),
      };
    }),
  });

  return productQueries;
};
