import React from 'react';
import { BLOCKCHAIN_TOKEN_ADDRESS } from '../../../config/Config';
import WebviewModal from '../WebviewModal';

type UniswapAction = 'swap' | 'add';

type Props = {
  isVisible: boolean;
  action?: UniswapAction;
  onCloseButtonPress: () => void;
};

const getUniSwapURL = (action: UniswapAction) => {
  const baseURL = 'https://app.uniswap.org/#';

  if (action === 'swap') {
    return `${baseURL}/${action}?outputCurrency=${BLOCKCHAIN_TOKEN_ADDRESS}`;
  } else {
    return `${baseURL}/${action}/ETH/${BLOCKCHAIN_TOKEN_ADDRESS}`;
  }
};

/**
 * The Uniswap Widget supports to action options:
 * swap => opens standard tokens swap
 * add => opens uniswap pool
 *
 */
export default function ({
  isVisible,
  onCloseButtonPress,
  action = 'swap',
}: Props) {
  return (
    <WebviewModal
      isVisible={isVisible}
      uri={getUniSwapURL(action)}
      onCloseButtonPress={onCloseButtonPress}
    />
  );
}
