import React, { useEffect } from 'react';
import Pusher from 'pusher-js/react-native';
import jwt from 'jsonwebtoken';
import {
  BLOCKCHAIN_TOKEN_ADDRESS,
  TRANSAK_API_KEY,
  TRANSAK_PARTNER_API_SECRET,
} from '../../config/Config';
import WebviewModal from '../../common/components/WebviewModal';

//TODO: define this configuration file
const getBaseURL = (isProdEnvironment: boolean) =>
  isProdEnvironment
    ? 'https://global.transak.com'
    : 'https://staging-global.transak.com';

const transakURL = `${getBaseURL(
  false,
)}?apiKey=${TRANSAK_API_KEY}&defaultCryptoCurrency=ETH&walletAddress=${BLOCKCHAIN_TOKEN_ADDRESS}`;

const pusher = new Pusher('1d9ffac87de599c61283', { cluster: 'ap2' });

const decrypt = function (encryptedOrderData: string | object) {
  if (encryptedOrderData && typeof encryptedOrderData === 'string') {
    try {
      const decryptedOrderData = jwt.verify(
        encryptedOrderData,
        TRANSAK_PARTNER_API_SECRET,
      );
      if (decryptedOrderData && (decryptedOrderData as any).id) {
        console.log({ orderData: decryptedOrderData });
      }
    } catch (e) {
      console.error(e);
    }
  }
};

type Props = {
  isVisible: boolean;
  onOrderSuccessFull: (response) => void;
  onError: (response) => void;
  onCloseButtonPress: () => void;
};

export default function ({
  isVisible,
  onOrderSuccessFull,
  onCloseButtonPress,
}: Props) {
  useEffect(() => {
    pusher.subscribe(TRANSAK_API_KEY);

    //receive updates of all the orders
    pusher.bind_global((orderId, encryptedOrderData) => {
      console.log(`Order update ${orderId}`);
      onOrderSuccessFull(decrypt(encryptedOrderData));
    });

    return () => {
      pusher.unsubscribe(TRANSAK_API_KEY);
    };
  }, [onOrderSuccessFull]);
  return (
    <WebviewModal
      isVisible={isVisible}
      uri={transakURL}
      closeButtonPosition={'left'}
      onCloseButtonPress={onCloseButtonPress}
    />
  );
}
