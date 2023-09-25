import { showNotification } from 'AppMessages';
import { useEffect } from 'react';
import {
  GiftCardProductIdEnum,
  useFetchPaymentMethodsQuery,
} from '~/graphql/api';

export const useGifts = () => {
  const { data, isError } = useFetchPaymentMethodsQuery({
    giftCardProductId: GiftCardProductIdEnum.Boost,
  });

  useEffect(() => {
    if (isError) {
      showNotification('Gifts could not be retrieved. Please try again.');
    }
  }, [isError]);

  const creditPaymentMethod = data?.paymentMethods?.[0]?.id;
  const balance = data?.paymentMethods?.[0]?.balance;
  return {
    creditPaymentMethod,
    balance,
  };
};
