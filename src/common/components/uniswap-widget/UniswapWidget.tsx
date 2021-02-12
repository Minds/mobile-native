import React from 'react';
import WebviewModal from '../WebviewModal';

type UniswapAction = 'swap' | 'add';

type Props = {
  isVisible: boolean;
  action?: UniswapAction;
  onCloseButtonPress: () => void;
  tokenAddress: string;
};

const getUniSwapURL = (action: UniswapAction, tokenAddress) => {
  const baseURL = 'https://app.uniswap.org/#';

  if (action === 'swap') {
    return `${baseURL}/${action}?outputCurrency=${tokenAddress}`;
  } else {
    return `${baseURL}/${action}/ETH/${tokenAddress}`;
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
  tokenAddress,
}: Props) {
  return (
    <WebviewModal
      isVisible={isVisible}
      uri={getUniSwapURL(action, tokenAddress)}
      onCloseButtonPress={onCloseButtonPress}
    />
  );
}
