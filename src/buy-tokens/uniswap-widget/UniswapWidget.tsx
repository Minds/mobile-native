import React from 'react';
import { BLOCKCHAIN_TOKEN_ADDRESS } from '../../config/Config';
import WebviewModal from '../../common/components/WebviewModal';

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
