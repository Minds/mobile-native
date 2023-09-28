import useApiFetch from '../../../common/hooks/useApiFetch';
import { BoostStoreType } from '../boost-composer/boost.store';

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
