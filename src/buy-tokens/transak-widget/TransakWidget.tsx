import React, { useEffect } from 'react';
import Pusher from 'pusher-js/react-native';
import WebviewModal from '../../common/components/WebviewModal';

const pusher = new Pusher('1d9ffac87de599c61283', { cluster: 'ap2' }); // Transak Public API
const partnerOrderId = Math.floor(10000000 + Math.random() * 90000000); // Can be any number. It is required for the iframe to work properly

// TODO: Replace this based upon environment config
const getTransakDomain = (isProdEnvironment: boolean) =>
  isProdEnvironment
    ? 'https://global.transak.com'
    : 'https://staging-global.transak.com';

export interface TransakOrderProcessed {
  id: string;
  status: string;
  totalFeeInFiat: string;
  walletAddress: string;
  walletLink: string;
  cryptoAmount: number;
  cryptoCurrency: string;
  fiatAmount: number;
  fiatCurrency: string;
  paymentOptionId: string;
}

type Props = {
  isVisible: boolean;
  onOrderProcessed: (response: TransakOrderProcessed) => void;
  onError: (response) => void;
  onCloseButtonPress: () => void;
  transakApiKey: string;
};

export default function ({
  isVisible,
  onOrderProcessed,
  onCloseButtonPress,
  onError,
  transakApiKey,
}: Props) {
  const channelName = `${transakApiKey}_${partnerOrderId}`;
  const transakURL = `${getTransakDomain(
    false,
  )}?apiKey=${transakApiKey}&partnerOrderId=${partnerOrderId}&defaultCryptoCurrency=ETH`;

  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind('ORDER_PROCESSING', (orderData: TransakOrderProcessed) => {
      onOrderProcessed(orderData);
    });

    channel.bind('ORDER_FAILED', (orderData) => {
      onError(orderData);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [onOrderProcessed, onError, channelName]);

  return (
    <WebviewModal
      isVisible={isVisible}
      uri={transakURL}
      onCloseButtonPress={onCloseButtonPress}
    />
  );
}
