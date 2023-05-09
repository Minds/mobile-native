import React from 'react';
import { useReferralsMetrics } from '../hooks/useReferralsMetrics';
import { B2, H2 } from '~/common/ui';

export default function TotalEarnings() {
  const query = useReferralsMetrics();

  const total = query.data ? '$' + query.data.amount_usd || 0 : '-';

  return (
    <>
      <H2 top="XXL">Total Earnings</H2>
      <B2 color="secondary" vertical="L">
        Track your total earnings through your unique affiliate link, for both
        existing and new members on Minds
      </B2>
      <H2>{total}</H2>
    </>
  );
}
