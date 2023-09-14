import {
  GiftCardProductIdEnum,
  useFetchPaymentMethodsQuery,
} from '~/graphql/api';

export const useGifts = () => {
  const { data } = useFetchPaymentMethodsQuery({
    giftCardProductId: GiftCardProductIdEnum.Boost,
  });
  const creditPaymentMethod = data?.paymentMethods?.[0]?.id;
  const balance = data?.paymentMethods?.[0]?.balance;
  return {
    creditPaymentMethod,
    balance,
  };
};
