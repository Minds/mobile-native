import Connector from '@walletconnect/core';
import {
  IWalletConnectOptions,
  IPushServerOptions,
  ISessionStorage,
} from '@walletconnect/types';
import * as cryptoLib from '@walletconnect/iso-crypto';

class WalletConnect extends Connector {
  constructor(
    connectorOpts: IWalletConnectOptions,
    pushServerOpts?: IPushServerOptions,
    sessionStorage?: ISessionStorage,
  ) {
    super({
      cryptoLib,
      connectorOpts,
      pushServerOpts,
      sessionStorage,
    });
  }
}

export default WalletConnect;
