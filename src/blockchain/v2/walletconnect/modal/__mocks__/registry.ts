const registry = require('@walletconnect/mobile-registry/registry.json');
import { IMobileRegistryEntry } from '@walletconnect/types';

export const Wallets: IMobileRegistryEntry[] = registry.slice(0, 5);

export const Logos = {
  Rainbow: require('../../../../../assets/logos/bulb.png'),
  MetaMask: require('../../../../../assets/logos/bulb.png'),
  Argent: require('../../../../../assets/logos/bulb.png'),
  Trust: require('../../../../../assets/logos/bulb.png'),
  'Crypto.com': require('../../../../../assets/logos/bulb.png'),
};
