import React from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import type { IMobileRegistryEntry } from '@walletconnect/types';
import Web3 from 'web3';
import { useLocalStore } from 'mobx-react';
import { makeAccessRequest } from './util';
import { Linking, Platform } from 'react-native';
import { when } from 'mobx';
import WalletConnectModal from './modal/WalletConnectModal';

let registry: Array<IMobileRegistryEntry> | null = null;

function getRegistry(): Array<IMobileRegistryEntry> {
  if (!registry) {
    registry = require('@walletconnect/mobile-registry/registry.json');
  }
  return registry as Array<IMobileRegistryEntry>;
}

// Minds metadata for wallet connect
const MINDS_METADATA = {
  description: 'Minds',
  url: 'https://www.minds.com',
  icons: ['https://cdn.minds.com/icon/100000000000000519/large/1589923649'],
  name: 'Minds',
};

export const WCContext = React.createContext<WCStore | null>(null);
/**
 * Context provider
 */
export const WCContextProvider = ({ children }) => {
  // wallet connect store
  const store = useLocalStore(createStore);

  return (
    <WCContext.Provider value={store}>
      {children}
      <WalletConnectModal />
    </WCContext.Provider>
  );
};

export type WCStore = {
  modalVisible: boolean;
  selectedWallet?: IMobileRegistryEntry;
  web3: Web3 | null;
  provider: WalletConnectProvider | null;
  connected: boolean;
  chainId: number | null;
  accounts: string[] | null;
  address: string | null;
  setWeb3: (newValue: WCStore['web3']) => void;
  setProvider: (newValue: WCStore['provider']) => void;
  setConnected: (newValue: WCStore['connected']) => void;
  setChainId: (newValue: WCStore['chainId']) => void;
  setAccounts: (newValue: WCStore['accounts']) => void;
  setAddress: (newValue: WCStore['address']) => void;
  resetConnection: () => void;
  connect: (IMobileRegistryEntry?) => Promise<string[]>;
  setupProvider: () => void;
  showModal: () => void;
  hideModal: () => void;
  setSelectedWallet: (wallet: IMobileRegistryEntry) => void;
  getBalance: (address: string) => Promise<string>;
  openWalletApp: () => void;
};

export const createStore = (): WCStore => ({
  web3: null,
  provider: null,
  connected: false,
  chainId: null,
  accounts: null,
  address: null,
  modalVisible: false,
  selectedWallet: undefined,
  async showModal() {
    this.modalVisible = true;

    // we wai until the wallet is selected
    try {
      await when(() => this.selectedWallet !== undefined, { timeout: 10000 });
    } finally {
      // we hide the modal in case modal timeouts
      this.hideModal();
    }
  },
  hideModal() {
    this.modalVisible = false;
  },
  setSelectedWallet(wallet: IMobileRegistryEntry) {
    this.selectedWallet = wallet;
  },
  setupProvider() {
    const provider = new WalletConnectProvider({
      bridge: "https://bridge.walletconnect.org",
      infuraId: 'b76cba91dc954ceebff27244923224b1',
      clientMeta: MINDS_METADATA,
      qrcode: false,
      chainId: 4,
    });
    const web3 = new Web3(provider as any);
    this.setWeb3(web3);
    this.setProvider(provider);
    // open wallet using deep linking
    this.provider?.connector.on('display_uri', (_, payload) => {
      makeAccessRequest(payload.params[0], this.selectedWallet);
    });

    this.provider?.on('connect', async () => {
      this.setConnected(true);
      this.setAccounts(provider.accounts);
      this.setAddress(provider.accounts[0]);
      this.setChainId(provider.chainId);
    });
    this.provider?.on('accountsChanged', async (accounts: string[]) => {
      this.setAccounts(accounts);
      this.setAddress(accounts[0]);
    });
    this.provider?.on('disconnect', async () => {
      this.setConnected(false);
      this.setAccounts(null);
      this.setAddress(null);
      this.setChainId(null);
    });
  },
  async connect() {
    if (Platform.OS === 'ios' && !this.selectedWallet) {
      await this.showModal();
      if (!this.selectedWallet) {
        throw new Error('No wallet selected');
      }
    }
    if (!this.provider) {
      this.setupProvider();
    } else {
      // If the provider is not connected then we recreate the provider
      if (!this.provider?.connector.connected) {
        this.setupProvider();
      }
    }

    if (this.connected && this.accounts) {
      return this.accounts;
    }
    const result = await this.provider?.enable();
    return result as string[];
  },
  setWeb3(newValue: WCStore['web3']) {
    this.web3 = newValue;
  },
  setProvider(newValue: WCStore['provider']) {
    this.provider = newValue;
  },
  setConnected(newValue: WCStore['connected']) {
    this.connected = newValue;
  },
  setChainId(newValue: WCStore['chainId']) {
    this.chainId = newValue;
  },
  setAccounts(newValue: WCStore['accounts']) {
    this.accounts = newValue;
  },
  setAddress(newValue: WCStore['address']) {
    this.address = newValue;
  },
  resetConnection() {
    this.provider?.disconnect();
    this.setConnected(false);
    this.setChainId(null);
    this.setAccounts(null);
    this.setAddress(null);
  },
  /**
   * Bring focus to the wallet app
   */
  openWalletApp() {
    const r = getRegistry();

    const wallet = r.find(
      (d) => d.shortName === this.provider?.walletMeta?.name,
    );
    if (wallet) {
      Linking.openURL(
        `${wallet.deepLink}${wallet.deepLink.endsWith(':') ? '//' : '/'}`,
      );
    }
  },
  /**
   * Get ETH balance of address
   */
  async getBalance(address: string) {
    if (!this.web3 || !this.connected) {
      throw new Error('Connect first');
    }
    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
  },
});
