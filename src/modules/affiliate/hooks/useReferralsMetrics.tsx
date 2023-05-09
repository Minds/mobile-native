import useApiQuery from '~/services/hooks/useApiQuery';

type MetricResponse = {
  amount_cents: number;
  amount_tokens: number;
  amount_usd: number;
};

export const useReferralsMetrics = () =>
  useApiQuery<MetricResponse>(
    ['referrals/metrics'],
    'api/v3/referrals/metrics',
  );
