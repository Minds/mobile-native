import React from 'react';
import { WCContext, WCStore } from './WalletConnectContext';

const useWalletConnect = (): WCStore => {
  const store = React.useContext(WCContext);
  if (!store) {
    throw new Error('Wrap your app into a WCContextProvider');
  }
  return store;
};

export default useWalletConnect;
