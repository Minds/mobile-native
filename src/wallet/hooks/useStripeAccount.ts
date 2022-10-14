import React from 'react';
import { useStores } from '~/common/hooks/use-stores';

/**
 * Use stripe account hook
 * It returns the stripe account observable and makes the initial load if necessary
 */
export default function useStripeAccount() {
  const { wallet } = useStores();

  React.useEffect(() => {
    if (!wallet.stripeDetails.loaded) {
      wallet.loadStripeAccount();
    }
  }, [wallet]);

  return wallet.stripeDetails;
}
