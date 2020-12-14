import React, { useEffect } from 'react';
import Pusher from 'pusher-js/react-native';
import WebviewModal from '../../common/components/WebviewModal';
import { TRANSAK_API_KEY } from '../../config/Config';

const pusher = new Pusher('1d9ffac87de599c61283', { cluster: 'ap2' }); // Transak Public API
const partnerOrderId = '23487492'; // Can be any number. It is required for the iframe to work properly
const channelName = `${TRANSAK_API_KEY}_${partnerOrderId}`;

// TODO: Replace this based upon environment config
const getTransakDomain = (isProdEnvironment: boolean) =>
  isProdEnvironment
    ? 'https://global.transak.com'
    : 'https://staging-global.transak.com';

const transakURL = `${getTransakDomain(
  false,
)}?apiKey=${TRANSAK_API_KEY}&partnerOrderId=${partnerOrderId}&defaultCryptoCurrency=ETH`;

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
};

export default function ({
  isVisible,
  onOrderProcessed,
  onCloseButtonPress,
  onError,
}: Props) {
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
  }, [onOrderProcessed, onError]);

  return (
    <WebviewModal
      isVisible={isVisible}
      uri={transakURL}
      onCloseButtonPress={onCloseButtonPress}
    />
  );
}
