import useApiFetch from '../../../common/hooks/useApiFetch';
import { IBoostAudience, IPaymentType } from '../boost.store';

interface InsightEstimateParams {
  daily_bid: number;
  duration: number;
  payment_method: 1 | 2;
  audience: 1 | 2;
}

interface InsightEstimateResponse {
  cpm: { high: number; low: number };
  views: { high: number; low: number };
}

export default function useBoostInsights({
  amount,
  duration,
  paymentType,
  audience,
}: {
  amount: number;
  duration: number;
  paymentType: IPaymentType;
  audience: IBoostAudience;
}) {
  const fetchStore = useApiFetch<
    InsightEstimateResponse,
    InsightEstimateParams
  >('api/v3/boosts/insights/estimate', {
    params: {
      daily_bid: amount,
      duration,
      payment_method: paymentType === 'cash' ? 1 : 2,
      audience: audience === 'safe' ? 1 : 2,
    },
  });

  return {
    insights: fetchStore.result,
    ...fetchStore,
  };
}
