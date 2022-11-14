import React from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import type { IMobileRegistryEntry } from '@walletconnect/types';
import Web3 from 'web3';
import { useLocalStore } from 'mobx-react';
import { makeAccessRequest } from './util';
import { Linking, Platform } from 'react-native';
import { when } from 'mobx';
import WalletConnectModal from './modal/WalletConnectModal';
import { showNotification } from '../../../../AppMessages';

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

const DEEPLINK_DELAY_MS = 1500;

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
    // Provider should have a clean slate
    this.setProvider(null);
    this.setWeb3(null);
    this.setConnected(false);
    this.setAccounts(null);
    this.setAddress(null);
    this.setChainId(null);

    const provider = new WalletConnectProvider({
      infuraId: '708b51690a43476092936f9818f8c4fa',
      bridge: 'https://bridge.walletconnect.org',
      clientMeta: MINDS_METADATA,
      qrcode: false,
      chainId: 1,
      pollingInterval: DEEPLINK_DELAY_MS,
    });

    // open wallet using deep linking
    provider.connector.on('display_uri', (err, payload) => {
      if (err) {
        console.error('[WalletConnect]: display_uri', err);
        return;
      }
      const uri = payload.params[0];
      console.log('[WalletConnect]: display_uri payload', payload, uri);
      setTimeout(
        () => makeAccessRequest(uri, this.selectedWallet),
        DEEPLINK_DELAY_MS,
      );
    });

    provider.on('connect', async (err, payload) => {
      console.log('[WalletConnect]: connect event', err, payload);

      showNotification('Wallet successfully connected', 'info');

      this.setConnected(true);
      this.setChainId(provider.chainId);

      // const token = pushService.push.token;
      const topic = provider.wc.clientId;
      // const bridge = provider.wc.bridge;

      const subscribeOpts = {
        topic,
        webhook: 'https://webhook.site/211bb5c6-e245-419b-bf45-dbd9973ce3bb',
      };

      try {
        // await fetch("https://webhook.site/211bb5c6-e245-419b-bf45-dbd9973ce3bb", {
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   body: "Hello from the app, are you working?",
        // });

        const response = await fetch(
          'https://bridge.walletconnect.org/subscribe',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscribeOpts),
          },
        );
        console.log(subscribeOpts, response);
      } catch (error) {
        console.error('[WalletConnect]: bridge subscribe', error);
      }

      // const pushSubscription: IPushSubscription = {
      //   bridge,
      //   topic,
      //   type: 'fcm',
      //   token,
      //   peerName: "",
      //   language: "",
      // };
      // console.log(pushSubscription);

      // try {
      // const response = await fetch(`https://push.walletconnect.org/new`, {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(pushSubscription),
      // });
      //   console.log(response);
      // } catch (err) {
      //   console.error('[WalletConnect.pushRegister]:', err);
      // }
    });

    provider.on('accountsChanged', async (accounts: string[]) => {
      console.log('[WalletConnect]: accountsChanged');
      this.setAccounts(accounts);
      this.setAddress(accounts[0]);
    });

    provider.on('message', async () => {
      console.log('[WalletConnect]: message received');
    });

    provider.on('disconnect', async () => {
      console.log('[WalletConnect]: disconnect event');

      showNotification('Wallet was disconnected', 'warning');

      this.setProvider(null);
      this.setWeb3(null);
      this.setConnected(false);
      this.setAccounts(null);
      this.setAddress(null);
      this.setChainId(null);
    });

    provider.connector.on('ping', async () => {
      console.log('[WalletConnect]: ping');
    });

    provider.connector.on('session_update', async (err, payload) => {
      console.log('[WalletConnect]: session updated', err, payload);
    });

    provider.connector.on('session_request', async (err, payload) => {
      console.log('[WalletConnect]: session requested', err, payload);
    });

    provider.on('call_request', async () => {
      console.log('[WalletConnect]: call request made');
    });

    provider.connector.on('wc_sessionRequest', async () => {
      console.log('wc_sessionRequest');
    });

    provider.connector.on('eth_signTypedData', async () => {
      console.log('eth_signTypedData');
    });

    const web3 = new Web3(provider as any);

    this.setWeb3(web3);
    this.setProvider(provider);
  },
  async connect() {
    if (this.provider) {
      console.log(this.provider);
      // If the provider is not connected then we recreate the provider
      if (!this.provider?.connector.connected) {
        console.log(
          '[WalletConnect.connect]: not connected, so we will resetup the provider',
        );
        //await this.resetConnection();
        this.setupProvider();
      }
    } else {
      if (Platform.OS === 'ios' && !this.selectedWallet) {
        showNotification(
          "WalletConnect doesn't work on iOS. Please use a desktop browser.",
          'warning',
        );
        return [''];
        // await this.showModal();
        // if (!this.selectedWallet) {
        //   throw new Error('No wallet selected');
        // }
      }
      this.setupProvider();
    }

    //await this.provider?.triggerConnect();

    if (this.connected && this.accounts) {
      console.log(
        '[WalletConnect.connect]: We already have accounts so we will skip .enable()',
      );
      return this.accounts;
    }

    showNotification('Please connect your wallet', 'info', 0);

    try {
      const result = await this.provider?.enable();
      return result as string[];
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        showNotification(err.toString(), 'danger');
      }
    }
    return [''];
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
  async resetConnection() {
    await this.provider?.disconnect();
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

    let wallet = r.find(d => d.shortName === this.provider?.walletMeta?.name);
    if (!wallet && this.selectedWallet) {
      wallet = this.selectedWallet;
    }
    if (wallet !== undefined) {
      setTimeout(() => {
        Linking.openURL(
          // @ts-ignore - You are confused Mr. Linter ... there is an if statement above
          `${wallet.deepLink}${wallet.deepLink.endsWith(':') ? '//' : '/'}`,
        );
      }, DEEPLINK_DELAY_MS);
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
