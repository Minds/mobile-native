const registry = require('@walletconnect/mobile-registry/registry.json');
import { Wallet } from '../../../blockchain/services/WalletConnectService';

export const Wallets: Wallet[] = registry.slice(0, 5);

export const Logos = {
  Rainbow: require('@walletconnect/mobile-registry/logos/rainbow.png'),
  MetaMask: require('@walletconnect/mobile-registry/logos/metamask.png'),
  Argent: require('@walletconnect/mobile-registry/logos/argent.png'),
  Trust: require('@walletconnect/mobile-registry/logos/trust.png'),
  'Crypto.com': require('@walletconnect/mobile-registry/logos/crypto-defi.png'),
};
